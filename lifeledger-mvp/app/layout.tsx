export const metadata = { title: 'LifeLedger MVP' };
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="max-w-5xl mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
