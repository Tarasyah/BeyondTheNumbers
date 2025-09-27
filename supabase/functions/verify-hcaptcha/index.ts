// supabase/functions/verify-hcaptcha/index.ts

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Dapatkan token hCaptcha dari permintaan klien
    const { token } = await req.json();
    const secret = Deno.env.get('HCAPTCHA_SECRET_KEY');

    if (!token || !secret) {
      return new Response(JSON.stringify({ error: 'Missing token or secret key environment variable' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Kirim permintaan verifikasi ke server hCaptcha
    const response = await fetch('https://api.hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        response: token,
        secret: secret,
      }),
    });

    const data = await response.json();

    // Log the verification data for debugging
    console.log("hCaptcha server response:", data);

    // 3. Kirim kembali hasilnya ke klien
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
