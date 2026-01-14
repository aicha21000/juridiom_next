import React, { FC } from 'react';
import Link from 'next/link';

const Legal: FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">


      <section className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        <header>
          <h1 className="text-3xl md:text-4xl font-bold text-red-600">Mentions légales</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Conformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique.</p>
        </header>

        <article className="grid gap-6">
          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3">Éditeur du site</h2>
            <ul className="space-y-1 text-gray-700 dark:text-gray-300">
              <li><strong>Dénomination</strong> : Madame Aicha Salhi (Entreprise individuelle)</li>
              <li><strong>SIREN</strong> : 830 915 666</li>
              <li><strong>SIRET (siège)</strong> : 830 915 666 00010</li>
              <li><strong>TVA intracommunautaire</strong> : FR76830915666</li>
              <li><strong>Code APE/NAF</strong> : 7430Z — Traduction et interprétation</li>
              <li><strong>Adresse</strong> : 4 B Avenue Champollion, 21000 Dijon, France</li>
              <li><strong>Email</strong> : <a className="text-red-600" href="mailto:contact@traductionenarabe.fr">contact@traductionenarabe.fr</a></li>
              <li><strong>Téléphone</strong> : <a className="text-red-600" href="tel:+33669151216">+33 6 69 15 12 16</a></li>
              <li><strong>Directrice de publication</strong> : Aicha Salhi</li>
            </ul>
          </section>

          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3">Hébergement</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Site hébergé par <strong>Hostinger International Ltd.</strong>, 61 Lordou Vironos, 6023 Larnaca, Chypre. <br />
              Les services backend sont opérés via Vercel pour certaines fonctionnalités API.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3">Propriété intellectuelle</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Le présent site et l'ensemble de ses contenus (textes, images, logos, graphismes) sont protégés par le droit de la propriété intellectuelle.
              Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite est interdite.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3">Responsabilité</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Malgré le soin apporté à la mise à jour du site, des erreurs peuvent subsister. L'éditeur ne peut être tenu pour responsable des dommages directs ou indirects résultant de l'utilisation du site.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3">Données personnelles (RGPD)</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Pour en savoir plus sur le traitement de vos données, consultez notre page <Link className="text-red-600" href="/rgpd">RGPD & Confidentialité</Link> et la section <Link className="text-red-600" href="/securite-ssl">Sécurité & SSL</Link>.
              Vous pouvez exercer vos droits en écrivant à <a className="text-red-600" href="mailto:contact@traductionenarabe.fr">contact@traductionenarabe.fr</a>.
            </p>
          </section>

          <section className="p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-3">Droit applicable</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Le présent site est soumis au droit français. En cas de litige, les tribunaux de Dijon sont compétents.
            </p>
          </section>

          <footer className="text-sm text-gray-500 dark:text-gray-400 px-1">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </footer>
        </article>
      </section>
    </div>
  );
};

export default Legal;
