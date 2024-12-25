'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Expanded Lead interface to include full details
interface Lead {
 id: number;
 first_name: string;
 last_name: string;
 email: string;
 phone: string;
 company_name?: string;
 shipping_type: 'ltl' | 'ftl';
 equipment_type?: string;
 total_weight?: number;
 declared_value?: number;
 pickup_zip_code: string;
 pickup_date?: string;
 pickup_is_residential: boolean;
 pickup_needs_liftgate: boolean;
 pickup_limited_access: boolean;
 delivery_zip_code: string;
 delivery_is_residential: boolean;
 delivery_needs_liftgate: boolean;
 delivery_limited_access: boolean;
 status: string;
 created_at: string;
 items?: LeadItem[]
}

// Interface for LTL Items
interface LeadItem {
 id: number;
 lead_id: number;
 quantity: number;
 packaging_type: string;
 freight_class: string;
 length: number;
 width: number;
 height: number;
 weight: number;
}

export default function LeadsPage() {
 const [leads, setLeads] = useState<Lead[]>([]);
 const [selectedLead, setSelectedLead] = useState<(Lead & { items?: LeadItem[] }) | null>(null);
 const [loading, setLoading] = useState(true);
 

 // Utility function to send email notification
 async function sendLeadNotification(lead: Lead) {
    try {
      const response = await fetch('/api/notify-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(lead),
      });
  
      if (!response.ok) {
        console.error('Failed to send lead notification');
      }
    } catch (error) {
      console.error('Error sending lead notification:', error);
    }
  }
  

 // Fetch lead items for LTL shipments
 const fetchLeadItems = async (leadId: number) => {
   const { data: items, error } = await supabase
     .from('lead_items')
     .select('*')
     .eq('lead_id', leadId);

   if (error) {
     console.error('Error fetching lead items:', error);
     return [];
   }

   return items || [];
 };

 // Open detailed view for a lead
 const openLeadDetails = async (lead: Lead) => {
   const leadWithItems = { ...lead };
   
   // Fetch items if it's an LTL shipment
   if (lead.shipping_type === 'ltl') {
     const items = await fetchLeadItems(lead.id);
     leadWithItems.items = items;
   }

   setSelectedLead(leadWithItems);
 };

 // Render method for boolean values
 const renderBooleanValue = (value: boolean) => (
   <span className={`px-2 py-1 rounded-full text-sm ${
     value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
   }`}>
     {value ? 'Yes' : 'No'}
   </span>
 );

 // Render detailed lead modal
 const renderLeadDetailsModal = () => {
   if (!selectedLead) return null;

   return (
     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
       <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
         <h2 className="text-2xl font-bold mb-6">Lead Details</h2>
         
         {/* Contact Information */}
         <section className="mb-6">
           <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
           <div className="grid grid-cols-2 gap-4">
             <p><strong>Name:</strong> {selectedLead.first_name} {selectedLead.last_name}</p>
             <p><strong>Email:</strong> {selectedLead.email}</p>
             <p><strong>Phone:</strong> {selectedLead.phone}</p>
             {selectedLead.company_name && <p><strong>Company:</strong> {selectedLead.company_name}</p>}
           </div>
         </section>

         {/* Shipping Details */}
         <section className="mb-6">
           <h3 className="text-xl font-semibold mb-4">Shipping Details</h3>
           <div className="grid grid-cols-2 gap-4">
             <p><strong>Shipping Type:</strong> {selectedLead.shipping_type.toUpperCase()}</p>
             {selectedLead.shipping_type === 'ftl' && (
               <>
                 <p><strong>Equipment Type:</strong> {selectedLead.equipment_type || 'N/A'}</p>
                 <p><strong>Total Weight:</strong> {selectedLead.total_weight} lbs</p>
                 <p><strong>Declared Value:</strong> ${selectedLead.declared_value}</p>
               </>
             )}
           </div>
         </section>

         {/* LTL Items */}
         {selectedLead.shipping_type === 'ltl' && selectedLead.items && (
           <section className="mb-6">
             <h3 className="text-xl font-semibold mb-4">Shipping Items</h3>
             <table className="w-full border-collapse">
               <thead>
                 <tr className="bg-gray-100">
                   <th className="border p-2">Quantity</th>
                   <th className="border p-2">Package Type</th>
                   <th className="border p-2">Freight Class</th>
                   <th className="border p-2">Dimensions (L x W x H)</th>
                   <th className="border p-2">Weight</th>
                 </tr>
               </thead>
               <tbody>
                 {selectedLead.items.map((item, index) => (
                   <tr key={index}>
                     <td className="border p-2">{item.quantity}</td>
                     <td className="border p-2">{item.packaging_type}</td>
                     <td className="border p-2">{item.freight_class}</td>
                     <td className="border p-2">
                       {item.length} x {item.width} x {item.height} in
                     </td>
                     <td className="border p-2">{item.weight} lbs</td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </section>
         )}

         {/* Pickup Location */}
         <section className="mb-6">
           <h3 className="text-xl font-semibold mb-4">Pickup Location</h3>
           <div className="grid grid-cols-2 gap-4">
             <p><strong>ZIP Code:</strong> {selectedLead.pickup_zip_code}</p>
             {selectedLead.pickup_date && <p><strong>Pickup Date:</strong> {selectedLead.pickup_date}</p>}
             <p>
               <strong>Residential Area:</strong> {renderBooleanValue(selectedLead.pickup_is_residential)}
             </p>
             <p>
               <strong>Lift Gate Required:</strong> {renderBooleanValue(selectedLead.pickup_needs_liftgate)}
             </p>
             <p>
               <strong>Limited Access:</strong> {renderBooleanValue(selectedLead.pickup_limited_access)}
             </p>
           </div>
         </section>

         {/* Delivery Location */}
         <section className="mb-6">
           <h3 className="text-xl font-semibold mb-4">Delivery Location</h3>
           <div className="grid grid-cols-2 gap-4">
             <p><strong>ZIP Code:</strong> {selectedLead.delivery_zip_code}</p>
             <p>
               <strong>Residential Area:</strong> {renderBooleanValue(selectedLead.delivery_is_residential)}
             </p>
             <p>
               <strong>Lift Gate Required:</strong> {renderBooleanValue(selectedLead.delivery_needs_liftgate)}
             </p>
             <p>
               <strong>Limited Access:</strong> {renderBooleanValue(selectedLead.delivery_limited_access)}
             </p>
           </div>
         </section>

         <div className="flex justify-end mt-6">
           <button 
             onClick={() => setSelectedLead(null)}
             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
           >
             Close
           </button>
         </div>
       </div>
     </div>
   );
 };

 useEffect(() => {
   fetchLeads();

   // Set up real-time subscription
   const channel = supabase
     .channel('leads-changes')
     .on(
       'postgres_changes', 
       { 
         event: 'INSERT', 
         schema: 'public', 
         table: 'leads' 
       }, 
       (payload: RealtimePostgresChangesPayload<Lead>) => {
         const newLead = payload.new;
         
         if (newLead && typeof newLead === 'object' && 'id' in newLead) {
           setLeads(prevLeads => [newLead as Lead, ...prevLeads]);
           sendLeadNotification(newLead as Lead);
         }
       }
     )
     .subscribe();

   // Cleanup subscription on component unmount
   return () => {
     supabase.removeChannel(channel);
   };
 }, []);

 async function fetchLeads() {
   try {
     const { data, error } = await supabase
       .from('leads')
       .select('*')
       .order('created_at', { ascending: false });

     if (error) throw error;
     
     // Ensure data is of type Lead[]
     const typedLeads = data as Lead[];
     
     // Set leads
     setLeads(typedLeads || []);
   } catch (error) {
     console.error('Error fetching leads:', error);
   } finally {
     setLoading(false);
   }
 }

 const exportToCSV = async () => {
    // Prepare headers with all possible fields
    const headers = [
      // Contact Information
      'First Name', 
      'Last Name', 
      'Email', 
      'Phone', 
      'Company Name',
  
      // Shipping Details
      'Shipping Type',
      'Equipment Type',
      'Total Weight',
      'Declared Value',
  
      // Pickup Location
      'Pickup ZIP Code',
      'Pickup Date',
      'Pickup Residential',
      'Pickup Lift Gate',
      'Pickup Limited Access',
  
      // Delivery Location
      'Delivery ZIP Code',
      'Delivery Residential',
      'Delivery Lift Gate',
      'Delivery Limited Access',
  
      // Status and Timestamp
      'Status',
      'Created At'
    ];
  
    // Prepare CSV data with full details
    const csvData: string[][] = [];
  
    // Fetch leads with items for LTL shipments
    for (const lead of leads) {
      let leadItems: LeadItem[] = [];
      
      // Fetch items for LTL shipments
      if (lead.shipping_type === 'ltl') {
        const { data: items, error } = await supabase
          .from('lead_items')
          .select('*')
          .eq('lead_id', lead.id);
        
        if (!error && items) {
          leadItems = items;
        }
      }
  
      // If LTL and multiple items, create a row for each item
      if (lead.shipping_type === 'ltl' && leadItems.length > 0) {
        leadItems.forEach((item, index) => {
          csvData.push([
            // Contact Information
            lead.first_name,
            lead.last_name,
            lead.email,
            lead.phone,
            lead.company_name || '',
  
            // Shipping Details
            lead.shipping_type.toUpperCase(),
            'N/A', // No equipment type for LTL
            '', // No total weight for individual items
            '', // No declared value
  
            // Pickup Location
            lead.pickup_zip_code,
            lead.pickup_date || '',
            lead.pickup_is_residential ? 'Yes' : 'No',
            lead.pickup_needs_liftgate ? 'Yes' : 'No',
            lead.pickup_limited_access ? 'Yes' : 'No',
  
            // Delivery Location
            lead.delivery_zip_code,
            lead.delivery_is_residential ? 'Yes' : 'No',
            lead.delivery_needs_liftgate ? 'Yes' : 'No',
            lead.delivery_limited_access ? 'Yes' : 'No',
  
            // Status and Timestamp
            lead.status,
            new Date(lead.created_at).toLocaleString(),
  
            // Item-specific details
            `Item ${index + 1}`,
            item.quantity.toString(),
            item.packaging_type,
            item.freight_class,
            `${item.length} x ${item.width} x ${item.height} in`,
            `${item.weight} lbs`
          ]);
        });
      } else {
        // For FTL or LTL with no items
        csvData.push([
          // Contact Information
          lead.first_name,
          lead.last_name,
          lead.email,
          lead.phone,
          lead.company_name || '',
  
          // Shipping Details
          lead.shipping_type.toUpperCase(),
          lead.equipment_type || '',
          lead.total_weight?.toString() || '',
          lead.declared_value?.toString() || '',
  
          // Pickup Location
          lead.pickup_zip_code,
          lead.pickup_date || '',
          lead.pickup_is_residential ? 'Yes' : 'No',
          lead.pickup_needs_liftgate ? 'Yes' : 'No',
          lead.pickup_limited_access ? 'Yes' : 'No',
  
          // Delivery Location
          lead.delivery_zip_code,
          lead.delivery_is_residential ? 'Yes' : 'No',
          lead.delivery_needs_liftgate ? 'Yes' : 'No',
          lead.delivery_limited_access ? 'Yes' : 'No',
  
          // Status and Timestamp
          lead.status,
          new Date(lead.created_at).toLocaleString()
        ]);
      }
    }
  
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => 
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');
  
    // Generate and download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  const handleExportCSV = async () => {
    await exportToCSV();
  };
  
 return (
   <div className="container mx-auto px-4 py-8">
     <div className="flex justify-between items-center mb-6">
       <h1 className="text-2xl font-bold">Lead Management</h1>
       <button
         onClick={handleExportCSV}
         className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
       >
         Export to CSV
       </button>
     </div>

     {loading ? (
       <div className="flex justify-center items-center min-h-[200px]">
         <p>Loading leads...</p>
       </div>
     ) : (
       <div className="overflow-x-auto">
         <table className="min-w-full bg-white shadow-lg rounded-lg">
           <thead className="bg-gray-100">
             <tr>
               <th className="px-6 py-3 text-left">Name</th>
               <th className="px-6 py-3 text-left">Email</th>
               <th className="px-6 py-3 text-left">Phone</th>
               <th className="px-6 py-3 text-left">Shipping Type</th>
               <th className="px-6 py-3 text-left">Pickup ZIP</th>
               <th className="px-6 py-3 text-left">Status</th>
               <th className="px-6 py-3 text-left">Created At</th>
               <th className="px-6 py-3 text-left">Actions</th>
             </tr>
           </thead>
           <tbody>
             {leads.map((lead) => (
               <tr key={lead.id} className="border-t hover:bg-gray-50">
                 <td className="px-6 py-4">{lead.first_name} {lead.last_name}</td>
                 <td className="px-6 py-4">{lead.email}</td>
                 <td className="px-6 py-4">{lead.phone}</td>
                 <td className="px-6 py-4">
                   {lead.shipping_type.toUpperCase()}
                   {lead.equipment_type && ` (${lead.equipment_type})`}
                 </td>
                 <td className="px-6 py-4">{lead.pickup_zip_code}</td>
                 <td className="px-6 py-4">
                   <span className={`px-2 py-1 rounded-full text-sm ${
                     lead.status === 'new' ? 'bg-green-100 text-green-800' : 
                     'bg-gray-100 text-gray-800'
                   }`}>
                     {lead.status}
                   </span>
                 </td>
                 <td className="px-6 py-4">
                   {new Date(lead.created_at).toLocaleString()}
                 </td>
                 <td className="px-6 py-4">
                   <button
                     onClick={() => openLeadDetails(lead)}
                     className="text-blue-600 hover:text-blue-800 transition-colors underline"
                   >
                     View Details
                   </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>

         {leads.length === 0 && (
           <div className="text-center py-8 text-gray-500">
             No leads found
           </div>
         )}
       </div>
     )}

     {/* Render lead details modal */}
     {selectedLead && renderLeadDetailsModal()}
   </div>
 );
}