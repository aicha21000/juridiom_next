"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Qr {
  _id: string;
  question: string;
  answer: string;
}

const STATIC_QRS: Qr[] = [
  {
    _id: '1',
    question: 'Quelle est la différence entre une traduction simple et une traduction certifiée ?',
    answer: 'Une traduction certifiée (ou assermentée) est réalisée par un expert judiciaire auprès d\'une Cour d\'Appel. Elle a une valeur officielle pour les administrations. Une traduction simple est destinée à un usage privé ou commercial non officiel.'
  },
  {
    _id: '2',
    question: 'Quels sont les délais de traduction ?',
    answer: 'Le délai standard est de 24 à 48 heures pour les documents courants (actes de naissance, casiers judiciaires). Pour les documents plus longs, un délai sera précisé dans le devis.'
  },
  {
    _id: '3',
    question: 'Comment puis-je payer ma commande ?',
    answer: 'Vous pouvez régler votre commande directement en ligne par carte bancaire via notre système sécurisé (Stripe).'
  },
  {
    _id: '4',
    question: 'Comment recevoir ma traduction ?',
    answer: 'Vous recevrez d\'abord une copie numérique par email (PDF). Si vous avez choisi l\'option livraison papier, l\'original vous sera envoyé par la poste à l\'adresse indiquée.'
  },
  {
    _id: '5',
    question: 'Vos traductions sont-elles valables à l\'étranger ?',
    answer: 'Oui, mais selon le pays de destination, une légalisation ou une apostille peut être nécessaire. Nous pouvons vous conseiller sur ces démarches.'
  }
];

const FAQ = () => {
  const { isDarkMode } = useTheme();
  const [qrs] = useState<Qr[]>(STATIC_QRS);
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [allOpen, setAllOpen] = useState(false);

  const toSlug = (text: string) =>
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const filteredQrs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return qrs;
    return qrs.filter(item =>
      item.question.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q)
    );
  }, [qrs, query]);

  const handleToggleAll = () => {
    setAllOpen(prev => !prev);
    setOpenAccordion(null);
  };

  // Ouvrir automatiquement la question depuis le hash et scroll
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const target = qrs.find(q => toSlug(q.question) === hash);
    if (target) {
      setAllOpen(false);
      setOpenAccordion(target._id);
      setTimeout(() => {
        const el = document.getElementById(`question-${target._id}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [qrs]);

  return (
    <>
      {/* Hero */}
      <section className={`relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-gray-900 via-gray-900 to-black' : 'bg-gradient-to-r from-red-50 via-white to-red-50'} py-12 mb-6`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[380px] h-[380px] rounded-full blur-3xl opacity-25" style={{ background: isDarkMode ? '#ef4444' : '#ef4444' }} />
          <div className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-20" style={{ background: isDarkMode ? '#38bdf8' : '#38bdf8' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className={`text-3xl md:text-4xl font-bold tracking-tight text-red-600 ${isDarkMode ? 'text-red-500' : ''}`}>Questions Fréquentes</h1>
          <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>Trouvez rapidement des réponses sur nos traductions certifiées, délais et démarches.</p>
        </div>
      </section>

      <div className={`max-w-4xl mx-auto p-4 md:p-6 ${isDarkMode ? '' : ''}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className={`text-3xl font-bold ${isDarkMode ? "text-white" : "text-[#ba1728]"}`}>
            Questions Fréquentes
          </h1>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Rechercher dans la FAQ"
                aria-label="Rechercher dans les questions fréquentes"
                className={`${isDarkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-300 text-gray-900"} w-full md:w-64 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-red-500`}
              />
            </div>
            <button
              type="button"
              onClick={handleToggleAll}
              className={`${isDarkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-100 text-gray-900 hover:bg-gray-200"} px-3 py-2 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-red-500`}
              aria-pressed={allOpen}
            >
              {allOpen ? 'Tout réduire' : 'Tout déployer'}
            </button>
          </div>
        </div>

        <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4`} aria-live="polite">{filteredQrs.length} résultat{filteredQrs.length > 1 ? 's' : ''}</p>

        {/* Liste des questions en accordéon */}
        <div className="space-y-4" role="list" aria-label="Liste des questions fréquentes">
          {filteredQrs.map(qr => (
            <div
              key={qr._id}
              className={`rounded-xl border ${isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} shadow-sm overflow-hidden transition hover:shadow-md`}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <button
                  onClick={() => toggleAccordion(qr._id)}
                  className={`flex-grow w-full text-left p-4 ${isDarkMode ? "text-white" : "text-[#ba1728]"} transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 hover:bg-black/5`}
                  aria-expanded={allOpen || openAccordion === qr._id}
                  aria-controls={`answer-${qr._id}`}
                  id={`question-${qr._id}`}
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
                      <a
                        href={`#${toSlug(qr.question)}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          window.history.replaceState(null, '', `#${toSlug(qr.question)}`);
                          if (!(allOpen || openAccordion === qr._id)) toggleAccordion(qr._id);
                        }}
                        className={`${isDarkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-700'} transition-colors`}
                        aria-label={`Lien direct vers la question: ${qr.question}`}
                      >
                        #
                      </a>
                      {qr.question}
                    </h2>
                    {openAccordion === qr._id ? (
                      <FaChevronUp className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} ml-4 flex-shrink-0`} aria-hidden="true" />
                    ) : (
                      <FaChevronDown className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'} ml-4 flex-shrink-0`} aria-hidden="true" />
                    )}
                  </div>
                </button>
              </div>
              <div
                id={`answer-${qr._id}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${allOpen || openAccordion === qr._id ? 'max-h-[600px]' : 'max-h-0'
                  }`}
                role="region"
                aria-labelledby={`question-${qr._id}`}
              >
                <div className={`p-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {/* Simplified answer render without dangerouslySetInnerHTML since static strings are safe or basic */}
                  <p>{qr.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FAQ;
