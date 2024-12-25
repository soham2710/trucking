// app/api/submit-lead/route.ts
import { NextResponse } from 'next/server';
import nodemailer, { TransportOptions, createTransport } from 'nodemailer';
import { supabase } from '@/lib/supabase';

interface LeadData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message }: LeadData = body;

    // Store in Supabase
    const { error } = await supabase
      .from('leads')
      .insert([
        {
          name,
          email,
          phone,
          service,
          message,
          status: 'new',
          created_at: new Date().toISOString()
        }
      ]);

    if (error) throw error;

    // Send email notification
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New Lead: ${service} Request from ${name}`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Service:</strong> ${service}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/leads">View All Leads</a></p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}