"use client";
import { useState } from "react";

export default function NotificationsTab() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">🔔 Paramètres de notifications</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Notifications système</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Nouvelles tâches</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Tâches en retard</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Rapports hebdomadaires</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" />
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-gray-700">Canaux de notification</h3>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">SMS</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" />
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
            <label className="text-sm font-medium text-gray-700">Push notifications</label>
            <input type="checkbox" className="h-5 w-5 text-orange-600 rounded border-gray-300" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  );
}