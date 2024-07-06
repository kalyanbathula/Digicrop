import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import {User} from "../../../models/userModel"
import bcrypt from "bcryptjs";
import { dbConnect } from "@/utils/mongo";
const NEXT_PUBLIC_NEXTAUTH_SECRET="i-hate-my-life-sometimes"

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: "/",
    },
    secret: NEXT_PUBLIC_NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {},
            },
            async authorize(credentials) {
                if (credentials === null) return null;

                try {
                    const conn = await dbConnect();
                    const user = await User.findOne({
                        email: credentials?.email,
                    });
                    console.log(user);
                    if (user) {
                        const isMatch = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if (isMatch) {
                            return user;
                        } else {
                            throw new E("Email or Password is not correct");
                        }
                    } else {
                        throw new Error("User not found");
                    }
                } catch (error) {
                    throw new Error(error);
                }
            },
        }),
    ],
});

export { handler as GET, handler as POST };
