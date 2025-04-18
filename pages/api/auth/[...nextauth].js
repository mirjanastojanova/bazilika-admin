import NextAuth, { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";

const adminEmails = [
  "mirjanastojanova7@gmail.com",
  "stojanovamirjana7@gmail.com",
  "bazilika.apteka@gmail.com",
  "ano.dimitrievski7@gmail.com",
];
export const authOptions = {
  secret: process.env.SECRET,
  providers: [
    // OAuth authentication providers...
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    session: ({ session, token, user }) => {
      if (adminEmails.includes(session?.user?.email)) {
        return session;
      } else {
        return false;
      }
    },
  },
};

export async function isAdminRequest(req, res) {
  return;
  // const session = await getServerSession(req, res, authOptions);
  // if (!adminEmails.includes(session?.user?.email)) {
  //   res.status(401);
  //   res.end();
  //   throw "Not admin";
  // }
}

export default NextAuth(authOptions);
