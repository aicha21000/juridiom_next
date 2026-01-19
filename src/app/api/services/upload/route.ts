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

        // --- DÉBUT LOGIQUE DE DÉTECTION DU BUCKET ---
        const projectId = "juridiom-bf4f8";
        const possibleBuckets = [
            process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            process.env.FIREBASE_STORAGE_BUCKET,
            `${projectId}.appspot.com`,
            `${projectId}.firebasestorage.app`,
            projectId
        ].filter(Boolean);

        let bucket = null;
        let lastError = null;

        for (const bucketName of possibleBuckets) {
            try {
                const tempBucket = firebaseAdmin.storage().bucket(bucketName as string);
                // On vérifie si le bucket existe vraiment
                const [exists] = await tempBucket.exists();
                if (exists) {
                    bucket = tempBucket;
                    console.log(`✅ Bucket trouvé et utilisé : ${bucketName}`);
                    break;
                }
            } catch (err) {
                lastError = err;
            }
        }

        if (!bucket) {
            console.error("❌ Aucun des buckets possibles n'existe:", possibleBuckets);
            throw lastError || new Error("Bucket introuvable");
        }
        // --- FIN LOGIQUE DE DÉTECTION DU BUCKET ---

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

            // Generate a signed URL (valid for 24 h) instead of making the file public
            const [signedUrl] = await fileRef.getSignedUrl({
                action: 'read',
                expires: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            });

            fileUrls.push({
                name: file.name,
                url: signedUrl,
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
        return NextResponse.json({ message: "Erreur lors de l'upload des fichiers", details: error.message }, { status: 500 });
    }
}
