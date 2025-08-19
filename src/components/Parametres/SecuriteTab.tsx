"use client";
import { useState } from "react";

export default function SecuriteTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">🔒 Paramètres de sécurité</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">Authentification</h3>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700">Authentification à deux facteurs (2FA)</label>
              <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700">Connexion SSO</label>
              <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée de session (minutes)</label>
              <input type="number" defaultValue="60" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-gray-700">Politique de mot de passe</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longueur minimale</label>
              <input type="number" defaultValue="8" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700">Caractères spéciaux requis</label>
              <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700">Expiration du mot de passe (90 jours)</label>
              <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">🛡️ Journaux de sécurité</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="text-sm text-gray-700">Connexion réussie - mitchell@gouv.ci</span>
            <span className="text-xs text-gray-500">Il y a 5 min</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
            <span className="text-sm text-gray-700">Tentative de connexion échouée - 192.168.1.100</span>
            <span className="text-xs text-gray-500">Il y a 1h</span>
          </div>
        </div>
      </div>
    </div>
  );
}