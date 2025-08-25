"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";

export default function ProfilTab() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    poste: "",
    role: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const user = await apiClient.getCurrentUser();
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        poste: user.poste || "",
        role: user.role || ""
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données utilisateur:", error);
      setMessage("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await apiClient.updateProfile({
        name: userData.name,
        phone: userData.phone,
        poste: userData.poste
      });
      setMessage("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      setMessage("Erreur lors de la mise à jour du profil");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">👤 Profil Utilisateur</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.includes("Erreur")
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-green-100 text-green-700 border border-green-200"
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-orange-100 border-2 border-orange-200 rounded-full flex items-center justify-center text-orange-700 text-2xl font-bold">
                {userData.name.charAt(0).toUpperCase() || "U"}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors text-gray-900"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={userData.email}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                disabled
              />
              <p className="text-xs text-gray-500 mt-1">L&apos;email ne peut pas être modifié</p>
            </div>
            
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
              <input
                type="text"
                value={userData.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                disabled
              />
            </div> */}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors text-gray-900"
                placeholder="+225 00 00 00 00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
              <input
                type="text"
                name="poste"
                value={userData.poste}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors text-gray-900"
                placeholder="Votre poste dans l'organisation"
              />
            </div>
            
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              {saving ? "Mise à jour..." : "Mettre à jour le profil"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">🔑 Changer le mot de passe</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors text-gray-900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirmer le mot de passe</label>
            <input type="password" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors text-gray-900" />
          </div>
          <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Changer le mot de passe
          </button>
        </div>
      </div>
    </div>
  );
}