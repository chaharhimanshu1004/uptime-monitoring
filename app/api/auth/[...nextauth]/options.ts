import { NextAuthOptions } from 'next-auth'

import  CredentialsProvider  from 'next-auth/providers/credentials'
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

        })
    ],
    callbacks: {
        async jwt({token, user }) { // this user is the user that we have returned from the credentials authorize function
            // we can only put id in the token which is by defauly, 
            // but we will be putting the email and name other stuffs as well so that we dont require to fetch the user from the database everytime,
            // yes payload size will be bigger but its okay when we dont need to fetch the user everytime
            // same for session, put everything there, and whenever we have the session access or token access, we can fetch the data whenever we feel
            
            if(user){
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
