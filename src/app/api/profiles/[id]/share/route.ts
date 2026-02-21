import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt'

async function getUser(req: Request) {
    const token = extractTokenFromHeader(req.headers.get('authorization'))
    if (!token) return null
    const payload = await verifyToken(token)
    if (!payload || !payload.sub) return null
    return await prisma.user.findUnique({ where: { id: parseInt(payload.sub as string, 10) } })
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const profile = await prisma.profile.findUnique({ where: { id } })

        if (!profile || profile.ownerId !== user.id) {
            return NextResponse.json({ error: 'Profile not found or denied' }, { status: 403 })
        }

        const body = await req.json()
        const { username, permission } = body

        if (!username) return NextResponse.json({ error: 'Username is required' }, { status: 400 })

        const targetUser = await prisma.user.findUnique({ where: { name: username } })
        if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        if (targetUser.id === user.id) {
            return NextResponse.json({ error: 'Cannot share with yourself' }, { status: 400 })
        }

        const perm = permission === 'write' ? 'write' : 'read'

        const existingShare = await prisma.profileShare.findUnique({
            where: { profileId_userId: { profileId: id, userId: targetUser.id } }
        })

        if (existingShare) {
            await prisma.profileShare.update({
                where: { id: existingShare.id },
                data: { permission: perm }
            })
            return NextResponse.json({ message: 'Share updated' })
        }

        await prisma.profileShare.create({
            data: {
                profileId: id,
                userId: targetUser.id,
                permission: perm
            }
        })

        return NextResponse.json({ message: 'Shared with ' + username })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const profile = await prisma.profile.findUnique({ where: { id } })

        if (!profile || profile.ownerId !== user.id) {
            return NextResponse.json({ error: 'Profile not found or denied' }, { status: 403 })
        }

        const body = await req.json().catch(() => null)
        const username = body?.username

        if (!username) return NextResponse.json({ error: 'Username is required' }, { status: 400 })

        const targetUser = await prisma.user.findUnique({ where: { name: username } })
        if (!targetUser) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        await prisma.profileShare.deleteMany({
            where: { profileId: id, userId: targetUser.id }
        })

        return NextResponse.json({ message: 'Share removed' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
