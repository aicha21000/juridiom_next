"use client";
import React, { FC, useState } from "react";
// import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import {
  FaEnvelope,
  FaUser,
  FaPaperPlane,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaGlobe,
  FaCheckCircle
} from "react-icons/fa";

const Contact: FC = () => {
  // const { isAuthenticated, user } = useAuth();
  const { isDarkMode } = useTheme();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* useEffect(() => {
    if (isAuthenticated && user?.email) {
      setFormData((prevState) => ({ ...prevState, email: user.email }));
    }
  }, [isAuthenticated, user]); */

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`/api/contact`, formData);
      setSubmitted(true);
    } catch (err) {
      console.error("Erreur lors de l'envoi du message :", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>

      {/* Header / Hero Section */}
      <div className={`py-16 ${isDarkMode ? "bg-gray-900" : "bg-white"} border-b ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Prendre <span className="text-red-600">Contact</span>
          </h1>
          <p className={`text-xl max-w-2xl mx-auto ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            Une question, un devis ou simplement envie d'échanger sur votre projet ?
            Nous sommes à votre écoute.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Left Column: Contact Info & Map */}
          <div className="space-y-12">
            {/* Contact Cards */}
            <div className="space-y-6">
              <div className={`flex items-start p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <div className={`p-4 rounded-full mr-5 text-xl ${isDarkMode ? "bg-red-900/20 text-red-500" : "bg-red-50 text-red-600"}`}>
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Notre Adresse</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    10 avenue Jean-Baptiste Greuze,<br />
                    21000 Dijon
                  </p>
                </div>
              </div>

              <div className={`flex items-start p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <div className={`p-4 rounded-full mr-5 text-xl ${isDarkMode ? "bg-blue-900/20 text-blue-500" : "bg-blue-50 text-blue-600"}`}>
                  <FaPhoneAlt />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Téléphone</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <a href="tel:+33669151216" className="hover:text-red-500 transition-colors">+33 6 69 15 12 16</a>
                  </p>
                  <span className="text-xs text-green-500 font-medium">Disponible 9h-18h</span>
                </div>
              </div>

              <div className={`flex items-start p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <div className={`p-4 rounded-full mr-5 text-xl ${isDarkMode ? "bg-purple-900/20 text-purple-500" : "bg-purple-50 text-purple-600"}`}>
                  <FaEnvelope />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Email</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    <a href="mailto:contact@traductionenarabe.fr" className="hover:text-red-500 transition-colors">contact@traductionenarabe.fr</a>
                  </p>
                </div>
              </div>

              <div className={`flex items-start p-6 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-md ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
                <div className={`p-4 rounded-full mr-5 text-xl ${isDarkMode ? "bg-emerald-900/20 text-emerald-500" : "bg-emerald-50 text-emerald-600"}`}>
                  <FaGlobe />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Zone d'intervention</h3>
                  <p className={`${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                    Dijon, Bourgogne-Franche-Comté<br />
                    Et partout en France (à distance)
                  </p>
                </div>
              </div>
            </div>

            {/* Map Preview */}
            <div className={`rounded-3xl overflow-hidden shadow-lg border ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
              <iframe
                src={process.env.NEXT_PUBLIC_MAPS_URL_CONTACT || ""}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation de Aicha Salhi"
                className="grayscale hover:grayscale-0 transition-all duration-500"
              ></iframe>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className={`p-8 lg:p-10 rounded-3xl shadow-xl border ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100"}`}>
            <h2 className="text-2xl font-bold mb-8 flex items-center">
              <FaPaperPlane className="mr-3 text-red-600" /> Formulaire de contact
            </h2>

            {submitted ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-12">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-6 animate-bounce">
                  <FaCheckCircle />
                </div>
                <h3 className="text-2xl font-bold text-green-600 mb-2">Message Envoyé !</h3>
                <p className="text-gray-500 max-w-sm">
                  Merci de nous avoir contactés. Nous traiterons votre demande dans les plus brefs délais.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-8 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold mb-2 opacity-80">
                    Nom complet
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      placeholder="Votre nom"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                        }`}
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2 opacity-80">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaEnvelope />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      // disabled={isAuthenticated}
                      required
                      className={`w-full pl-10 pr-4 py-3 rounded-xl border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 disabled:opacity-50"
                        }`}
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold mb-2 opacity-80">
                    Votre message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Dites-nous en plus sur votre projet..."
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                    className={`w-full p-4 rounded-xl border focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all ${isDarkMode ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400"
                      }`}
                  ></textarea>
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-100 text-red-700 text-sm font-medium">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-xl text-lg font-bold text-white shadow-lg transform transition-all duration-300 hover:scale-[1.02] active:scale-95 ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400"
                    }`}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
