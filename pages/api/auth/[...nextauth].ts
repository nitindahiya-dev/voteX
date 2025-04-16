import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '../../../lib/prisma';
import { verifySignature } from '../../../utils/solana';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Solana',
      credentials: {
        walletAddress: { label: 'Wallet Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
        message: { label: 'Message', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.walletAddress || !credentials?.signature || !credentials?.message) {
          return null;
        }

        const isValid = await verifySignature(
          credentials.message,
          credentials.signature,
          credentials.walletAddress
        );

        if (!isValid) {
          return null;
        }

        let user = await prisma.user.findUnique({
          where: { walletAddress: credentials.walletAddress },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              walletAddress: credentials.walletAddress,
              name: `User_${credentials.walletAddress.slice(0, 8)}`,
            },
          });
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id.toString(),
          walletAddress: user.walletAddress,
          name: user.name,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.walletAddress = token.walletAddress;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});