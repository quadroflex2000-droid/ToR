import { NextRequest, NextResponse } from 'next/server';

// Temporary mock for NextAuth until configuration issues are resolved
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Auth configuration in progress',
    session: null 
  });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Auth configuration in progress',
    session: null 
  });
}