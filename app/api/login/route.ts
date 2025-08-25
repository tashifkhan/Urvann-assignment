import { NextResponse } from 'next/server';
import { z } from 'zod';
import { SignJWT } from 'jose';

const bodySchema = z.object({ id: z.string().min(1), password: z.string().min(1) });

export async function POST(req: Request) {
  try {
    console.log('[api/login] POST called', { url: req.url, method: req.method });
    let body: any;
    try {
      body = await req.json();
    } catch (e: any) {
      console.error('[api/login] failed to parse JSON body', e);
      return NextResponse.json({ error: 'Invalid JSON body', message: String(e?.message || e) }, { status: 400 });
    }
    const parsed = bodySchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

    const { id, password } = parsed.data;
    const adminId = process.env.ADMIN_ID || '';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    if (id !== adminId || password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'no-secret');
    const token = await new SignJWT({ id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(secret);

    return NextResponse.json({ token });
  } catch (e: any) {
    console.error('Login route error', e);
    return NextResponse.json({ error: 'Server error', message: String(e?.message || e) }, { status: 500 });
  }
}
