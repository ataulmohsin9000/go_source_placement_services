import React, { useEffect, useState } from 'react';
import api from '../api';
import { Users, FileCheck, Phone, Mail, MapPin } from 'lucide-react';

export const Clients: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchClients = () => {
    setLoading(true);
    api
      .get('/clients')
      .then((res: any) => {
        setClients(res.data || []);
        setLoadError('');
      })
      .catch((err) => {
        console.error('Failed to load clients', err);
        setLoadError(err?.message || 'Unable to load clients. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Client directory</p>
        <h1 className="page-title">Clients & applicants</h1>
        <p className="page-description">Directory of registered clients, family profiles, and applicants.</p>
      </div>

      <div className="surface-card overflow-hidden">
        {loadError && (
          <div role="alert" className="m-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
            <span>{loadError}</span>
            <button type="button" onClick={fetchClients} className="font-semibold underline">Retry</button>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading clients directory...</div>
        ) : clients.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No clients registered yet.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {clients.map((cl) => (
              <div key={cl.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {cl.firstName} {cl.lastName}
                    </h3>
                    <div className="flex flex-wrap gap-4 mt-1.5 text-xs text-slate-500">
                      {cl.email && <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5 text-slate-400" /> {cl.email}</span>}
                      {cl.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-slate-400" /> {cl.phone}</span>}
                      {cl.city && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {cl.city}, {cl.country}</span>}
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700">
                    {cl.clientType}
                  </span>
                </div>

                {/* Linked Applicants */}
                {cl.applicants && cl.applicants.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                      Linked Applicants ({cl.applicants.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {cl.applicants.map((ap: any) => (
                        <div key={ap.id} className="bg-slate-100 rounded-lg px-2.5 py-1 text-xs text-slate-700 flex items-center gap-2">
                          <FileCheck className="h-3.5 w-3.5 text-brand-600" />
                          <span className="font-medium">{ap.firstName} {ap.lastName}</span>
                          {ap.passportNumber && (
                            <span className="text-slate-400 font-mono text-[11px]">({ap.passportNumber})</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

