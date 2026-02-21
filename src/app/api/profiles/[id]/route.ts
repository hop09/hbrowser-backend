import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt'
import fs from 'fs'
import path from 'path'

async function getUser(req: Request) {
    const token = extractTokenFromHeader(req.headers.get('authorization'))
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload || !payload.sub) return null
    return await prisma.user.findUnique({ where: { id: parseInt(payload.sub as string, 10) } })
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const profile = await prisma.profile.findUnique({ where: { id } })

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
        if (profile.ownerId !== user.id) return NextResponse.json({ error: 'Permission denied' }, { status: 403 })

        // Also delete sync zip if exists
        const syncDir = path.join(process.cwd(), 'storage', 'sync')
        const syncPath = path.join(syncDir, `${id}.zip`)
        if (fs.existsSync(syncPath)) {
            fs.unlinkSync(syncPath)
        }

        await prisma.profileShare.deleteMany({ where: { profileId: id } })
        await prisma.profile.delete({ where: { id } })

        return NextResponse.json({ message: 'Profile deleted' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
