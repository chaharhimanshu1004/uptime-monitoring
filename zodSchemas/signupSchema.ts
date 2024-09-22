
import {z} from 'zod';

export const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long and is required'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    phone: z.string().min(10,"Phone number must be of at least 10 characters").regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number').optional(),
});

export const emailSchema = z.string().email('Invalid email format');
