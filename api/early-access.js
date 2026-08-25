const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    return res.status(500).json({ ok: false, message: 'Signup service is not configured yet.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const email = String(body?.email || '').trim().toLowerCase();
  const source = String(body?.source || 'ignyxx.in').trim().slice(0, 100) || 'ignyxx.in';
  const marketingConsent = body?.marketing_consent === true;

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ ok: false, message: 'Enter a valid email address.' });
  }

  if (!marketingConsent) {
    return res.status(400).json({ ok: false, message: 'Marketing consent is required to join early access.' });
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/early_access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({
        email,
        source,
        marketing_consent: true
      })
    });

    if (response.ok) {
      return res.status(201).json({ ok: true, message: "You're in." });
    }

    const errorText = await response.text();

    // Postgres unique-violation code, as returned through PostgREST.
    if (response.status === 409 || errorText.includes('23505') || errorText.toLowerCase().includes('duplicate')) {
      return res.status(200).json({ ok: true, duplicate: true, message: "You're already on the list." });
    }

    console.error('Supabase signup error:', response.status, errorText);
    return res.status(502).json({ ok: false, message: 'Could not save your signup right now. Please try again.' });
  } catch (error) {
    console.error('Early access API error:', error);
    return res.status(500).json({ ok: false, message: 'Could not save your signup right now. Please try again.' });
  }
}
