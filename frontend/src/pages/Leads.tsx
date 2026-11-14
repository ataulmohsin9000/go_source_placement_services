import React, { useEffect, useState } from 'react';
import api from '../api';
import { UserPlus, ArrowRight, Search, Phone, Mail, Globe } from 'lucide-react';

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    purpose: '',
    source: 'Website',
  });

  const fetchLeads = () => {
    api
      .get('/leads')
      .then((res: any) => {
        setLeads(res.data || []);
        setLoadError('');
      })
      .catch((err) => {
        console.error('Failed to load leads', err);
        setLoadError(err?.message || 'Unable to load enquiries. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leads', formData);
      setShowModal(false);
      setFormData({ firstName: '', lastName: '', email: '', phone: '', purpose: '', source: 'Website' });
      fetchLeads();
    } catch (err: any) {
      alert(err.message || 'Failed to create lead');
    }
  };

  const handleConvert = async (id: string) => {
    if (!confirm('Convert this lead to a Client & Applicant?')) return;
    try {
      await api.post(`/leads/${id}/convert`);
      alert('Lead successfully converted to Client!');
      fetchLeads();
    } catch (err: any) {
      alert(err.message || 'Failed to convert lead');
    }
  };

  const query = searchQuery.trim().toLowerCase();
  const filteredLeads = leads.filter((lead) =>
    [lead.firstName, lead.lastName, lead.email, lead.phone, lead.purpose, lead.country?.name]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="page-eyebrow">Client acquisition</p>
          <h1 className="page-title">Leads & enquiries</h1>
          <p className="page-description">Capture, qualify, and convert visa consultations.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg bg-brand-600 px-4 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-brand-700 sm:self-auto"
        >
          <UserPlus className="h-4 w-4" />
          <span>New enquiry</span>
        </button>
      </div>

      {/* Leads Table */}
      <div className="surface-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="relative w-full sm:max-w-80">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search leads by name or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <span className="text-[11px] text-slate-500">
            {query ? `${filteredLeads.length} of ${leads.length} enquiries` : `${leads.length} enquiries`}
          </span>
        </div>

        {loadError && (
          <div role="alert" className="m-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
            <span>{loadError}</span>
            <button type="button" onClick={fetchLeads} className="font-semibold underline">Retry</button>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading leads...</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            {query ? 'No enquiries match your search.' : "No enquiries found. Click 'New enquiry' to create one."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Destination / Purpose</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((ld) => (
                  <tr key={ld.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {ld.firstName} {ld.lastName}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs space-y-0.5">
                        {ld.email && <div className="text-slate-600 flex items-center gap-1.5"><Mail className="h-3 w-3" /> {ld.email}</div>}
                        {ld.phone && <div className="text-slate-500 flex items-center gap-1.5"><Phone className="h-3 w-3" /> {ld.phone}</div>}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700">
                        {ld.stage}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      <p className="font-medium text-slate-800">{ld.country?.name || 'General'}</p>
                      <p className="text-slate-500">{ld.purpose || 'Visa consultation'}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">{ld.source || 'Direct'}</td>
                    <td className="py-3.5 px-4 text-right">
                      {ld.convertedClientId ? (
                        <span className="text-xs font-medium text-emerald-600">Converted</span>
                      ) : (
                        <button
                          onClick={() => handleConvert(ld.id)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline"
                        >
                          Convert to Client <ArrowRight className="h-3 w-3" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">New Lead Enquiry</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">First Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full mt-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full mt-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full mt-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full mt-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Purpose / Destination</label>
                <input
                  type="text"
                  placeholder="e.g. UK Student Visa / UAE Tourist"
                  value={formData.purpose}
                  onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                  className="w-full mt-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label htmlFor="lead-source" className="text-xs font-semibold text-slate-700">
                  Enquiry source
                </label>
                <select
                  id="lead-source"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                >
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social media">Social media</option>
                  <option value="Phone">Phone</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-lg"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

