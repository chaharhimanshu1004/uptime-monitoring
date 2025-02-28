
import 'next-auth'
import { DefaultSession } from 'next-auth';

// next auth ke andr jo user hoga usko redefine coz in option.ts it will not allow us to fetch the user id from the user, because next-auth's user dont know about it

declare module 'next-auth' {
    interface User {
        id?: string;
        isVerified?: boolean;
        name?: string;
    }
    interface Session {
        user :{
            id?: string;
            isVerified?: boolean;
            name?: string;
        } & DefaultSession['user']

    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id?: string;
        isVerified?: boolean;
        name?: string;
    }
}
