import NextAuth, { DefaultSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { RoleType, SubscriptionPlan } from '@/generated/prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: RoleType;
      subscriptionPlan: SubscriptionPlan;
      organizationId?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: RoleType;
    subscriptionPlan: SubscriptionPlan;
    organizationId?: string;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { organization: true },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`.trim() || user.email,
          role: user.roleType,
          subscriptionPlan: user.subscriptionPlan,
          organizationId: user.organizationId || undefined,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.subscriptionPlan = user.subscriptionPlan;
        token.organizationId = user.organizationId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!;
        session.user.role = token.role as RoleType;
        session.user.subscriptionPlan = token.subscriptionPlan as SubscriptionPlan;
        session.user.organizationId = token.organizationId as string;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user with Google account
            await prisma.user.create({
              data: {
                email: user.email!,
                firstName: user.name?.split(' ')[0] || '',
                lastName: user.name?.split(' ').slice(1).join(' ') || '',
                roleType: 'CLIENT', // Default role
                subscriptionPlan: 'FREE', // Default plan
                passwordHash: '', // No password for OAuth users
                avatarUrl: user.image,
              },
            });
          }
        } catch (error) {
          console.error('Error creating user:', error);
          return false;
        }
      }
      return true;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
});