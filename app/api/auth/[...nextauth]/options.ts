import { NextAuthOptions } from 'next-auth'
import  CredentialsProvider  from 'next-auth/providers/credentials'
import GoogleProvider from "next-auth/providers/google"
import bcrypt from 'bcryptjs'

import prisma from '@/lib/prisma'

export const authoptions: NextAuthOptions = {

    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "text"},
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials:any):Promise<any>{
                try{
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });
                    if(!user){
                        throw new Error('No user found with the corresponding email');
                    }

                    if(!user.isVerified){
                        throw new Error('Please verify your account first before login!');
                    }
                    
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
                    if(!isPasswordCorrect){
                        throw new Error('Invalid Password!');
                    }

                    return user;


                }catch(error:any){
                    console.log(error);
                    throw new Error('Invalid credentials',error);
                }
            }

        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                const existingUser = await prisma.user.findUnique({
                    where: {
                        email: user.email!
                    }
                });
                
                if (existingUser) {
                    user.id = existingUser?.id.toString();
                    user.name = existingUser.name;
                    return true;
                } else {
                    try {
                        const newUser = await prisma.user.create({
                            data: {
                                email: user.email!,
                                name: user.name!,
                                isVerified: true, 
                                password: await bcrypt.hash(Math.random().toString(36).slice(2) + Date.now().toString(), 10), // random password for db schema
                            }
                        });
                        user.id = newUser?.id.toString();
                        return true;
                    } catch (error) {
                        console.error("Error creating user from Google auth:", error);
                        return false;
                    }
                }
            }
            return true;
        },
        async jwt({token, user, trigger, session }) { // this user is the user that we have returned from the credentials authorize function
            // we can only put id in the token which is by defauly, 
            // but we will be putting the email and name other stuffs as well so that we dont require to fetch the user from the database everytime,
            // yes payload size will be bigger but its okay when we dont need to fetch the user everytime
            // same for session, put everything there, and whenever we have the session access or token access, we can fetch the data whenever we feel

            if (trigger === 'update' && session?.user?.name) { // for update name or details , updating the session
                token.name = session.user.name;
            }
            else if (user) {
                token.id = user.id?.toString();
                token.isVerified = user.isVerified;
                token.name = user.name;
            }
            return token

        },
        async session({session, token}) {
            if(token){
                session.user.id = token.id;
                session.user.isVerified = token.isVerified;
                session.user.name = token.name;
            }

            return session
        },  
        

    },
    pages: {
        signIn: '/onboarding/sign-in',
    },
    session: {
        strategy: 'jwt', // the person who has the token, is the user
    },
    secret: process.env.NEXTAUTH_SECRET,
    



}
