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

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const profile = await prisma.profile.findUnique({ where: { id } })

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

        if (profile.ownerId !== user.id) {
            const share = await prisma.profileShare.findFirst({
                where: { profileId: id, userId: user.id, permission: 'write' }
            })
            if (!share) return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
        }

        const formData = await req.formData()
        const file = formData.get('file') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No file part' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const syncDir = path.join(process.cwd(), 'storage', 'sync')

        if (!fs.existsSync(syncDir)) {
            fs.mkdirSync(syncDir, { recursive: true })
        }

        const filename = `${id}.zip`
        fs.writeFileSync(path.join(syncDir, filename), buffer)

        await prisma.profile.update({
            where: { id },
            data: { lastSynced: new Date() }
        })

        return NextResponse.json({ message: 'Sync data uploaded' })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getUser(req)
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { id } = await params
        const profile = await prisma.profile.findUnique({ where: { id } })

        if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

        if (profile.ownerId !== user.id) {
            const share = await prisma.profileShare.findFirst({
                where: { profileId: id, userId: user.id }
            })
            if (!share) return NextResponse.json({ error: 'Permission denied' }, { status: 403 })
        }

        const syncDir = path.join(process.cwd(), 'storage', 'sync')
        const syncPath = path.join(syncDir, `${id}.zip`)

        if (!fs.existsSync(syncPath)) {
            return NextResponse.json({ error: 'No sync data found' }, { status: 404 })
        }

        const fileBuffer = fs.readFileSync(syncPath)

        const response = new NextResponse(fileBuffer)
        response.headers.set('Content-Type', 'application/zip')
        response.headers.set('Content-Disposition', `attachment; filename="${id}.zip"`)

        return response
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
