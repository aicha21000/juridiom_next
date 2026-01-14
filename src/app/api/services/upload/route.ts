import { NextResponse } from 'next/server';
import { firebaseAdmin } from '@/lib/firebaseAdmin';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const files = formData.getAll('files') as File[];

        if (!files || files.length === 0) {
            return NextResponse.json({ message: 'Aucun fichier n\'a été uploadé.' }, { status: 400 });
        }

        const bucket = firebaseAdmin.storage().bucket();
        const tempFolder = 'temp-files';
        const fileUrls = [];

        for (const file of files) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const firebaseFileName = `${tempFolder}/${Date.now()}_${file.name}`;
            const fileRef = bucket.file(firebaseFileName);

            await fileRef.save(buffer, {
                metadata: {
                    contentType: file.type,
                    contentDisposition: 'inline'
                }
            });

            await fileRef.makePublic();
            const firebaseUrl = `https://storage.googleapis.com/${bucket.name}/${firebaseFileName}`;

            fileUrls.push({
                name: file.name,
                url: firebaseUrl,
                path: firebaseFileName
            });
        }

        // Handle cart cookie
        const cookieStore = await cookies();
        const cartValue = cookieStore.get('cart')?.value;
        const cart = JSON.parse(cartValue || "[]");

        if (cart.length === 0) {
            cart.push({
                files: fileUrls,
                numberOfPages: 0,
                numberOfDocuments: 0,
                deliveryMethod: '',
                mailClient: '',
                legalization: '',
                totalPrice: 0,
                comment: ''
            });
        } else {
            if (!cart[0].files) {
                cart[0].files = [];
            }
            cart[0].files = [...(cart[0].files || []), ...fileUrls];
        }

        const response = NextResponse.json({
            message: `${files.length} fichiers uploadés avec succès !`,
            fileUrls: fileUrls,
            cart: cart
        });

        response.cookies.set('cart', JSON.stringify(cart), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            path: '/'
        });

        return response;

    } catch (error: any) {
        console.error("Erreur lors de l'upload vers Firebase:", error);
        return NextResponse.json({ message: "Erreur lors de l'upload des fichiers" }, { status: 500 });
    }
}
