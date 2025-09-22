import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export async function GET() {
  const response = await fetch(`${API_URL}/products`, { cache: 'no-store' });
  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
