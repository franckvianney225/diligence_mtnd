"use client";
import { useState } from "react";

export default function SystemeTab() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">🖥️ Informations système</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-orange-50 border border-orange-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Version</h3>
            <p className="text-2xl font-bold text-orange-600">v2.1.0</p>
          </div>
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Utilisateurs actifs</h3>
            <p className="text-2xl font-bold text-green-600">247</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">Uptime</h3>
            <p className="text-2xl font-bold text-blue-600">99.9%</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">🔧 Maintenance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200">
            Nettoyer le cache
          </button>
          <button className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200">
            Optimiser la base de données
          </button>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200">
            Vérifier les mises à jour
          </button>
          <button className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-4 rounded-lg font-medium transition-colors duration-200">
            Générer un rapport système
          </button>
        </div>
      </div>
    </div>
  );
}