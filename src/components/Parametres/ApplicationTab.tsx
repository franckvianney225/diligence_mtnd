"use client";
import { useState } from "react";

export default function ApplicationTab() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">⚙️ Paramètres généraux</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'application</label>
            <input type="text" defaultValue="Système de Diligence Gouvernementale" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Langue par défaut</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors">
              <option>Français</option>
              <option>English</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau horaire</label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition-colors">
              <option>UTC+0 (Abidjan, Côte d'Ivoire)</option>
              <option>UTC+1 (Paris, France)</option>
            </select>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Mode maintenance</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">🎨 Apparence</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Mode sombre</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo de l'application</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-300 transition-colors">
              <p className="text-gray-500">Glisser-déposer ou cliquer pour télécharger</p>
              <button className="mt-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Choisir un fichier
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}