// app/api/contents/route.js
// CRUD untuk konten & assignee ke Supabase

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// GET: ambil semua konten + assignee-nya
export async function GET() {
  try {
    const { data: contents, error: cErr } = await supabase
      .from('contents')
      .select('*')
      .order('created_at', { ascending: false })

    if (cErr) throw cErr

    const { data: assignees, error: aErr } = await supabase
      .from('assignees')
      .select('*')

    if (aErr) throw aErr

    // Gabungkan assignees ke dalam tiap konten
    const result = contents.map(c => ({
      id: c.id,
      title: c.title,
      cat: c.cat,
      loadType: c.load_type,
      start: c.start_date,
      end: c.end_date,
      brief: c.brief,
      pic: c.pic_id,
      assignees: assignees
        .filter(a => a.content_id === c.id)
        .map(a => ({
          userId: a.user_id,
          role: a.role,
          status: a.status,
          submitLink: a.submit_link,
          submitNote: a.submit_note,
          revisionNote: a.revision_note,
          attachments: a.attachments || [],
          assigneeDbId: a.id,
        }))
    }))

    return NextResponse.json({ contents: result })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: buat konten baru
export async function POST(request) {
  try {
    const { title, cat, loadType, start, end, brief, pic, assignees } = await request.json()

    // Insert konten
    const { data: content, error: cErr } = await supabase
      .from('contents')
      .insert({ title, cat, load_type: loadType, start_date: start, end_date: end, brief, pic_id: pic })
      .select()
      .single()

    if (cErr) throw cErr

    // Insert assignees
    if (assignees?.length) {
      const { error: aErr } = await supabase
        .from('assignees')
        .insert(assignees.map(a => ({
          content_id: content.id,
          user_id: a.userId,
          role: a.role,
          status: 'aktif',
        })))

      if (aErr) throw aErr
    }

    return NextResponse.json({ success: true, contentId: content.id })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH: update status assignee (submit / approve / revisi)
export async function PATCH(request) {
  try {
    const { assigneeDbId, status, submitLink, submitNote, revisionNote, attachments } = await request.json()

    const updates = { status }
    if (submitLink !== undefined) updates.submit_link = submitLink
    if (submitNote !== undefined) updates.submit_note = submitNote
    if (revisionNote !== undefined) updates.revision_note = revisionNote
    if (attachments !== undefined) updates.attachments = attachments
    if (status === 'review') updates.submitted_at = new Date().toISOString()
    if (status === 'selesai' || status === 'revisi') updates.reviewed_at = new Date().toISOString()

    const { error } = await supabase
      .from('assignees')
      .update(updates)
      .eq('id', assigneeDbId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}