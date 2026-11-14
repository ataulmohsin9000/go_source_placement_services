import React, { useEffect, useState } from 'react';
import api from '../api';
import { DollarSign, FileText, PlusCircle, CheckCircle } from 'lucide-react';

export const Invoices: React.FC = () => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const fetchInvoices = () => {
    api
      .get('/invoices')
      .then((res: any) => {
        setInvoices(res.data || []);
        setLoadError('');
      })
      .catch((err) => {
        console.error('Failed to load invoices', err);
        setLoadError(err?.message || 'Unable to load invoices. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handlePay = async (invoiceId: string, balance: number) => {
    const amountStr = prompt(`Enter payment amount (Remaining balance: PKR ${balance}):`, balance.toString());
    if (!amountStr) return;
    const amount = parseFloat(amountStr);
    if (isNaN(amount) || amount <= 0) return;

    try {
      await api.post(`/invoices/${invoiceId}/payments`, { amount, method: 'CASH' });
      alert('Payment recorded successfully!');
      fetchInvoices();
    } catch (err: any) {
      alert(err.message || 'Payment recording failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="page-eyebrow">Billing & collections</p>
        <h1 className="page-title">Quotations & invoices</h1>
        <p className="page-description">Manage consultancy fees, government charges, and client payment records.</p>
      </div>

      <div className="surface-card overflow-hidden">
        {loadError && (
          <div role="alert" className="m-4 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2.5 text-xs text-rose-700">
            <span>{loadError}</span>
            <button type="button" onClick={fetchInvoices} className="font-semibold underline">Retry</button>
          </div>
        )}
        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading invoices...</div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No billing records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Paid</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => {
                  const balance = Number(inv.totalAmount) - Number(inv.paidAmount);
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-brand-700">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-900">
                        {inv.client?.firstName} {inv.client?.lastName}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-800">
                        PKR {Number(inv.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-emerald-600 font-semibold">
                        PKR {Number(inv.paidAmount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          inv.status === 'PAID' ? 'bg-emerald-50 text-emerald-700' :
                          inv.status === 'PARTIALLY_PAID' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {balance > 0 ? (
                          <button
                            onClick={() => handlePay(inv.id, balance)}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-800 hover:underline"
                          >
                            Record Payment
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-medium">Fully Settled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

