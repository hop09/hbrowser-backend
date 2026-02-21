import { NextResponse } from 'next/server'
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt'

export async function POST(req: Request) {
    try {
        const token = extractTokenFromHeader(req.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        // For stateless JWT, we just acknowledge the logout. 
        // True invalidation requires a blocklist or Redis, which isn't defined in the schema.
        return NextResponse.json({ message: 'Logged out successfully' })

    } catch (error) {
        return NextResponse.json({ error: 'Could not logout' }, { status: 500 })
    }
}
