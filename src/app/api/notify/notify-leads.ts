import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

interface ItemDetails {
  quantity: number;
  packagingType: string;
  weight: number;
  freightClass: string;
}

interface PickupLocation {
  zipCode: string;
  pickupDate?: string;
  isResidential: boolean;
  needsLiftgate: boolean;
  limitedAccess: boolean;
}

interface DeliveryLocation {
  zipCode: string;
  isResidential: boolean;
  needsLiftgate: boolean;
  limitedAccess: boolean;
}

interface FTLDetails {
  equipmentType?: string;
  weight?: number;
  declaredValue?: number;
}

interface LTLDetails {
  items?: ItemDetails[];
}

interface LeadDetails {
  pickupLocation: PickupLocation;
  deliveryLocation: DeliveryLocation;
  ftlDetails?: FTLDetails; // Using FTLDetails when 'ftl' type
  ltlDetails?: LTLDetails; // Using LTLDetails when 'ltl' type
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    company_name,
    type,
    details,
    created_at,
  }: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company_name?: string;
    type: 'ftl' | 'ltl';
    details: LeadDetails;
    created_at: string;
  } = req.body;

  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  try {
    // Prepare detailed message content based on type (ftl or ltl)
    const shippingDetails =
      type === 'ftl'
        ? `Equipment Type: ${details.ftlDetails?.equipmentType || 'N/A'}
Weight: ${details.ftlDetails?.weight || 'N/A'} lbs
Declared Value: $${details.ftlDetails?.declaredValue || 'N/A'}`
        : `Items: ${
            details.ltlDetails?.items
              ?.map(
                (item) =>
                  `${item.quantity} x ${item.packagingType} (${item.weight} lbs, Class ${item.freightClass})`
              )
              .join(', ') || 'N/A'
          }`;

    // Send mail with defined transport object
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL,
      subject: `New ${type.toUpperCase()} Shipping Lead: ${first_name} ${last_name}`,
      text: `
New Lead Submission:

Name: ${first_name} ${last_name}
Email: ${email}
Phone: ${phone}
${company_name ? `Company: ${company_name}` : ''}
Shipping Type: ${type.toUpperCase()}

Shipping Details:
${shippingDetails}

Pickup Location:
ZIP: ${details.pickupLocation.zipCode}
Date: ${details.pickupLocation.pickupDate || 'N/A'}
Residential: ${details.pickupLocation.isResidential ? 'Yes' : 'No'}
Liftgate Required: ${details.pickupLocation.needsLiftgate ? 'Yes' : 'No'}
Limited Access: ${details.pickupLocation.limitedAccess ? 'Yes' : 'No'}

Delivery Location:
ZIP: ${details.deliveryLocation.zipCode}
Residential: ${details.deliveryLocation.isResidential ? 'Yes' : 'No'}
Liftgate Required: ${details.deliveryLocation.needsLiftgate ? 'Yes' : 'No'}
Limited Access: ${details.deliveryLocation.limitedAccess ? 'Yes' : 'No'}

Submitted at: ${new Date(created_at).toLocaleString()}
      `,
      html: `
<h2>New ${type.toUpperCase()} Shipping Lead</h2>
<p><strong>Name:</strong> ${first_name} ${last_name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
${company_name ? `<p><strong>Company:</strong> ${company_name}</p>` : ''}
<p><strong>Shipping Type:</strong> ${type.toUpperCase()}</p>

<h3>Shipping Details</h3>
<pre>${shippingDetails}</pre>

<h3>Pickup Location</h3>
<p><strong>ZIP:</strong> ${details.pickupLocation.zipCode}</p>
<p><strong>Date:</strong> ${details.pickupLocation.pickupDate || 'N/A'}</p>
<p><strong>Residential:</strong> ${details.pickupLocation.isResidential ? 'Yes' : 'No'}</p>
<p><strong>Liftgate Required:</strong> ${details.pickupLocation.needsLiftgate ? 'Yes' : 'No'}</p>
<p><strong>Limited Access:</strong> ${details.pickupLocation.limitedAccess ? 'Yes' : 'No'}</p>

<h3>Delivery Location</h3>
<p><strong>ZIP:</strong> ${details.deliveryLocation.zipCode}</p>
<p><strong>Residential:</strong> ${details.deliveryLocation.isResidential ? 'Yes' : 'No'}</p>
<p><strong>Liftgate Required:</strong> ${details.deliveryLocation.needsLiftgate ? 'Yes' : 'No'}</p>
<p><strong>Limited Access:</strong> ${details.deliveryLocation.limitedAccess ? 'Yes' : 'No'}</p>

<p><strong>Submitted at:</strong> ${new Date(created_at).toLocaleString()}</p>
<p><a href="https://trucking-blond.vercel.app/admin/leads">View All Leads</a></p>
      `,
    });

    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending notification' });
  }
}
