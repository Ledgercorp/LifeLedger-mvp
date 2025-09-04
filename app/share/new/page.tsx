'use client';
import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import QRCode from 'qrcode.react';

type Cred = { id:string; title:string; organization:string; status:string };

export default function NewShare() {
  const supabase = supabaseBrowser();
  const [creds, setCreds] = useState<Cred[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [days, setDays] = useState('7');
  const [link, setLink] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('credentials')
        .select('id, title, organization, status').eq('status','verified');
      setCreds(data || []);
    })();
  }, []);

  async function createShare() {
    const ids = Object.keys(selected).filter(k => selected[k]);
    const res = await fetch('/api/share', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ ids, days: parseInt(days || '0', 10) })
    });
    const j = await res.json();
    setLink(j.url);
  }

  return (
    <div className="mt-8 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Create Share Link</h1>
      <div className="space-y-2">
        {creds.map(c => (
          <label key={c.id} className="flex items-center gap-2 border rounded p-2 bg-white">
            <input type="checkbox" checked={!!selected[c.id]}
              onChange={e=>setSelected(s => ({...s, [c.id]: e.target.checked}))} />
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-sm text-slate-600">{c.organization}</div>
            </div>
          </label>
        ))}
        {creds.length === 0 && <p className="text-slate-600">No verified credentials yet.</p>}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <input className="border rounded p-2 w-28" value={days} onChange={e=>setDays(e.target.value)}
              placeholder="Days" />
        <button onClick={createShare} className="px-4 py-2 rounded bg-black text-white">
          Generate Link
        </button>
      </div>

      {link && (
        <div className="mt-6 p-4 bg-white border rounded">
          <div className="mb-2"><a href={link} className="underline">{link}</a></div>
          <QRCode value={link} size={164} />
        </div>
      )}
    </div>
  );
}
