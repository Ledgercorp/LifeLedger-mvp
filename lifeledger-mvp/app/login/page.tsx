'use client';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useState } from 'react';

export default function Login() {
  const supabase = supabaseBrowser();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithOtp({
      email, options: { emailRedirectTo: `${location.origin}/dashboard` }
    });
    if (!error) setSent(true);
    else alert(error.message);
  }

  return (
    <div className="max-w-md mt-16">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
      {sent ? <p>Check your email for a magic link.</p> : (
        <form onSubmit={onSubmit} className="space-y-3">
          <input className="w-full border rounded p-2" placeholder="you@example.com"
            value={email} onChange={e=>setEmail(e.target.value)} />
          <button className="px-4 py-2 rounded bg-black text-white">Send magic link</button>
        </form>
      )}
    </div>
  );
}
