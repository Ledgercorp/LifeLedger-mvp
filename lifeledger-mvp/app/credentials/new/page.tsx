'use client';
import { useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function NewCredential() {
  const supabase = supabaseBrowser();
  const [form, setForm] = useState({
    type: 'education', title: '', organization: '', issueDate: '', issuerEmail: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof typeof form>(k: K, v: string) { setForm({ ...form, [k]: v }); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert('Not logged in'); setLoading(false); return; }

    let file_path: string | null = null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('credentials').upload(path, file, { upsert: false });
      if (error) { alert(error.message); setLoading(false); return; }
      file_path = path;
    }

    const res = await fetch('/api/credentials', {
      method: 'POST', headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        type: form.type, title: form.title, organization: form.organization,
        issueDate: form.issueDate || null, issuerEmail: form.issuerEmail || null, filePath: file_path
      })
    });
    if (!res.ok) { alert('Failed to create'); setLoading(false); return; }
    location.href = '/dashboard';
  }

  return (
    <div className="max-w-lg mt-8">
      <h1 className="text-2xl font-semibold mb-4">Add Credential</h1>
      <form onSubmit={submit} className="space-y-3">
        <select className="w-full border rounded p-2" value={form.type} onChange={e=>update('type', e.target.value)}>
          <option value="education">Education</option>
          <option value="work">Work</option>
        </select>
        <input className="w-full border rounded p-2" placeholder="Title (e.g., B.S. Psychology)"
          value={form.title} onChange={e=>update('title', e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Organization (e.g., Delaware Tech)"
          value={form.organization} onChange={e=>update('organization', e.target.value)} />
        <input type="date" className="w-full border rounded p-2"
          value={form.issueDate} onChange={e=>update('issueDate', e.target.value)} />
        <input className="w-full border rounded p-2" placeholder="Issuer email (registrar/HR)"
          value={form.issuerEmail} onChange={e=>update('issuerEmail', e.target.value)} />
        <input type="file" className="w-full" onChange={e=>setFile(e.target.files?.[0] ?? null)} />
        <button disabled={loading} className="px-4 py-2 rounded bg-black text-white">
          {loading ? 'Saving…' : 'Save & request verification'}
        </button>
      </form>
    </div>
  );
}
