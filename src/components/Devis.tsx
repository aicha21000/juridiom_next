"use client";
import React, { FC, useState } from "react";
// import { useAuth } from "../context/AuthContext"; // Auth removed
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const Devis: FC = () => {
  // const { isAuthenticated, user } = useAuth(); // Auth removed
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    numberOfPages: number;
    deliveryMethod: string;
    message: string;
    file: File | null;
  }>({
    name: "",
    email: "",
    numberOfPages: 1,
    deliveryMethod: "email",
    message: "",
    file: null,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Auth autofill removed
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData((prevState) => ({ ...prevState, email: user.email }));
    }
  }, [isAuthenticated, user]);
  */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "file" && value) {
        formDataToSubmit.append("file", value as File);
      } else if (value !== null) {
        formDataToSubmit.append(key, String(value));
      }
    });

    try {
      await axios.post(`/api/services/request-quote`, formDataToSubmit);
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande de devis :", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen px-6 py-12 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <h2 className={`text-4xl font-bold text-center ${isDarkMode ? 'text-red-500' : 'text-red-700'}`}>
          Demandez un devis
        </h2>
        <p className={`text-center mt-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Besoin d'un devis pour une traduction ? Nous sommes là pour vous aider !
        </p>

        {submitted ? (
          <div className="bg-green-600 p-6 rounded-lg shadow-lg mt-6 text-center">
            <p className="text-white text-lg font-semibold">Votre demande de devis a été envoyée avec succès !</p>
            <p className="text-white mt-2">Nous vous enverrons votre devis dans les plus brefs délais.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-lg mt-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <label className={`block mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nom complet</label>
            <input
              type="text"
              name="name"
              placeholder="Votre nom"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-3 rounded ${isDarkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} mb-4`}
              required
            />

            <label className={`block mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Adresse email</label>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 rounded ${isDarkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} mb-4`}
              // disabled={isAuthenticated} // Removed
              required
            />

            <label className={`block mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Nombre de pages</label>
            <input
              type="number"
              name="numberOfPages"
              value={formData.numberOfPages}
              onChange={handleChange}
              className={`w-full p-3 rounded ${isDarkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} mb-4`}
              min="1"
              required
            />

            <label className={`block mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Méthode de livraison</label>
            <select
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onChange={handleChange}
              className={`w-full p-3 rounded ${isDarkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} mb-4`}
            >
              <option value="email">Email</option>
              <option value="standard">Livraison standard</option>
              <option value="priority">Livraison prioritaire</option>
              <option value="international">Livraison à l'étranger</option>
              <option value="dhl">Livraison DHL</option>
            </select>


            <label className={`block mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Message</label>
            <textarea
              name="message"
              placeholder="Votre message"
              value={formData.message}
              onChange={handleChange}
              className={`w-full p-3 rounded ${isDarkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} mb-4`}
              rows={5}
            ></textarea>

            <label className={`block mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Télécharger un fichier (optionnel)</label>
            <input
              type="file"
              accept=".pdf,.png,.jpg"
              onChange={handleFileChange}
              className={`w-full p-3 rounded ${isDarkMode ? 'bg-gray-700 text-white border border-gray-600' : 'bg-gray-200 text-gray-900 border border-gray-400'} mb-4`}
            />

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <button
              type="submit"
              className={`w-full ${isDarkMode ? 'bg-red-600' : 'bg-red-500'} text-white py-3 rounded-lg text-lg font-semibold hover:${isDarkMode ? 'bg-red-700' : 'bg-red-600'}`}
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Envoyer la demande"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Devis;
