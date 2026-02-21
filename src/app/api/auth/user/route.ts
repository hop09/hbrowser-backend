import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt'

export async function POST(req: Request) {
    try {
        const token = extractTokenFromHeader(req.headers.get('authorization'))
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = await verifyToken(token)
        if (!payload || !payload.sub) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const user = await prisma.user.findUnique({ where: { id: parseInt(payload.sub as string, 10) } })
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

        const body = await req.json()
        const { name, email, password, password_confirmation } = body

        const updateData: any = {}

        if (name) updateData.name = name

        if (email && email !== user.email) {
            const emailExists = await prisma.user.findUnique({ where: { email } })
            if (emailExists) {
                return NextResponse.json({ email: ['The email has already been taken.'] }, { status: 422 })
            }
            updateData.email = email
        }

        if (password) {
            if (password.length < 6) {
                return NextResponse.json({ password: ['The password must be at least 6 characters.'] }, { status: 422 })
            }
            // Assuming sometimes missing _confirmation in body from front-end is also handled as per Laravel rules
            if (password !== password_confirmation) {
                return NextResponse.json({ password: ['The password confirmation does not match.'] }, { status: 422 })
            }
            updateData.password = await bcrypt.hash(password, 10)
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: updateData,
            select: { id: true, name: true, email: true, createdAt: true, updatedAt: true }
        })

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: updatedUser
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
