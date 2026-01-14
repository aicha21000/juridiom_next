import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ filename: string }> }
) {
    const { filename } = await params;

    if (!filename) {
        return NextResponse.json({ message: 'Filename is required' }, { status: 400 });
    }

    try {
        const bucket = firebaseAdmin.storage().bucket();
        // Reconstruct the path. We know uploads go to 'temp-files/'
        // But wait, the filename variable might be just the name or the full path encoded?
        // In Services.tsx: fileName = filePath.split("/").pop();
        // filePath was 'temp-files/...'
        // So fileName is just the file name.
        // We assume the folder is 'temp-files/'.

        const filePath = `temp-files/${filename}`;
        const file = bucket.file(filePath);

        // Check if exists
        const [exists] = await file.exists();
        if (exists) {
            await file.delete();
            return NextResponse.json({ message: 'File deleted successfully' });
        } else {
            // Also check without folder just in case
            return NextResponse.json({ message: 'File not found' }, { status: 404 });
        }

    } catch (error: any) {
        console.error('Error deleting file:', error);
        return NextResponse.json({ message: 'Error deleting file' }, { status: 500 });
    }
}
