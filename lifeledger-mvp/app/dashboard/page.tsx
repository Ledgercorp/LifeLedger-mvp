import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Dashboard() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return (<div className="mt-10">Please <Link className="underline" href="/login">log in</Link>.</div>);

  const { data: creds } = await supabase
    .from('credentials')
    .select('*')
    .eq('owner', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <form action="/auth/signout" method="post">
          <button className="text-sm underline">Sign out</button>
        </form>
      </div>

      <div className="flex gap-3">
        <Link href="/credentials/new" className="px-3 py-2 rounded bg-black text-white">Add Credential</Link>
        <Link href="/share/new" className="px-3 py-2 rounded border">Create Share Link</Link>
      </div>

      <div>
        <h2 className="font-medium mb-2">Your Credentials</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {(creds ?? []).map((c:any) => (
            <div key={c.id} className="border rounded p-3 bg-white">
              <div className="flex items-center justify-between">
                <div className="font-medium">{c.title}</div>
                <span className={`text-xs px-2 py-1 rounded ${
                  c.status==='verified' ? 'bg-green-100 text-green-700' :
                  c.status==='rejected' ? 'bg-red-100 text-red-700' :
                  'bg-yellow-100 text-yellow-700'}`}>
                  {c.status}
                </span>
              </div>
              <div className="text-sm text-slate-600">{c.organization}</div>
              {c.issue_date && <div className="text-xs text-slate-500 mt-1">Issued {c.issue_date}</div>}
              {c.status==='pending' && c.issuer_email && (
                <div className="text-xs mt-2 text-slate-600">
                  Verification requested → {c.issuer_email}
                </div>
              )}
            </div>
          ))}
          {(!creds || creds.length === 0) && <div className="text-slate-600">No credentials yet.</div>}
        </div>
      </div>
    </div>
  );
}
