import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, roleType, companyName } = body;

    // Validation
    if (!firstName || !lastName || !email || !password || !roleType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    if (!['CLIENT', 'SUPPLIER'].includes(roleType)) {
      return NextResponse.json(
        { error: 'Invalid role type' },
        { status: 400 }
      );
    }

    if (roleType === 'SUPPLIER' && !companyName) {
      return NextResponse.json(
        { error: 'Company name is required for suppliers' },
        { status: 400 }
      );
    }

    // For demo purposes, simulate successful user creation
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      firstName,
      lastName,
      roleType,
      companyName,
    };

    console.log('Mock user registration:', mockUser);

    // Return success (without sensitive data)
    return NextResponse.json({
      message: 'User created successfully (demo mode)',
      user: {
        id: mockUser.id,
        email: mockUser.email,
        firstName: mockUser.firstName,
        lastName: mockUser.lastName,
        roleType: mockUser.roleType,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}