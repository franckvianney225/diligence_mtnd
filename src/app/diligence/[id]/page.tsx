"use client";
import { useParams } from "next/navigation";
import DetailsDiligence from "@/components/Diligence/DetailsDiligence";
import Sidebar from "@/components/Sidebar";

interface MockDiligence {
  id: string;
  title: string;
  description: string;
  date: string;
  status: "en_cours" | "termine" | "en_attente" | "en_retard";
  directionDestinataire: string;
  destinataire: string;
  echeance: string;
  documents: number;
  commentaires: number;
  priorite: "Haute" | "Moyenne" | "Basse";
  progression: number;
}

const diligences: MockDiligence[] = [
  {
    id: "1",
    title: "Audit financier ministère",
    description: "Audit complet des comptes du ministère pour l'exercice 2024",
    date: "15/01/2025",
    status: "en_cours",
    directionDestinataire: "Ministère des Finances",
    destinataire: "Jean Kouassi",
    echeance: "28/02/2025",
    documents: 12,
    commentaires: 8,
    priorite: "Haute",
    progression: 65
  }
];

export default function DiligenceDetailsPage() {
  const { id } = useParams();
  const diligence = diligences.find(d => d.id === id);

  if (!diligence) {
    return <div>Diligence non trouvée</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="pl-64 p-8 min-h-screen">
        <div className="w-full px-4 space-y-8">
          <DetailsDiligence {...diligence} />
          
          {/* Section supplémentaire */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Documents attachés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: diligence.documents }).map((_, i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-500">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700">Document {i+1}</h3>
                      <p className="text-sm text-gray-500">PDF - {(Math.random() * 2 + 0.5).toFixed(1)} MB</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section commentaires */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200 space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Commentaires ({diligence.commentaires})</h2>
            <div className="space-y-4">
              {Array.from({ length: diligence.commentaires }).map((_, i) => (
                <div key={i} className="border-l-4 border-orange-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-700">Utilisateur {i+1}</h3>
                      <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                    <span className="text-sm text-gray-500">Il y a {i+1} jour(s)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}