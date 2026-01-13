import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    // Handle OAuth error from Google
    if (error) {
      return NextResponse.redirect(
        new URL(`/auth/callback?error=${encodeURIComponent(error)}`, request.url)
      );
    }

    if (!code) {
      return NextResponse.redirect(
        new URL('/auth/callback?error=Missing authorization code', request.url)
      );
    }

    // Exchange code with backend
    const response = await fetch(`${BACKEND_URL}/auth/google/callback?code=${encodeURIComponent(code)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ detail: 'OAuth failed' }));
      return NextResponse.redirect(
        new URL(`/auth/callback?error=${encodeURIComponent(data.detail || 'OAuth failed')}`, request.url)
      );
    }

    // Get token from backend response
    const data = await response.json();
    const token = data.token;

    if (!token) {
      return NextResponse.redirect(
        new URL('/auth/callback?error=No token received', request.url)
      );
    }

    // Redirect to callback page with token
    return NextResponse.redirect(
      new URL(`/auth/callback?token=${encodeURIComponent(token)}&provider=google`, request.url)
    );
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.redirect(
      new URL('/auth/callback?error=Internal server error', request.url)
    );
  }
}
