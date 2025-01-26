import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authoptions } from '../auth/[...nextauth]/options';
import redis from '@/lib/redis';

const CHANNEL_NAME = 'website_status';
const POLLING_TIMEOUT = 10000;

export async function GET(request: NextRequest) {
    const session = await getServerSession(authoptions);
    const userId = session?.user.id as string; 
    if (!session || !session.user) {
        return NextResponse.json({
            success: false,
            message: "You need to be logged in to subscribe"
        }, { status: 401 });
    }

    try {
        const message = await waitForMessage(userId);
        if (message) {
            return NextResponse.json({ success: true, message: JSON.parse(message) });
        } else {
            return new NextResponse(null, { status: 204 }); // No new messages
        }
    } catch (err: any) {
        console.error('Error in subscription route:', err);
        return NextResponse.json({
            success: false,
            message: "An error occurred while waiting for messages"
        }, { status: 500 });
    }
}

async function waitForMessage(userId: string): Promise<string | null> {
    return new Promise((resolve) => {
        const subscriber = redis.duplicate();
        let isResolved = false;

        const cleanup = () => {
            subscriber.unsubscribe();
            subscriber.quit();
        };

        const timeout = setTimeout(() => {
            if (!isResolved) {
                isResolved = true;
                cleanup();
                resolve(null);
            }
        }, POLLING_TIMEOUT);

        subscriber.subscribe(CHANNEL_NAME, (err) => {
            if (err) {
                console.error('Failed to subscribe:', err);
                clearTimeout(timeout);
                cleanup();
                resolve(null);
            }
        });

        subscriber.on('message', (channel, message) => {
            const parsedMessage = JSON.parse(message);
            if (parsedMessage.userId === userId) {
                if (!isResolved) {
                    isResolved = true;
                    clearTimeout(timeout);
                    cleanup();
                    resolve(message);
                }
            }
        });
    });
}