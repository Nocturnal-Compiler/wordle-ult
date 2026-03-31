import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide email and password')
        }
        
        await dbConnect()
        
        const user = await User.findOne({ email: credentials.email }).select('+password')
        
        if (!user) {
          throw new Error('No user found with this email')
        }
        
        if (!user.password) {
          throw new Error('Please sign in with the provider you used to create your account')
        }
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        
        if (!isValid) {
          throw new Error('Invalid password')
        }
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? [
          GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' || account?.provider === 'github') {
        await dbConnect()
        
        // Check if user exists, if not create one
        let existingUser = await User.findOne({ email: user.email })
        
        if (!existingUser) {
          await User.create({
            email: user.email,
            name: user.name,
            image: user.image,
          })
        }
      }
      return true
    },
    async session({ session, user, token }) {
      if (session.user?.email) {
        await dbConnect()
        const dbUser = await User.findOne({ email: session.user.email })
        if (dbUser && session.user) {
          // Add cast to ensure type checking
          (session.user as any).id = dbUser._id.toString();
        }
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
