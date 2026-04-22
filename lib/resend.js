import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

// Helper: kirim notifikasi penugasan
export async function sendAssignmentEmail({ to, name, contentTitle, role, deadline }) {
  await resend.emails.send({
    from: 'ProdFlow <notif@prodflow.kamu.com>',
    to,
    subject: `[ProdFlow] Kamu ditugaskan: ${contentTitle}`,
    html: `
      <h2>Halo ${name}!</h2>
      <p>Kamu mendapat penugasan baru di ProdFlow:</p>
      <table style="border-collapse:collapse;width:100%">
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Konten</strong></td><td style="padding:8px;border:1px solid #eee">${contentTitle}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Peranmu</strong></td><td style="padding:8px;border:1px solid #eee">${role}</td></tr>
        <tr><td style="padding:8px;border:1px solid #eee"><strong>Deadline</strong></td><td style="padding:8px;border:1px solid #eee">${deadline}</td></tr>
      </table>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Lihat di ProdFlow →</a></p>
    `
  })
}

// Helper: kirim notifikasi revisi
export async function sendRevisionEmail({ to, name, contentTitle, revisionNote }) {
  await resend.emails.send({
    from: 'ProdFlow <notif@prodflow.kamu.com>',
    to,
    subject: `[ProdFlow] Revisi diperlukan: ${contentTitle}`,
    html: `
      <h2>Halo ${name}!</h2>
      <p>PIC telah memberikan catatan revisi untuk kontenmu:</p>
      <blockquote style="border-left:3px solid #E24B4A;padding:8px 16px;background:#FCEBEB">
        ${revisionNote}
      </blockquote>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard">Buka ProdFlow →</a></p>
    `
  })
}