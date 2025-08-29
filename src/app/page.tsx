import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Penny — Personal Finance',
  description: 'A high-density personal finance ledger. Track every rupee. No clutter, no ads.',
};

export default function LandingPage() {
  return (
    <div
      className="min-h-screen bg-[#f5f5f2] text-[#030213] font-sans"
      style={{ WebkitFontSmoothing: 'antialiased' }}
    >
      {/* Grid background — subtle ledger lines */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(3,2,19,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(3,2,19,0.04) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '28px 48px',
            borderBottom: '1px solid rgba(3,2,19,0.08)',
          }}
        >
          <span
            style={{
              fontSize: '18px',
              fontWeight: 800,
              letterSpacing: '-0.04em',
              color: '#030213',
            }}
          >
            penny<span style={{ color: '#10b981' }}>.</span>
          </span>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link
              href="/login"
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: '#717182',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Log in
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#f5f5f2',
                background: '#030213',
                padding: '9px 20px',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Get started
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <main>
          <section
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '120px 48px 80px',
            }}
          >
            {/* Eyebrow */}
            <p
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#10b981',
                marginBottom: '32px',
              }}
            >
              Personal Finance Ledger
            </p>

            {/* Headline — left-aligned, tightly tracked, editorial */}
            <h1
              style={{
                fontSize: 'clamp(48px, 7vw, 88px)',
                fontWeight: 800,
                letterSpacing: '-0.04em',
                lineHeight: 1.0,
                color: '#030213',
                margin: '0 0 40px',
                maxWidth: '14ch',
              }}
            >
              Finance,<br />engineered.
            </h1>

            {/* Subtitle — precise, no buzzwords */}
            <p
              style={{
                fontSize: '17px',
                fontWeight: 400,
                lineHeight: 1.65,
                color: '#717182',
                maxWidth: '440px',
                margin: '0 0 56px',
                letterSpacing: '-0.01em',
              }}
            >
              A private ledger for your money. Paste a bank SMS and Penny
              categorises it instantly. No subscriptions. No trackers.
              Your data stays yours.
            </p>

            {/* CTA row — sharp corners, no pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Link
                href="/register"
                style={{
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: 600,
                  letterSpacing: '-0.01em',
                  color: '#f5f5f2',
                  background: '#030213',
                  padding: '13px 28px',
                  textDecoration: 'none',
                }}
              >
                Create free account
              </Link>
              <Link
                href="/login"
                style={{
                  display: 'inline-block',
                  fontSize: '14px',
                  fontWeight: 500,
                  letterSpacing: '-0.01em',
                  color: '#717182',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(3,2,19,0.15)',
                  paddingBottom: '1px',
                }}
              >
                Already have an account
              </Link>
            </div>
          </section>

          {/* Divider */}
          <div style={{ borderTop: '1px solid rgba(3,2,19,0.08)', margin: '0 48px' }} />

          {/* What it does — 3 facts, ledger-table style, no cards, no icons */}
          <section
            style={{
              maxWidth: '900px',
              margin: '0 auto',
              padding: '80px 48px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {[
                  {
                    num: '01',
                    title: 'Paste any bank SMS',
                    detail:
                      'Gemini 1.5 Flash reads your raw transaction message and extracts the amount, merchant, and date. No manual entry.',
                  },
                  {
                    num: '02',
                    title: 'Auto-categorised',
                    detail:
                      'Food, transport, utilities, shopping — each transaction is classified automatically. A fallback regex engine works even without the API.',
                  },
                  {
                    num: '03',
                    title: 'Private by design',
                    detail:
                      'Row-level security on every database query. Only you can read your rows. Zero third-party analytics scripts.',
                  },
                ].map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderTop: '1px solid rgba(3,2,19,0.08)',
                    }}
                  >
                    <td
                      style={{
                        padding: '32px 0',
                        paddingRight: '48px',
                        width: '48px',
                        verticalAlign: 'top',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        color: '#c4c4cc',
                        fontVariantNumeric: 'tabular-nums',
                        fontFamily: 'ui-monospace, monospace',
                      }}
                    >
                      {row.num}
                    </td>
                    <td
                      style={{
                        padding: '32px 0',
                        paddingRight: '48px',
                        verticalAlign: 'top',
                        width: '220px',
                        fontSize: '15px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#030213',
                        lineHeight: 1.3,
                      }}
                    >
                      {row.title}
                    </td>
                    <td
                      style={{
                        padding: '32px 0',
                        verticalAlign: 'top',
                        fontSize: '14px',
                        fontWeight: 400,
                        color: '#717182',
                        lineHeight: 1.65,
                        letterSpacing: '-0.005em',
                      }}
                    >
                      {row.detail}
                    </td>
                  </tr>
                ))}
                <tr style={{ borderTop: '1px solid rgba(3,2,19,0.08)' }}>
                  <td colSpan={3} style={{ padding: 0 }} />
                </tr>
              </tbody>
            </table>
          </section>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid rgba(3,2,19,0.08)',
            padding: '28px 48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            style={{
              fontSize: '13px',
              fontWeight: 500,
              color: '#c4c4cc',
              letterSpacing: '-0.01em',
            }}
          >
            © {new Date().getFullYear()} Penny
          </span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#c4c4cc',
            }}
          >
            Built with Next.js · Supabase · Gemini
          </span>
        </footer>
      </div>
    </div>
  );
}
