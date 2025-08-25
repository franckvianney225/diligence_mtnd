"use client";
import { useState } from "react";

export default function SauvegardeTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">💾 Sauvegarde automatique</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
              <label className="text-sm font-medium text-gray-700">Sauvegarde automatique</label>
              <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors">
                <option>Quotidienne</option>
                <option>Hebdomadaire</option>
                <option>Mensuelle</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Heure de sauvegarde</label>
              <input type="time" defaultValue="02:00" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stockage</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors">
                <option>Serveur local</option>
                <option>Cloud Storage</option>
                <option>Serveur externe</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rétention (jours)</label>
              <input type="number" defaultValue="30" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" />
            </div>
            <button className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Créer une sauvegarde maintenant
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">📋 Historique des sauvegardes</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div>
              <span className="font-medium text-gray-800">Sauvegarde_2025_01_15.sql</span>
              <p className="text-sm text-gray-500">Base de données complète</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">2.3 GB</span>
              <button className="text-green-600 hover:text-green-800 transition-colors">⬇️</button>
              <button className="text-red-600 hover:text-red-800 transition-colors">🗑️</button>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de danger */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-6 text-red-700">⚠️ Zone de danger</h2>
        <div className="space-y-4">
          <p className="text-red-600 mb-4">Les actions suivantes sont irréversibles. Procédez avec prudence.</p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Exporter toutes les données
            </button>
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Réinitialiser les paramètres
            </button>
            <button className="bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Supprimer toutes les données
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}