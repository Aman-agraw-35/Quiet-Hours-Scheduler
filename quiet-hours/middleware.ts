import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/blocks', req.url))
  }

  if (!user && req.nextUrl.pathname.startsWith('/blocks')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (!user && req.nextUrl.pathname.startsWith('/api/blocks')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return res
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}