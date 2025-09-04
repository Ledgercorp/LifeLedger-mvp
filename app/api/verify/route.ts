import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const admin = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get('token') || '';
  const { data, error } = await admin().from('credentials')
    .select('title, organization, status, verify_expires_at')
    .eq('verify_token', token)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Invalid token' }, { status: 404 });
  if (new Date(data.verify_expires_at) < new Date())
    return NextResponse.json({ error: 'Expired' }, { status: 410 });

  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { token, action } = await req.json();
  const db = admin();

  const { data, error } = await db.from('credentials')
    .select('id, verify_expires_at')
    .eq('verify_token', token).single();
  if (error || !data) return NextResponse.json({ message: 'Invalid token' }, { status: 404 });
  if (new Date(data.verify_expires_at) < new Date())
    return NextResponse.json({ message: 'Link expired' }, { status: 410 });

  const status = action === 'approve' ? 'verified' : 'rejected';
  const update = { status, verified_at: action==='approve' ? new Date().toISOString() : null };

  await db.from('credentials').update(update).eq('id', data.id);
  return NextResponse.json({ message: `Credential ${status}. You may close this page.` });
}
