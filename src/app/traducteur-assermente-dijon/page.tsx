import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Traductrice Assermentée Arabe à Dijon | Aicha Salhi – Cour d'Appel de Dijon",
    description: "Traductrice assermentée arabe-français à Dijon, expert judiciaire près la Cour d'Appel de Dijon. Documents officiels, actes de naissance, diplômes, jugements. Devis rapide.",
    alternates: {
        canonical: "https://traductionenarabe.fr/traducteur-assermente-dijon",
    },
    openGraph: {
        title: "Traductrice Assermentée Arabe à Dijon | Aicha Salhi",
        description: "Traductrice assermentée arabe-français à Dijon. Traductions certifiées pour toutes vos démarches officielles.",
        url: "https://traductionenarabe.fr/traducteur-assermente-dijon",
        locale: "fr_FR",
        type: "website",
    },
};

export default function PageDijon() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

            {/* Schema.org LocalBusiness structuré – Dijon */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": "Aicha Salhi – Traductrice Assermentée Arabe Dijon",
                        "image": "https://traductionenarabe.fr/assets/logo.svg",
                        "url": "https://traductionenarabe.fr/traducteur-assermente-dijon",
                        "telephone": "+33669151216",
                        "email": "contact@traductionenarabe.fr",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "10 Avenue Jean Baptiste Greuze",
                            "addressLocality": "Dijon",
                            "postalCode": "21000",
                            "addressCountry": "FR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 47.330855,
                            "longitude": 5.053896
                        },
                        "openingHoursSpecification": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                            "opens": "09:00",
                            "closes": "18:00"
                        },
                        "priceRange": "€€",
                        "areaServed": ["Dijon", "Côte-d'Or", "Bourgogne-Franche-Comté"],
                        "hasCredential": "Traductrice assermentée près la Cour d'Appel de Dijon"
                    })
                }}
            />

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black py-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-red-100 dark:bg-red-900/20 blur-3xl opacity-40" />
                <div className="max-w-5xl mx-auto px-6 relative">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        📍 Dijon (21000) – Siège administratif
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6 leading-tight">
                        Traductrice Assermentée Arabe à Dijon
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mb-4 leading-relaxed">
                        Aicha Salhi est traductrice-interprète assermentée près la <strong>Cour d'Appel de Dijon</strong>, spécialisée en traduction certifiée français ↔ arabe. Vos documents officiels sont traduits avec la rigueur et la valeur juridique exigées par les administrations françaises et étrangères.
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mb-8">
                        Siège social : <strong>10 Avenue Jean Baptiste Greuze, 21000 Dijon</strong>. Dépôt de documents possible sur rendez-vous. Prestations disponibles également à distance pour toute la France.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all">
                            Demander un devis
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold mb-10 text-center">Traductions certifiées à Dijon</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { title: "Documents d'état civil", desc: "Actes de naissance, actes de mariage, livrets de famille, certificats de nationalité – traduits et certifiés pour les préfectures et consulats.", icon: "📄" },
                        { title: "Documents judiciaires", desc: "Jugements, décisions de justice, extrait de casier judiciaire, procurations notariales – traduction assermentée à valeur officielle.", icon: "⚖️" },
                        { title: "Diplômes & formations", desc: "Diplômes universitaires, relevés de notes, certifications professionnelles pour demandes d'équivalence ou de visa.", icon: "🎓" },
                        { title: "Documents d'entreprise", desc: "Statuts, bilans, contrats commerciaux, procès-verbaux pour vos démarches professionnelles en France ou à l'étranger.", icon: "🏢" },
                        { title: "Légalisation & apostille", desc: "Accompagnement complet pour la légalisation et l'apostille de vos documents auprès des autorités compétentes.", icon: "🔏" },
                        { title: "Traduction à distance", desc: "Envoyez vos documents par email, recevez votre traduction certifiée par PDF puis par courrier. Rapide et sécurisé.", icon: "📧" },
                    ].map((s) => (
                        <div key={s.title} className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="text-3xl mb-3">{s.icon}</div>
                            <h3 className="text-lg font-semibold text-red-600 mb-2">{s.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pourquoi choisir */}
            <section className="bg-red-50 dark:bg-gray-800/50 py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-10 text-center">Pourquoi choisir Aicha Salhi à Dijon ?</h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 text-xl mt-0.5">✓</span>
                                <div>
                                    <p className="font-semibold">Expert judiciaire assermentée</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Inscrite sur la liste officielle des traducteurs assermentés de la Cour d'Appel de Dijon depuis 2017.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 text-xl mt-0.5">✓</span>
                                <div>
                                    <p className="font-semibold">Master en traduction</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Diplômée de l'Université de Strasbourg, spécialisée en traduction juridique et commerciale.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 text-xl mt-0.5">✓</span>
                                <div>
                                    <p className="font-semibold">Délais rapides</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">24 à 48h pour les documents courants. Traitement prioritaire disponible.</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 text-xl mt-0.5">✓</span>
                                <div>
                                    <p className="font-semibold">Tarif transparent</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Devis gratuit en ligne, prix fixé à la page. Pas de mauvaises surprises.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 text-xl mt-0.5">✓</span>
                                <div>
                                    <p className="font-semibold">Confidentialité totale</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Vos documents sont traités avec la plus grande discrétion. Conformité RGPD.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-red-600 text-xl mt-0.5">✓</span>
                                <div>
                                    <p className="font-semibold">Valable partout en France et à l'étranger</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Traductions acceptées par les préfectures, consulats, ambassades et tribunaux.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Coordonnées + Carte */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold mb-8">Siège administratif – Dijon</h2>
                <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="space-y-4 text-gray-700 dark:text-gray-300">
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">📍 Adresse</p>
                            <p>10 Avenue Jean Baptiste Greuze<br />21000 Dijon</p>
                            <p className="text-sm text-gray-500 mt-1 italic">Siège social – Dépôt de documents possible sur rendez-vous</p>
                        </div>
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">📞 Téléphone</p>
                            <a href="tel:+33669151216" className="text-red-600 hover:underline">+33 6 69 15 12 16</a>
                        </div>
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">✉️ Email</p>
                            <a href="mailto:contact@traductionenarabe.fr" className="text-red-600 hover:underline">contact@traductionenarabe.fr</a>
                        </div>
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">🕐 Horaires</p>
                            <p>Lundi – Vendredi : 9h – 18h<br />
                            <span className="text-sm text-gray-500">Sur rendez-vous uniquement</span></p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            👉 Pour la réception et le dépôt physique de vos documents officiels, rendez-vous à notre{" "}
                            <Link href="/traducteur-assermente-longvic" className="text-red-600 hover:underline">bureau principal de Longvic</Link>.
                        </p>
                    </div>
                    <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                        <iframe
                            title="Siège administratif Dijon – Aicha Salhi Traductrice Assermentée"
                            className="w-full h-80"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            src="https://maps.google.com/maps?q=10+Avenue+Jean+Baptiste+Greuze,+21000+Dijon&t=&z=15&ie=UTF8&iwloc=&output=embed"
                        />
                    </div>
                </div>
            </section>

            {/* CTA final */}
            <section className="bg-red-600 py-14 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4">Besoin d'une traduction assermentée à Dijon ?</h2>
                    <p className="text-red-100 mb-8 text-lg">Obtenez un devis gratuit en 5 minutes. Traitement sous 24 à 48h.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/services" className="px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-all shadow-lg">
                            Demander un devis
                        </Link>
                        <Link href="/contact" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-red-700 transition-all">
                            Nous écrire
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
