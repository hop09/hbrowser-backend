import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { username, email, password } = body

        if (!username || !email || !password) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        if (username.length < 3 || username.length > 50) {
            return NextResponse.json({ error: 'Username must be between 3 and 50 characters' }, { status: 400 })
        }

        if (password.length < 6) {
            return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { name: username },
                    { email: email }
                ]
            }
        })

        if (existingUser) {
            if (existingUser.name === username) {
                return NextResponse.json({ error: 'The username has already been taken.' }, { status: 400 })
            }
            return NextResponse.json({ error: 'The email has already been taken.' }, { status: 400 })
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                name: username,
                email,
                password: hashedPassword,
            },
        })

        return NextResponse.json({ message: 'User registered successfully' }, { status: 201 })

    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
