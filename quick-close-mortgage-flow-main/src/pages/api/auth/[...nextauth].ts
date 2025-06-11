import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// This is the route that NextAuth will use for all authentication requests
export default NextAuth(authOptions);

// This is a workaround for the Next.js 13+ App Router
export const config = {
  api: {
    bodyParser: false,
  },
};
