import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { newSlug } from '@/lib/util';

export async function POST(req: Request) {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const { ids, days } = await req.json();
  if (!Array.isArray(ids) || ids.length === 0) {
    return NextResponse.json({ error: 'no items' }, { status: 400 });
  }

  const slug = newSlug();
  const expires_at = days > 0 ? new Date(Date.now() + days*86400000) : null;

  const { data: share, error } = await supabase.from('share_links')
    .insert({ owner: user.id, slug, expires_at })
    .select('id, slug')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const items = ids.map((id: string) => ({ share_id: share.id, credential_id: id }));
  await supabase.from('share_items').insert(items);

  return NextResponse.json({ url: `${process.env.APP_URL}/v/${share.slug}` });
}
