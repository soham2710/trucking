// app/api/submit-lead/route.ts
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { supabase } from '@/lib/supabase';

// Define interfaces for TypeScript type checking
interface LeadItem {
  quantity: number;
  packagingType: string;
  length: string;
  width: string;
  height: string;
  weight: string;
  freightClass: string;
}

interface LocationDetails {
  zipCode: string;
  pickupDate?: string;
  isResidential: boolean;
  needsLiftgate: boolean;
  limitedAccess: boolean;
}

interface LeadData {
  // Contact Information
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name?: string;

  // Shipping Details
  type: 'ltl' | 'ftl';
  details: {
    items?: LeadItem[];
    equipmentType?: string;
    weight?: string;
    declaredValue?: string;
    pickupLocation: LocationDetails;
    deliveryLocation: LocationDetails;
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const leadData: LeadData = body;

    // Validate required fields
    if (!leadData.first_name || !leadData.last_name || !leadData.email || !leadData.phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Prepare lead data for Supabase insertion
    const supabaseLeadData = {
      // Contact Information
      first_name: leadData.first_name,
      last_name: leadData.last_name,
      email: leadData.email,
      phone: leadData.phone,
      company_name: leadData.company_name,

      // Shipping Details
      shipping_type: leadData.type,
      equipment_type: leadData.type === 'ftl' ? leadData.details.equipmentType : null,
      total_weight: leadData.details.weight ? parseFloat(leadData.details.weight) : null,
      declared_value: leadData.details.declaredValue ? parseFloat(leadData.details.declaredValue) : null,

      // Pickup Location Details
      pickup_zip_code: leadData.details.pickupLocation.zipCode,
      pickup_date: leadData.details.pickupLocation.pickupDate,
      pickup_is_residential: leadData.details.pickupLocation.isResidential,
      pickup_needs_liftgate: leadData.details.pickupLocation.needsLiftgate,
      pickup_limited_access: leadData.details.pickupLocation.limitedAccess,

      // Delivery Location Details
      delivery_zip_code: leadData.details.deliveryLocation.zipCode,
      delivery_is_residential: leadData.details.deliveryLocation.isResidential,
      delivery_needs_liftgate: leadData.details.deliveryLocation.needsLiftgate,
      delivery_limited_access: leadData.details.deliveryLocation.limitedAccess,

      // Default Status
      status: 'new',
      created_at: new Date().toISOString()
    };

    // Insert lead into Supabase
    const { data: insertedLead, error: leadInsertError } = await supabase
      .from('leads')
      .insert([supabaseLeadData])
      .select('id');

    if (leadInsertError) throw leadInsertError;

    // If LTL shipping, insert items
    if (leadData.type === 'ltl' && leadData.details.items && leadData.details.items.length > 0) {
      const leadItems = leadData.details.items.map(item => ({
        lead_id: insertedLead[0].id,
        quantity: parseInt(item.quantity.toString()),
        packaging_type: item.packagingType,
        freight_class: item.freightClass,
        length: parseFloat(item.length),
        width: parseFloat(item.width),
        height: parseFloat(item.height),
        weight: parseFloat(item.weight)
      }));

      const { error: itemsInsertError } = await supabase
        .from('lead_items')
        .insert(leadItems);

      if (itemsInsertError) throw itemsInsertError;
    }

    // Send email notification
    const transporter = createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New ${leadData.type.toUpperCase()} Lead: ${leadData.first_name} ${leadData.last_name}`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Phone:</strong> ${leadData.phone}</p>
        ${leadData.company_name ? `<p><strong>Company:</strong> ${leadData.company_name}</p>` : ''}
        <p><strong>Shipping Type:</strong> ${leadData.type.toUpperCase()}</p>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
        <p><a href="https://trucking-blond.vercel.app/admin/leads">View All Leads</a></p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing lead:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}