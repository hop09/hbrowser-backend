import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt'

export async function GET(req: Request) {
    try {
        const token = extractTokenFromHeader(req.headers.get('authorization'))
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const payload = await verifyToken(token)
        if (!payload || !payload.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: parseInt(payload.sub as string, 10) }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json({
            id: user.id,
            username: user.name,
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
