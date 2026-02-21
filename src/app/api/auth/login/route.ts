import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, password } = body

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: username },
                    { email: username }
                ]
            }
        })

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const token = await signToken({ sub: user.id, username: user.name })

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                username: user.name,
            }
        })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
