import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { newToken } from '@/lib/util';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(req: Request) {
  const body = await req.json();
  const supabase = supabaseServer();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthenticated' }, { status: 401 });

  const verify_token = newToken();
  const verify_expires_at = new Date(Date.now() + 1000*60*60*24*14); // 14 days

  const { error, data } = await supabase.from('credentials').insert({
    owner: user.id,
    type: body.type,
    title: body.title,
    organization: body.organization,
    issue_date: body.issueDate,
    file_path: body.filePath,
    status: 'pending',
    issuer_email: body.issuerEmail,
    verify_token,
    verify_expires_at
  }).select('id, title, organization, issuer_email').single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (data.issuer_email) {
    const url = `${process.env.APP_URL}/verify?token=${verify_token}`;
    await resend.emails.send({
      from: process.env.RESEND_FROM!,
      to: data.issuer_email,
      subject: `Verify credential for ${data.title} – ${data.organization}`,
      html: `<p>Hello,</p>
        <p>Please confirm this credential request. This link expires in 14 days.</p>
        <p><a href="${url}" style="display:inline-block;background:#111;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Open verification</a></p>
        <p>If you did not expect this, ignore this email.</p>`
    });
  }

  return NextResponse.json({ ok: true });
}
