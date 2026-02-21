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

export async function GET(req: Request) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(req.url)
        const perPage = Math.min(parseInt(searchParams.get('per_page') || '10', 10), 100)
        const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)

        const profiles = await prisma.profile.findMany({
            where: {
                OR: [
                    { ownerId: user.id },
                    { shares: { some: { userId: user.id } } }
                ]
            },
            skip: (page - 1) * perPage,
            take: perPage,
        })

        const total = await prisma.profile.count({
            where: {
                OR: [
                    { ownerId: user.id },
                    { shares: { some: { userId: user.id } } }
                ]
            }
        })

        const result = profiles.map((profile: any) => {
            const metadata = (profile.metadata as any) || {}
            return {
                ...metadata,
                id: profile.id,
                name: profile.name,
                owner_id: profile.ownerId,
                is_owner: profile.ownerId === user.id,
                last_synced: profile.lastSynced,
            }
        })

        const lastPage = Math.ceil(total / perPage)

        return NextResponse.json({
            data: result,
            current_page: page,
            last_page: lastPage,
            per_page: perPage,
            total,
            has_more: page < lastPage,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const body = await req.json()
        const { id, name, metadata } = body

        if (!id || !name) {
            return NextResponse.json({ error: 'Missing id or name' }, { status: 400 })
        }

        const existingProfile = await prisma.profile.findUnique({ where: { id } })

        if (existingProfile) {
            if (existingProfile.ownerId !== user.id) {
                const share = await prisma.profileShare.findFirst({
                    where: { profileId: id, userId: user.id, permission: 'write' }
                })
                if (!share) return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
            }

            await prisma.profile.update({
                where: { id },
                data: { name, metadata }
            })
        } else {
            await prisma.profile.create({
                data: {
                    id,
                    name,
                    metadata,
                    ownerId: user.id,
                }
            })
        }

        return NextResponse.json({ message: 'Profile saved' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
