// app/api/notify/route.js
// File ini WAJIB ada agar email notifikasi bisa terkirim via Resend
// Letakkan di: app/api/notify/route.js

import { Resend } from 'resend'
import { NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

// Email pengirim — pakai format ini saat development (domain belum diverifikasi)
// Ganti dengan email domain kamu sendiri setelah domain diverifikasi di Resend
const FROM_EMAIL = 'TIKKIM <onboarding@resend.dev>'

// ─── TEMPLATE EMAIL ────────────────────────────────────────────────────────────
function baseTemplate(content) {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      body { margin:0; padding:0; background:#f0f4f8; font-family:'Segoe UI',Arial,sans-serif; }
      .wrap { max-width:520px; margin:32px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,53,128,.08); }
      .header { background:#003580; padding:24px 28px; }
      .logo { font-size:22px; font-weight:900; color:#FFD700; letter-spacing:-1px; }
      .logo-sub { font-size:10px; color:rgba(255,255,255,.45); letter-spacing:1px; margin-top:2px; }
      .body { padding:28px; }
      .title { font-size:18px; font-weight:700; color:#0A1628; margin-bottom:8px; line-height:1.4; }
      .info-box { background:#EEF2F9; border-radius:8px; padding:14px 16px; margin:16px 0; }
      .info-row { display:flex; gap:8px; margin-bottom:6px; font-size:13px; }
      .info-row:last-child { margin-bottom:0; }
      .info-label { color:#5A7A9A; min-width:80px; font-weight:500; }
      .info-value { color:#0A1628; font-weight:600; }
      .note-box { background:#FFFBEB; border:1px solid #FCD34D; border-radius:8px; padding:12px 14px; margin:16px 0; font-size:13px; color:#92400E; }
      .revision-box { background:#FEF2F2; border:1px solid #FCA5A5; border-radius:8px; padding:12px 14px; margin:16px 0; font-size:13px; color:#B91C1C; }
      .btn { display:inline-block; background:#003580; color:#FFD700; padding:11px 22px; border-radius:9px; text-decoration:none; font-weight:700; font-size:14px; margin-top:12px; }
      .footer { padding:16px 28px; border-top:1px solid #e8ecf4; font-size:11px; color:#9CA3AF; }
      .link-box { background:#EFF4FF; border-radius:8px; padding:10px 14px; margin:12px 0; }
      .link-box a { color:#003580; font-size:13px; word-break:break-all; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="header">
        <div class="logo">TIKKIM</div>
        <div class="logo-sub">CONTENT MANAGER</div>
      </div>
      <div class="body">${content}</div>
      <div class="footer">
        Email ini dikirim otomatis oleh TIKKIM Content Manager. Jangan balas email ini.
      </div>
    </div>
  </body>
  </html>
  `
}

// ─── HANDLER ──────────────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const body = await request.json()
    const { type, to, ...data } = body

    if (!to) {
      return NextResponse.json({ error: 'Email penerima tidak ada' }, { status: 400 })
    }

    let subject = ''
    let html = ''

    // ── 1. Notifikasi penugasan baru (ke anggota tim) ──────────────────────────
    if (type === 'assign') {
      const { memberName, contentTitle, role, deadline, pic, brief } = data
      subject = `[TIKKIM] Penugasan baru: ${contentTitle}`
      html = baseTemplate(`
        <div class="title">Kamu mendapat penugasan baru! 🎬</div>
        <p style="font-size:14px;color:#5A7A9A;margin:0 0 16px">Halo <strong style="color:#0A1628">${memberName}</strong>, PIC telah mendelegasikan tugas kepadamu.</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Konten</span><span class="info-value">${contentTitle}</span></div>
          <div class="info-row"><span class="info-label">Peranmu</span><span class="info-value">${role}</span></div>
          <div class="info-row"><span class="info-label">Deadline</span><span class="info-value">${deadline}</span></div>
          <div class="info-row"><span class="info-label">PIC</span><span class="info-value">${pic}</span></div>
        </div>
        ${brief ? `<div class="note-box"><strong>Brief:</strong> ${brief}</div>` : ''}
        <p style="font-size:13px;color:#5A7A9A">Selesaikan tugasmu dan submit hasilnya melalui TIKKIM sebelum deadline.</p>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}">Buka TIKKIM →</a>
      `)
    }

    // ── 2. Notifikasi submit ke PIC ────────────────────────────────────────────
    else if (type === 'submit') {
      const { picName, memberName, contentTitle, role, link, note, attachments } = data
      subject = `[TIKKIM] Submit masuk: ${contentTitle} — dari ${memberName}`
      html = baseTemplate(`
        <div class="title">Ada konten yang perlu kamu review 🔍</div>
        <p style="font-size:14px;color:#5A7A9A;margin:0 0 16px">Halo <strong style="color:#0A1628">${picName}</strong>, ${memberName} telah mengirimkan hasil kerja.</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Konten</span><span class="info-value">${contentTitle}</span></div>
          <div class="info-row"><span class="info-label">Dari</span><span class="info-value">${memberName} (${role})</span></div>
        </div>
        ${link ? `<div class="link-box">🔗 <a href="${link}">${link}</a></div>` : ''}
        ${note ? `<div class="note-box"><strong>Catatan dari ${memberName}:</strong><br>${note}</div>` : ''}
        ${attachments?.length ? `<div class="info-box"><span class="info-label">Lampiran:</span> ${attachments.join(', ')}</div>` : ''}
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}">Review Sekarang →</a>
      `)
    }

    // ── 3. Notifikasi approve ke anggota ──────────────────────────────────────
    else if (type === 'approve') {
      const { memberName, contentTitle, picName } = data
      subject = `[TIKKIM] ✅ Karyamu diapprove: ${contentTitle}`
      html = baseTemplate(`
        <div class="title">Selamat, karyamu diapprove! ✅</div>
        <p style="font-size:14px;color:#5A7A9A;margin:0 0 16px">Halo <strong style="color:#0A1628">${memberName}</strong>, PIC telah mereview dan menyetujui hasil kerjamu.</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Konten</span><span class="info-value">${contentTitle}</span></div>
          <div class="info-row"><span class="info-label">Diapprove oleh</span><span class="info-value">${picName}</span></div>
          <div class="info-row"><span class="info-label">Status</span><span class="info-value" style="color:#15803D">✅ Selesai</span></div>
        </div>
        <p style="font-size:13px;color:#5A7A9A">Kerja bagus! Lihat detail dan riwayat tugasmu di TIKKIM.</p>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}">Lihat di TIKKIM →</a>
      `)
    }

    // ── 4. Notifikasi revisi ke anggota ───────────────────────────────────────
    else if (type === 'revision') {
      const { memberName, contentTitle, picName, note } = data
      subject = `[TIKKIM] 📝 Revisi diperlukan: ${contentTitle}`
      html = baseTemplate(`
        <div class="title">Ada catatan revisi untukmu 📝</div>
        <p style="font-size:14px;color:#5A7A9A;margin:0 0 16px">Halo <strong style="color:#0A1628">${memberName}</strong>, PIC telah memberikan catatan revisi untuk hasil kerjamu.</p>
        <div class="info-box">
          <div class="info-row"><span class="info-label">Konten</span><span class="info-value">${contentTitle}</span></div>
          <div class="info-row"><span class="info-label">Dari PIC</span><span class="info-value">${picName}</span></div>
        </div>
        <div class="revision-box">
          <strong>Catatan Revisi:</strong><br>
          <span style="line-height:1.7;display:block;margin-top:6px">${note}</span>
        </div>
        <p style="font-size:13px;color:#5A7A9A">Segera perbaiki dan submit ulang melalui TIKKIM.</p>
        <a class="btn" href="${process.env.NEXT_PUBLIC_APP_URL}">Submit Ulang →</a>
      `)
    }

    else {
      return NextResponse.json({ error: `Tipe notifikasi tidak dikenal: ${type}` }, { status: 400 })
    }

    // ── Kirim via Resend ────────────────────────────────────────────────────────
    const { data: resendData, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: resendData?.id })

  } catch (err) {
    console.error('API notify error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}