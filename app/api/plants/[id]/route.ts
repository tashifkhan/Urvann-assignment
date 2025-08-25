import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { jwtVerify } from 'jose';

const idSchema = z.object({ id: z.string().min(1) });

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const parsed = idSchema.safeParse(params);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid id' }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection('plants');
  try {
  const ObjectId = require('mongodb').ObjectId;
  const doc = await col.findOne({ _id: new ObjectId(params.id) });
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    const { _id, ...rest } = doc as any;
    const item = { id: _id.toString(), ...rest };
    return NextResponse.json(item);
  } catch (e) {
  console.error('[api/plants/[id]] GET error', (e as any)?.message || e);
  return NextResponse.json({ error: 'Invalid id or database error', message: String((e as any)?.message || e) }, { status: 400 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  console.log('[api/plants/[id]] PUT called', { url: req.url, method: req.method, params });
  // auth
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // validate jwt
  const token = auth.replace('Bearer ', '');
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token, secret);
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch (e: any) {
    console.error('[api/plants/[id]] failed to parse JSON body', e);
    return NextResponse.json({ error: 'Invalid JSON body', message: String(e?.message || e) }, { status: 400 });
  }
  const plantSchema = z.object({
    name: z.string().min(1),
    price: z.number().min(0),
    categories: z.array(z.string()).min(1),
    stock: z.number().min(0),
    imageUrl: z.string().url(),
    description: z.string().min(10),
    careTips: z.string().min(10),
    featured: z.boolean().optional(),
  });
  const parsed = plantSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection('plants');
  try {
    const ObjectId = require('mongodb').ObjectId;
    const res = await col.findOneAndUpdate({ _id: new ObjectId(params.id) }, { $set: parsed.data }, { returnDocument: 'after' });

    if (!res.value) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const { _id, ...rest } = res.value;
    return NextResponse.json({ id: _id.toString(), ...rest });
  } catch (e: any) {
  console.error('[api/plants/[id]] PUT error', (e as any)?.message || e);
  return NextResponse.json({ error: 'Database update failed', message: String((e as any)?.message || e) }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  // auth
  const auth = req.headers.get('authorization') || '';
  if (!auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const token = auth.replace('Bearer ', '');
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
    await jwtVerify(token, secret);
  } catch (e) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ObjectId = require('mongodb').ObjectId;
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection('plants');
  try {
    const ObjectId = require('mongodb').ObjectId;
    const res = await col.deleteOne({ _id: new ObjectId(params.id) });
    if (res.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (e: any) {
  console.error('[api/plants/[id]] DELETE error', (e as any)?.message || e);
  return NextResponse.json({ error: 'Database delete failed', message: String((e as any)?.message || e) }, { status: 500 });
  }
}
