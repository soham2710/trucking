'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

// Define the Lead type
interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: string;
  created_at: string;
}

export default function LeadsPage() {
  // Specify the type for leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifiedLeads, setNotifiedLeads] = useState<number[]>([]);

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

      if (response.ok) {
        // Add the lead ID to notified leads
        setNotifiedLeads(prev => [...prev, lead.id]);
      } else {
        console.error('Failed to send lead notification');
      }
    } catch (error) {
      console.error('Error sending lead notification:', error);
    }
  }

  useEffect(() => {
    fetchLeads();

    // Set up real-time subscription using the new Supabase client method
    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'leads' 
        }, 
        (payload: RealtimePostgresChangesPayload<{
          id: number;
          name: string;
          email: string;
          phone: string;
          service: string;
          message: string;
          status: string;
          created_at: string;
        }>) => {
          const newLead = payload.new;
          
          // Ensure the new lead is of type Lead
          if (newLead && typeof newLead === 'object' && 'id' in newLead) {
            // Add new lead to the list
            setLeads(prevLeads => [newLead as Lead, ...prevLeads]);
            
            // Send notification for the new lead
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

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Service', 'Message', 'Status', 'Created At'];
    const csvData = leads.map(lead => [
      lead.name,
      lead.email,
      lead.phone,
      lead.service,
      lead.message,
      lead.status,
      new Date(lead.created_at).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads-${new Date().toISOString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Lead Management</h1>
        <button
          onClick={exportToCSV}
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
                <th className="px-6 py-3 text-left">Service</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Created At</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4">{lead.name}</td>
                  <td className="px-6 py-4">{lead.email}</td>
                  <td className="px-6 py-4">{lead.phone}</td>
                  <td className="px-6 py-4">{lead.service}</td>
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
                      onClick={() => window.location.href = `mailto:${lead.email}`}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Contact
                    </button>
                    {notifiedLeads.includes(lead.id) && (
                      <span className="text-green-500 text-sm ml-2">Notified</span>
                    )}
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
    </div>
  );
}
