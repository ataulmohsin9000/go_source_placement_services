import React, { useEffect, useState } from 'react';
import api from '../api';

export const Cases: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchCases = () => {
    api
      .get('/cases')
      .then((res: any) => {
        setCases(res.data || []);
        setLoadError('');
      })
      .catch((err) => {
        console.error('Failed to load visa cases', err);
        setLoadError(err?.message || 'Unable to load visa cases. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const nextStatus = prompt(
      'Enter new status:\n(ENQUIRY, CLIENT_ONBOARDING, DOCUMENTS_REQUESTED, DOCUMENTS_RECEIVED, UNDER_REVIEW, READY_FOR_SUBMISSION, SUBMITTED, AWAITING_DECISION, APPROVED, REFUSED)',
      currentStatus
    );
    if (!nextStatus || nextStatus === currentStatus) return;

    try {
      await api.patch(`/cases/${id}/status`, { status: nextStatus });
      fetchCases();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Application management</p>
        <h1 className="page-title">Visa cases</h1>
        <p className="page-description">Track case stages, document reviews, and official outcomes.</p>
      </div>

      <div className="surface-card overflow-hidden">
        {loadError && (
          <div role="alert" className="m-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
            <span>{loadError}</span>
            <button type="button" onClick={fetchCases} className="font-semibold underline">Retry</button>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading visa cases...</div>
        ) : cases.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No active visa cases. Convert a lead to start a case.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Case Reference</th>
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Destination & Visa</th>
                  <th className="py-3 px-4">Stage Status</th>
                  <th className="py-3 px-4">Decision</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {cases.map((cs) => (
                  <tr key={cs.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-700">
                      {cs.reference}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">
                        {cs.applicant?.firstName} {cs.applicant?.lastName}
                      </p>
                      <p className="text-xs text-slate-400">Client: {cs.client?.firstName} {cs.client?.lastName}</p>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      <p className="font-semibold text-slate-800">{cs.country?.name}</p>
                      <p className="text-slate-500">{cs.visaType?.name}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200/60">
                        {cs.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                        cs.outcome === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                        cs.outcome === 'REFUSED' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cs.outcome || 'PENDING'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleUpdateStatus(cs.id, cs.status)}
                        className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                      >
                        Update Stage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

