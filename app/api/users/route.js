// app/api/users/route.js
// Handles creating real user accounts in Supabase Auth + profiles table

import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Pakai service role key agar bisa buat user tanpa konfirmasi email
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY  // BEDA dengan anon key!
)

// GET: ambil semua user
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) throw error
    return NextResponse.json({ users: data })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: buat user baru
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, password, role, cats, isIntern, startDate, endDate } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nama, email, dan password wajib diisi' }, { status: 400 })
    }

    // 1. Buat user di Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase().trim(),
      password,
      email_confirm: true,  // langsung aktif tanpa konfirmasi email
      user_metadata: { name, role, cats: cats || [], is_intern: isIntern || false }
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
      }
      throw authError
    }

    const userId = authData.user.id

    // 2. Upsert profile (trigger handle_new_user biasanya sudah jalan,
    //    tapi kita upsert manual untuk pastikan data lengkap)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: userId,
        name: name.trim(),
        role,
        cats: cats || [],
        is_intern: isIntern || false,
        active: true,
        start_date: startDate || new Date().toISOString().split('T')[0],
        end_date: endDate || null,
      })

    if (profileError) throw profileError

    return NextResponse.json({ success: true, userId })
  } catch (err) {
    console.error('Create user error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PATCH: update status aktif/nonaktif
export async function PATCH(request) {
  try {
    const { userId, active } = await request.json()
    if (!userId) return NextResponse.json({ error: 'userId wajib diisi' }, { status: 400 })

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ active })
      .eq('id', userId)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
// Pancingan untuk Vercel agar rebuild
console.log("API Users berjalan!");