'use client';
import { useEffect, useState } from 'react';

type Cred = { title:string; organization:string; status:string };

export default function VerifyPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams.token;
  const [cred, setCred] = useState<Cred | null>(null);
  const [msg, setMsg] = useState<string>('');

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/verify?token=${token}`);
      const j = await res.json();
      setCred(j.error ? null : j);
      if (j.error) setMsg(j.error);
    })();
  }, [token]);

  async function act(action: 'approve'|'reject') {
    const res = await fetch('/api/verify', {
      method: 'POST', headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ token, action })
    });
    const j = await res.json();
    setMsg(j.message || 'Done');
  }

  if (!token) return <div className="mt-10">Missing token.</div>;
  if (!cred && !msg) return <div className="mt-10">Loading…</div>;
  if (msg && !cred) return <div className="mt-10">{msg}</div>;

  return (
    <div className="max-w-lg mt-12 bg-white p-6 rounded border">
      <h1 className="text-xl font-semibold mb-2">Verify Credential</h1>
      <div className="text-slate-700">{cred?.title}</div>
      <div className="text-slate-500 text-sm">{cred?.organization}</div>
      <div className="flex gap-3 mt-5">
        <button onClick={()=>act('approve')} className="px-4 py-2 rounded bg-green-600 text-white">Approve</button>
        <button onClick={()=>act('reject')} className="px-4 py-2 rounded bg-red-600 text-white">Reject</button>
      </div>
      <p className="text-xs text-slate-500 mt-4">By approving you confirm this record is authentic.</p>
      {msg && <p className="mt-4">{msg}</p>}
    </div>
  );
}
