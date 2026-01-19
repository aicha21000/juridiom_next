// src/app/api/services/download/route.ts
import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

/**
 * Returns a signed URL for a file stored in Firebase Storage.
 * Query param `path` should be the full storage path (e.g. "temp-files/12345_myfile.pdf").
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const filePath = searchParams.get('path');
        if (!filePath) {
            return NextResponse.json({ message: 'Missing file path' }, { status: 400 });
        }

        const bucket = firebaseAdmin.storage().bucket();
        const file = bucket.file(filePath);
        // Generate a signed URL valid for 24 hours
        const [signedUrl] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 24 * 60 * 60 * 1000,
        });

        return NextResponse.json({ url: signedUrl });
    } catch (error: any) {
        console.error('❌ Error generating signed URL:', error);
        return NextResponse.json({ message: 'Error generating signed URL', details: error.message }, { status: 500 });
    }
}
