import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Traductrice Assermentée Arabe à Longvic (Grand Dijon) | Aicha Salhi – Bureau principal",
    description: "Bureau principal d'Aicha Salhi, traductrice assermentée arabe-français, au Centre d'Affaires Regus de Longvic (Grand Dijon). Réception de vos documents sur rendez-vous. Accès facile, parking gratuit.",
    alternates: {
        canonical: "https://traductionenarabe.fr/traducteur-assermente-longvic",
    },
    openGraph: {
        title: "Traductrice Assermentée Arabe à Longvic (Grand Dijon) | Aicha Salhi",
        description: "Bureau principal de traduction assermentée à Longvic, Grand Dijon. Réception de vos documents officiels sur rendez-vous.",
        url: "https://traductionenarabe.fr/traducteur-assermente-longvic",
        locale: "fr_FR",
        type: "website",
    },
};

export default function PageLongvic() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">

            {/* Schema.org LocalBusiness structuré – Longvic */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "ProfessionalService",
                        "name": "Aicha Salhi – Traductrice Assermentée Arabe Longvic Grand Dijon",
                        "image": "https://traductionenarabe.fr/assets/logo.svg",
                        "url": "https://traductionenarabe.fr/traducteur-assermente-longvic",
                        "telephone": "+33669151216",
                        "email": "contact@traductionenarabe.fr",
                        "address": {
                            "@type": "PostalAddress",
                            "streetAddress": "Centre d'Affaires Regus, 8 Chemin De La Noue",
                            "addressLocality": "Longvic",
                            "postalCode": "21600",
                            "addressCountry": "FR"
                        },
                        "geo": {
                            "@type": "GeoCoordinates",
                            "latitude": 47.295,
                            "longitude": 5.076
                        },
                        "openingHoursSpecification": {
                            "@type": "OpeningHoursSpecification",
                            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                            "opens": "09:00",
                            "closes": "18:00"
                        },
                        "priceRange": "€€",
                        "areaServed": ["Longvic", "Dijon", "Grand Dijon", "Côte-d'Or", "Bourgogne-Franche-Comté"],
                        "hasCredential": "Traductrice assermentée près la Cour d'Appel de Dijon"
                    })
                }}
            />

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white dark:from-gray-900 dark:to-black py-20">
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-100 dark:bg-red-900/20 blur-3xl opacity-40" />
                <div className="max-w-5xl mx-auto px-6 relative">
                    <div className="inline-block px-4 py-1.5 mb-6 rounded-full text-sm font-semibold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800">
                        📍 Longvic – Grand Dijon (21600) – Bureau principal
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-6 leading-tight">
                        Traductrice Assermentée Arabe à Longvic<br className="hidden md:block" />
                        <span className="text-3xl md:text-4xl font-semibold text-gray-700 dark:text-gray-300">Grand Dijon</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mb-4 leading-relaxed">
                        Aicha Salhi vous accueille dans son <strong>bureau principal</strong> au Centre d'Affaires Regus de Longvic pour la réception et le dépôt de vos documents officiels à traduire. Longvic est limitrophe de Dijon et fait partie du <strong>Grand Dijon Métropole</strong>.
                    </p>
                    <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mb-8">
                        Bureau : <strong>Centre d'Affaires Regus, 8 Chemin De La Noue, 21600 Longvic</strong> – Accès facile depuis Dijon (5 min), parking gratuit sur place, accueil professionnel.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link href="/services" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-red-600 rounded-full shadow-lg hover:bg-red-700 transition-all">
                            Demander un devis
                        </Link>
                        <Link href="/contact" className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold border-2 border-red-600 text-red-600 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            Prendre rendez-vous
                        </Link>
                    </div>
                </div>
            </section>

            {/* Accès & Pratique */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-3xl font-bold mb-10 text-center">Accès au bureau de Longvic</h2>
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <div className="text-4xl mb-3">🚗</div>
                        <h3 className="text-lg font-semibold mb-2">En voiture</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">5 minutes depuis le centre de Dijon. Suivre direction Longvic / Zone commerciale. <strong>Parking gratuit sur place</strong>.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <div className="text-4xl mb-3">🚌</div>
                        <h3 className="text-lg font-semibold mb-2">En bus</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Lignes DIVIA accessibles depuis Dijon. Arrêt à proximité de Longvic – Chemin de la Noue.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 text-center">
                        <div className="text-4xl mb-3">🏢</div>
                        <h3 className="text-lg font-semibold mb-2">Centre d'Affaires Regus</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Cadre professionnel, accueil sécurisé, discrétion garantie. Idéal pour la remise de vos documents confidentiels.</p>
                    </div>
                </div>

                {/* Carte Google Maps */}
                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700">
                    <iframe
                        title="Bureau principal Longvic – Aicha Salhi Traductrice Assermentée"
                        className="w-full h-80"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src="https://maps.google.com/maps?q=8+Chemin+De+La+Noue,+21600+Longvic&t=&z=15&ie=UTF8&iwloc=&output=embed"
                    />
                </div>
            </section>

            {/* Services */}
            <section className="bg-red-50 dark:bg-gray-800/50 py-16">
                <div className="max-w-5xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4 text-center">Traductions certifiées disponibles à Longvic</h2>
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                        Tous les services de traduction assermentée sont disponibles depuis notre bureau de Longvic, au cœur du Grand Dijon.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            { title: "Documents d'état civil", desc: "Actes de naissance, actes de mariage, livrets de famille, certificats de nationalité.", icon: "📄" },
                            { title: "Documents judiciaires", desc: "Jugements, décisions de justice, casiers judiciaires, procurations.", icon: "⚖️" },
                            { title: "Diplômes & relevés de notes", desc: "Pour demandes d'équivalence, de bourse ou de visa.", icon: "🎓" },
                            { title: "Documents commerciaux", desc: "Statuts, contrats, bilans pour vos démarches professionnelles.", icon: "🏢" },
                            { title: "Légalisation & apostille", desc: "Accompagnement pour la légalisation de vos documents officiels.", icon: "🔏" },
                            { title: "Traduction à distance", desc: "Envoyez par email, recevez par PDF et courrier – partout en France.", icon: "📧" },
                        ].map((s) => (
                            <div key={s.title} className="flex items-start gap-4 p-5 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
                                <span className="text-2xl flex-shrink-0">{s.icon}</span>
                                <div>
                                    <h3 className="font-semibold text-red-600 mb-1">{s.title}</h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Coordonnées */}
            <section className="max-w-5xl mx-auto px-6 py-16">
                <h2 className="text-2xl font-bold mb-8">Bureau principal – Longvic (Grand Dijon)</h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                            <p className="font-bold text-gray-900 dark:text-white mb-1">📍 Adresse</p>
                            <p className="text-gray-700 dark:text-gray-300">Centre d'Affaires Regus Longvic<br />8 Chemin De La Noue<br />21600 Longvic</p>
                            <p className="text-sm text-gray-500 mt-1 italic">Bureau principal – Réception & dépôt de vos documents officiels – Uniquement sur rendez-vous</p>
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
                            <p className="text-gray-700 dark:text-gray-300">Lundi – Vendredi : 9h – 18h<br />
                            <span className="text-sm text-gray-500">Sur rendez-vous uniquement</span></p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ℹ️ Vous pouvez aussi déposer vos documents à notre{" "}
                            <Link href="/traducteur-assermente-dijon" className="text-red-600 hover:underline">siège social de Dijon</Link>.
                        </p>
                    </div>
                    <div className="p-6 rounded-xl bg-red-50 dark:bg-gray-800 border border-red-100 dark:border-gray-700">
                        <h3 className="font-bold text-lg mb-4">Pourquoi Longvic ?</h3>
                        <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">→</span> Situé dans le Grand Dijon Métropole, à 5 minutes du centre-ville de Dijon</li>
                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">→</span> Parking gratuit et facile d'accès depuis la rocade dijonnaise</li>
                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">→</span> Cadre professionnel et sécurisé au sein du Centre d'Affaires Regus</li>
                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">→</span> Discrétion totale pour vos documents confidentiels (état civil, juridique)</li>
                            <li className="flex items-start gap-2"><span className="text-red-600 font-bold">→</span> Déposez vos originaux et récupérez votre traduction certifiée signée</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* CTA final */}
            <section className="bg-red-600 py-14 text-white text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl font-bold mb-4">Prenez rendez-vous à Longvic</h2>
                    <p className="text-red-100 mb-8 text-lg">Déposez vos documents en main propre. Traduction assermentée sous 24 à 48h.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/services" className="px-8 py-4 bg-white text-red-600 font-bold rounded-full hover:bg-red-50 transition-all shadow-lg">
                            Demander un devis
                        </Link>
                        <Link href="/contact" className="px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-red-700 transition-all">
                            Prendre rendez-vous
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}
