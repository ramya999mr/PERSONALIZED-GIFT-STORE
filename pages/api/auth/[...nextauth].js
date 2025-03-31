import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import userModel from "~/models/user";

export default NextAuth({
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Providers.Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;
        const userData = await userModel.findOne({ email: username });
        if (userData) {
          const validPassword = await bcrypt.compare(password, userData.hash);
          if (validPassword) {
            return userData;
          }
          return null;
        }
        return null;
      },
    }),
  ],
  jwt: {
    signingKey: process.env.JWT_SIGNING_PRIVATE_KEY,
  },
  session: {
    jwt: true,
    maxAge: 3 * 60 * 60, // 3hr
  },
  callbacks: {
    jwt: async (token, user, account, profile, isNewUser) => {
      const userData = user && {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        house: user.house,
        city: user.city,
        state: user.state,
        zipCode: user.zipCode,
        country: user.country,
        image: user.image,
        a: user.isAdmin ? user.isAdmin : false,
        s:
          user.isStaff && user.isStaff.status
            ? user.isStaff
            : { status: false },
      };
      user && (token.user = userData);
      return Promise.resolve(token);
    },
    session: async (session, user, sessionToken) => {
      session.user = user.user;
      return Promise.resolve(session);
    },
    async redirect(url, baseUrl) {
      // v4
      // Allows relative callback URLs
      if (url.startsWith("/")) return new URL(url, baseUrl).toString();
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  database: process.env.MONGO_URI,
  pages: {
    signIn: "/signin",
  },
});
