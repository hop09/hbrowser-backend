import { NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader, signToken } from '@/lib/jwt'

export async function POST(req: Request) {
    try {
        const oldToken = extractTokenFromHeader(req.headers.get('authorization'))
        if (!oldToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(oldToken)
        if (!payload || !payload.sub) {
            return NextResponse.json({ error: 'Could not refresh token' }, { status: 401 })
        }

        const newToken = await signToken({ sub: payload.sub, username: payload.username })

        return NextResponse.json({ token: newToken })

    } catch (error) {
        return NextResponse.json({ error: 'Could not refresh token' }, { status: 401 })
    }
}
