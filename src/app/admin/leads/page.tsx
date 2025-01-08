'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Download, Eye, Search, X } from 'lucide-react';
import Navigation from '@/app/components/Navigation';
import Footer from '@/app/components/Footer';

// Types
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
  items?: LeadItem[];
}

export default function LeadsPage() {
  // State Management
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    username: '',
    password: ''
  });
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Utility Functions
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatWeight = (weight?: number) => {
    if (!weight) return 'Not specified';
    return `${weight.toLocaleString()} lbs`;
  };

  // Authentication Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (auth.username === 'sidharth' && auth.password === 'Sid@2025!') {
      setAuth(prev => ({ ...prev, isAuthenticated: true }));
      localStorage.setItem('isLeadsAuthenticated', 'true');
    } else {
      alert('Invalid credentials');
    }
  };

  // Data Fetching
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

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Lead Details Handler
  const openLeadDetails = async (lead: Lead) => {
    if (lead.shipping_type === 'ltl') {
      const items = await fetchLeadItems(lead.id);
      setSelectedLead({ ...lead, items });
    } else {
      setSelectedLead(lead);
    }
  };

  // Export Handler
  const handleExportCSV = async () => {
    const headers = [
      'First Name', 'Last Name', 'Email', 'Phone', 'Company Name',
      'Shipping Type', 'Equipment Type', 'Total Weight', 'Declared Value',
      'Pickup ZIP Code', 'Pickup Date', 'Pickup Residential', 'Pickup Lift Gate',
      'Pickup Limited Access', 'Delivery ZIP Code', 'Delivery Residential',
      'Delivery Lift Gate', 'Delivery Limited Access', 'Status', 'Created At'
    ];

    const csvData = leads.map(lead => [
      lead.first_name,
      lead.last_name,
      lead.email,
      lead.phone,
      lead.company_name || '',
      lead.shipping_type.toUpperCase(),
      lead.equipment_type || '',
      lead.total_weight?.toString() || '',
      lead.declared_value?.toString() || '',
      lead.pickup_zip_code,
      formatDate(lead.pickup_date || ''),
      lead.pickup_is_residential ? 'Yes' : 'No',
      lead.pickup_needs_liftgate ? 'Yes' : 'No',
      lead.pickup_limited_access ? 'Yes' : 'No',
      lead.delivery_zip_code,
      lead.delivery_is_residential ? 'Yes' : 'No',
      lead.delivery_needs_liftgate ? 'Yes' : 'No',
      lead.delivery_limited_access ? 'Yes' : 'No',
      lead.status,
      formatDate(lead.created_at)
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => 
        `"${String(cell).replace(/"/g, '""')}"`
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads-${new Date().toISOString()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Effects
  useEffect(() => {
    const isAuth = localStorage.getItem('isLeadsAuthenticated');
    if (isAuth === 'true') {
      setAuth(prev => ({ ...prev, isAuthenticated: true }));
    }
    if (auth.isAuthenticated) {
      fetchLeads();
    }
  }, [auth.isAuthenticated]);

  // Filter leads based on search
  const filteredLeads = leads.filter(lead => 
    lead.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  // Render Methods
  const renderLeadDetailsModal = () => {
    if (!selectedLead) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 py-8 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 py-4 space-y-6">
              {/* Contact Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2 rounded">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Full Name:</span>
                    <p className="font-medium">
                      {selectedLead.first_name} {selectedLead.last_name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Company:</span>
                    <p className="font-medium">
                      {selectedLead.company_name || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{selectedLead.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>
                    <p className="font-medium">{selectedLead.phone}</p>
                  </div>
                </div>
              </section>

              {/* Shipping Details */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2 rounded">
                  Shipping Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Shipping Type:</span>
                    <p className="font-medium uppercase">
                      {selectedLead.shipping_type}
                    </p>
                  </div>
                  {selectedLead.shipping_type === 'ftl' && (
                    <>
                      <div>
                        <span className="text-gray-600">Equipment Type:</span>
                        <p className="font-medium">
                          {selectedLead.equipment_type || 'Not specified'}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Total Weight:</span>
                        <p className="font-medium">
                          {formatWeight(selectedLead.total_weight)}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Declared Value:</span>
                        <p className="font-medium">
                          {formatCurrency(selectedLead.declared_value)}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* LTL Items */}
              {selectedLead.shipping_type === 'ltl' && 
               selectedLead.items && 
               selectedLead.items.length > 0 && (
                <section>
                  <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2 rounded">
                    Shipment Items
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Qty
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Package Type
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Class
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Dimensions (L×W×H)
                          </th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                            Weight
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedLead.items.map((item, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{item.quantity}</td>
                            <td className="px-4 py-2 capitalize">
                              {item.packaging_type}
                            </td>
                            <td className="px-4 py-2">{item.freight_class}</td>
                            <td className="px-4 py-2">
                              {item.length}″ × {item.width}″ × {item.height}″
                            </td>
                            <td className="px-4 py-2">
                              {formatWeight(item.weight)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* Pickup Location */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2 rounded">
                  Pickup Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">ZIP Code:</span>
                    <p className="font-medium">{selectedLead.pickup_zip_code}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Pickup Date:</span>
                    <p className="font-medium">
                      {formatDate(selectedLead.pickup_date || '')}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Location Type:</span>
                    <p className="font-medium">
                      {selectedLead.pickup_is_residential ? 'Residential' : 'Commercial'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Lift Gate:</span>
                    <p className="font-medium">
                      {selectedLead.pickup_needs_liftgate ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Access:</span>
                    <p className="font-medium">
                      {selectedLead.pickup_limited_access ? 'Limited Access' : 'Standard Access'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Delivery Location */}
              {/* Delivery Location */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2 rounded">
                  Delivery Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">ZIP Code:</span>
                    <p className="font-medium">{selectedLead.delivery_zip_code}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Location Type:</span>
                    <p className="font-medium">
                      {selectedLead.delivery_is_residential ? 'Residential' : 'Commercial'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Lift Gate:</span>
                    <p className="font-medium">
                      {selectedLead.delivery_needs_liftgate ? 'Required' : 'Not Required'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Access:</span>
                    <p className="font-medium">
                      {selectedLead.delivery_limited_access ? 'Limited Access' : 'Standard Access'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Status Information */}
              <section>
                <h3 className="text-lg font-semibold mb-4 bg-gray-50 p-2 rounded">
                  Status Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-medium capitalize">{selectedLead.status}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created At:</span>
                    <p className="font-medium">{formatDate(selectedLead.created_at)}</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedLead(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Login Form
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div>
            <h2 className="text-center text-3xl font-extrabold text-gray-900">
              Leads Management
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Please sign in to access the leads dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                  value={auth.username}
                  onChange={(e) => setAuth(prev => ({ ...prev, username: e.target.value }))}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  value={auth.password}
                  onChange={(e) => setAuth(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-gray-50 pt-16">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
              <p className="text-sm text-gray-600 mt-1">
                Total Leads: {leads.length} | Last Updated: {new Date().toLocaleString()}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search leads..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
              <button
                onClick={handleExportCSV}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-5 w-5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Leads Table */}
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shipping Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {lead.first_name} {lead.last_name}
                          </div>
                          <div className="text-sm text-gray-500">{lead.email}</div>
                          <div className="text-sm text-gray-500">{lead.phone}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lead.shipping_type === 'ftl' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {lead.shipping_type.toUpperCase()}
                          </span>
                          {lead.equipment_type && (
                            <div className="text-sm text-gray-500 mt-1">
                              {lead.equipment_type}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            From: {lead.pickup_zip_code}
                          </div>
                          <div className="text-sm text-gray-900">
                            To: {lead.delivery_zip_code}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            lead.status === 'new' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatDate(lead.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => openLeadDetails(lead)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-2 justify-end"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredLeads.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No leads found</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Lead Details Modal */}
      {selectedLead && renderLeadDetailsModal()}
    </>
  );
}