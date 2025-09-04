import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function Home() {
  const supabase = supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="mt-12">
      <h1 className="text-3xl font-semibold">LifeLedger</h1>
      <p className="text-slate-600 mt-2">Your verified life, portable anywhere.</p>
      <div className="mt-6">
        {user ? (
          <Link href="/dashboard" className="px-4 py-2 rounded bg-black text-white">Go to Dashboard</Link>
        ) : (
          <Link href="/login" className="px-4 py-2 rounded bg-black text-white">Get Started</Link>
        )}
      </div>
    </main>
  );
}
