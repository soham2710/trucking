// app/api/submit-lead/route.ts
import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

// Type Definitions
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
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company_name?: string;
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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials in environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const leadData: LeadData = body;

    // Validate required fields
    if (!leadData.first_name || !leadData.last_name || !leadData.email || !leadData.phone) {
      return NextResponse.json(
        { error: 'Required fields missing', fields: ['first_name', 'last_name', 'email', 'phone'] },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(leadData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Format lead data for Supabase
    const supabaseLeadData = {
      // Contact Information
      first_name: leadData.first_name.trim(),
      last_name: leadData.last_name.trim(),
      email: leadData.email.toLowerCase().trim(),
      phone: leadData.phone.trim(),
      company_name: leadData.company_name?.trim(),

      // Shipping Details
      shipping_type: leadData.type,
      equipment_type: leadData.type === 'ftl' ? leadData.details.equipmentType : null,
      total_weight: leadData.details.weight ? parseFloat(leadData.details.weight) : null,
      declared_value: leadData.details.declaredValue ? parseFloat(leadData.details.declaredValue) : null,

      // Pickup Location
      pickup_zip_code: leadData.details.pickupLocation.zipCode,
      pickup_date: leadData.details.pickupLocation.pickupDate,
      pickup_is_residential: leadData.details.pickupLocation.isResidential,
      pickup_needs_liftgate: leadData.details.pickupLocation.needsLiftgate,
      pickup_limited_access: leadData.details.pickupLocation.limitedAccess,

      // Delivery Location
      delivery_zip_code: leadData.details.deliveryLocation.zipCode,
      delivery_is_residential: leadData.details.deliveryLocation.isResidential,
      delivery_needs_liftgate: leadData.details.deliveryLocation.needsLiftgate,
      delivery_limited_access: leadData.details.deliveryLocation.limitedAccess,

      // Metadata
      status: 'new',
      created_at: new Date().toISOString()
    };

    // Insert lead into database
    const { data: insertedLead, error: leadInsertError } = await supabase
      .from('leads')
      .insert([supabaseLeadData])
      .select('id')
      .single();

    if (leadInsertError) {
      console.error('Error inserting lead:', leadInsertError);
      throw leadInsertError;
    }

    // Handle LTL items if present
    if (leadData.type === 'ltl' && leadData.details.items && leadData.details.items.length > 0) {
      const leadItems = leadData.details.items.map(item => ({
        lead_id: insertedLead.id,
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

      if (itemsInsertError) {
        console.error('Error inserting lead items:', itemsInsertError);
        throw itemsInsertError;
      }
    }

    // Send email notification
    try {
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
          <h3>Contact Information</h3>
          <p><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Phone:</strong> ${leadData.phone}</p>
          ${leadData.company_name ? `<p><strong>Company:</strong> ${leadData.company_name}</p>` : ''}
          
          <h3>Shipping Details</h3>
          <p><strong>Type:</strong> ${leadData.type.toUpperCase()}</p>
          <p><strong>Pickup ZIP:</strong> ${leadData.details.pickupLocation.zipCode}</p>
          <p><strong>Delivery ZIP:</strong> ${leadData.details.deliveryLocation.zipCode}</p>
          
          <h3>Additional Information</h3>
          <p><strong>Created At:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Lead ID:</strong> ${insertedLead.id}</p>
          
          <p style="margin-top: 20px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/leads" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
              View Lead Details
            </a>
          </p>
        `
      };

      await transporter.sendMail(mailOptions);
    } catch (emailError) {
      console.error('Error sending notification email:', emailError);
      // Continue execution even if email fails
    }

    return NextResponse.json({
      success: true,
      leadId: insertedLead.id,
      message: 'Lead successfully created'
    });

  } catch (error) {
    console.error('Error processing lead:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}