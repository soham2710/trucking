// pages/api/notify-lead.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, phone, service, message, created_at } = req.body

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  })

  try {
    // Send mail with defined transport object
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: 'New Lead Submission',
      text: `
New Lead Submission:

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Message: ${message}
Submitted at: ${new Date(created_at).toLocaleString()}
      `,
      html: `
<h2>New Lead Submission</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>Service:</strong> ${service}</p>
<p><strong>Message:</strong> ${message}</p>
<p><strong>Submitted at:</strong> ${new Date(created_at).toLocaleString()}</p>
      `
    })

    res.status(200).json({ message: 'Notification sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Error sending notification' })
  }
}