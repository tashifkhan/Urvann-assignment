import clientPromise from '@/lib/mongo';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { jwtVerify } from 'jose';

const querySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).optional(),
  page: z.preprocess(val => parseInt(z.string().parse(val ?? '1')), z.number()).optional(),
  limit: z.preprocess(val => parseInt(z.string().parse(val ?? '12')), z.number()).optional(),
});

export async function GET(req: Request) {
  let url: URL;
  try {
    url = new URL(req.url);
  } catch (err) {
    // Some runtimes may provide a path-only URL (e.g. '/api/plants'), so provide a host fallback
    const host = req.headers.get('host') || 'localhost:3000';
    url = new URL(req.url, `http://${host}`);
  }
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams.entries()));

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid query parameters', details: parsed.error.errors }, { status: 400 });
  }

  const { search, category, sort, order = 'asc', page = 1, limit = 12 } = parsed.data;

  let client: any;
  try {
    client = await clientPromise;
  } catch (e: any) {
    console.error('[api/plants] mongo connect error', e?.message || e);
    return NextResponse.json({ error: 'Database connection failed', message: String(e?.message || e) }, { status: 500 });
  }
  const db = client.db();
  const col = db.collection('plants');

  const filter: any = {};

  if (search) {
    filter.$text = { $search: search };
  }

  if (category && category !== 'all') {
    filter.categories = category;
  }

  let totalItems: number;
  try {
    totalItems = await col.countDocuments(filter);
  } catch (e: any) {
    console.error('[api/plants] query error', e?.message || e);
    return NextResponse.json({ error: 'Database query failed', message: String(e?.message || e) }, { status: 500 });
  }

  const sortObj: any = {};
  if (sort) {
    const dir = order === 'asc' ? 1 : -1;
    if (sort === 'price') sortObj.price = dir;
    else if (sort === 'name') sortObj.name = dir;
    else if (sort === 'newest') sortObj.createdAt = dir;
  } else {
    sortObj.createdAt = -1;
  }

  let items: any[];
  try {
    items = await col
      .find(filter)
      .sort(sortObj)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();
  } catch (e: any) {
    console.error('[api/plants] fetch items error', e?.message || e);
    return NextResponse.json({ error: 'Database fetch failed', message: String(e?.message || e) }, { status: 500 });
  }

  return NextResponse.json({ items, totalItems, page, totalPages: Math.ceil(totalItems / limit) });
}

export async function POST(req: Request) {
  console.log('[api/plants] POST called', { url: req.url, method: req.method });
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

  let body: any;
  try {
    body = await req.json();
  } catch (e: any) {
    console.error('[api/plants] failed to parse JSON body', e);
    return NextResponse.json({ error: 'Invalid JSON body', message: String(e?.message || e) }, { status: 400 });
  }
  // zod validation
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
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload', details: parsed.error.errors }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db();
  const col = db.collection('plants');

  const toInsert = { ...parsed.data, createdAt: new Date() };
  const res = await col.insertOne(toInsert as any);

  return NextResponse.json({ id: res.insertedId, ...toInsert }, { status: 201 });
}
