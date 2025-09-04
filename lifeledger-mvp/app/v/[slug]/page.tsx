import { supabaseServer } from '@/lib/supabaseServer';

type Cred = {
  id: string; title: string; organization: string; status: string; verified_at: string | null;
};

export default async function Viewer({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer();

  const { data: share } = await supabase.from('share_links')
    .select('*').eq('slug', params.slug).single();

  if (!share) return <div className="mt-10">Link not found.</div>;
  if (share.expires_at && new Date(share.expires_at) < new Date())
    return <div className="mt-10">This link has expired.</div>;

  // Increment views (best-effort): do update via RPC if exists
  try {
    await supabase.rpc('http_increment_views', { p_share_id: share.id });
  } catch {}

  const { data: items } = await supabase.from('share_items')
    .select('credential_id').eq('share_id', share.id);
  const ids = (items || []).map((i:any) => i.credential_id);

  const { data: creds } = await supabase.from('credentials')
    .select('id, title, organization, status, verified_at')
    .in('id', ids);

  return (
    <div className="mt-10 max-w-2xl">
      <h1 className="text-2xl font-semibold">Shared Credentials</h1>
      <div className="text-sm text-slate-600">Views: {share.views}</div>
      <div className="grid gap-3 mt-4">
        {(creds ?? []).map((c: Cred) => (
          <div key={c.id} className="border rounded p-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="font-medium">{c.title}</div>
              <span className={`text-xs px-2 py-1 rounded ${
                c.status==='verified' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'
              }`}>{c.status}</span>
            </div>
            <div className="text-sm text-slate-600">{c.organization}</div>
            {c.verified_at && <div className="text-xs text-slate-500 mt-1">Verified {new Date(c.verified_at).toLocaleDateString()}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
