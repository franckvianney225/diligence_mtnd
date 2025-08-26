"use client";
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api/client";

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  from_email: string;
  from_name: string;
}

export default function SMTPTab() {
  const [config, setConfig] = useState<SmtpConfig>({
    host: "",
    port: 587,
    secure: true,
    username: "",
    password: "",
    from_email: "",
    from_name: ""
  });
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadSmtpConfig();
  }, []);

  const loadSmtpConfig = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getSmtpConfig();
      if (data) {
        setConfig({
          host: data.host || "",
          port: data.port || 587,
          secure: Boolean(data.secure),
          username: data.username || "",
          password: data.password || "",
          from_email: data.from_email || "",
          from_name: data.from_name || ""
        });
      }
    } catch (error) {
      console.error("Erreur lors du chargement de la configuration SMTP:", error);
      // Ne pas afficher d'erreur si aucune configuration n'existe
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof SmtpConfig, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const showAlert = (message: string, type: 'success' | 'error' = 'success') => {
    alert(`${type === 'success' ? '✅' : '❌'} ${message}`);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await apiClient.saveSmtpConfig(config);
      showAlert("Configuration SMTP sauvegardée avec succès", 'success');
    } catch (error: unknown) {
      console.error("Erreur lors de la sauvegarde:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la sauvegarde";
      showAlert(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      const result = await apiClient.testSmtpConnection({
        host: config.host,
        port: config.port,
        secure: config.secure,
        username: config.username,
        password: config.password
      });
      
      if (result.success) {
        showAlert("Connexion SMTP testée avec succès", 'success');
      } else {
        showAlert(result.error || "Échec de la connexion SMTP", 'error');
      }
    } catch (error: unknown) {
      console.error("Erreur lors du test:", error);
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du test de connexion";
      showAlert(errorMessage, 'error');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-lg shadow-md p-8 border-2 border-gray-400">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-8 border-2 border-gray-400">
      <h2 className="text-2xl font-bold mb-8 text-gray-900">📧 Configuration SMTP</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Serveur SMTP</label>
            <input 
              type="text" 
              placeholder="smtp.gmail.com" 
              value={config.host}
              onChange={(e) => handleInputChange('host', e.target.value)}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Port</label>
            <input 
              type="number" 
              placeholder="587" 
              value={config.port}
              onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 587)}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Nom d&apos;utilisateur</label>
            <input 
              type="email" 
              placeholder="noreply@gouv.ci" 
              value={config.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Mot de passe</label>
            <input 
              type="password" 
              value={config.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium" 
              placeholder="Entrez votre mot de passe SMTP"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Chiffrement</label>
            <select 
              value={config.secure ? "TLS" : "Aucun"}
              onChange={(e) => handleInputChange('secure', e.target.value === "TLS")}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium"
            >
              <option value="TLS">TLS</option>
              <option value="Aucun">Aucun</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Email expéditeur</label>
            <input 
              type="email" 
              placeholder="system@gouv.ci" 
              value={config.from_email}
              onChange={(e) => handleInputChange('from_email', e.target.value)}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-3">Nom expéditeur</label>
            <input 
              type="text" 
              placeholder="Système Gouvernemental" 
              value={config.from_name}
              onChange={(e) => handleInputChange('from_name', e.target.value)}
              className="w-full p-4 border-2 border-gray-500 rounded-lg focus:ring-4 focus:ring-blue-500 focus:border-blue-600 transition-colors bg-white text-gray-900 font-medium" 
            />
          </div>
          <div className="flex space-x-4 pt-4">
            <button 
              onClick={handleTest}
              disabled={testing || loading}
              className="flex-1 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold px-6 py-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-lg shadow-md"
            >
              {testing ? "Test en cours..." : "Tester la connexion"}
            </button>
            <button 
              onClick={handleSave}
              disabled={loading}
              className="flex-1 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold px-6 py-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-lg shadow-md"
            >
              {loading ? "Sauvegarde..." : "Sauvegarder"}
            </button>
          </div>
        </div>
      </div>
      
      {/* Section d'information avec meilleur contraste */}
      <div className="mt-8 p-6 bg-blue-100 border-2 border-blue-400 rounded-lg">
        <h3 className="text-lg font-bold text-blue-900 mb-3">💡 Informations importantes</h3>
        <p className="text-blue-800 font-medium">
          Pour Gmail, utilisez le port 587 avec TLS et un mot de passe d&apos;application.
          Assurez-vous que l&apos;expéditeur correspond à l&apos;adresse email configurée.
        </p>
      </div>
    </div>
  );
}