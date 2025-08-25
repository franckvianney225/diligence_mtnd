"use client";
import { FC } from "react";
import { useRouter } from "next/navigation";

interface DetailsDiligenceProps {
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

const DetailsDiligence: FC<DetailsDiligenceProps> = ({
  id,
  title,
  description,
  date,
  status,
  directionDestinataire,
  destinataire,
  echeance,
  documents,
  commentaires,
  priorite,
  progression,
}) => {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 w-full max-w-none">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600
                   rounded-lg border border-orange-200 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-medium">Retour</span>
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Détails de la diligence</h2>
        <div className="w-[72px]"></div> {/* Espace équivalent au bouton */}
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700">Titre</h3>
          <p className="text-gray-900">{title}</p>
        </div>

        <div>
          <h3 className="font-medium text-gray-700">Description</h3>
          <p className="text-gray-900">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Date</h3>
            <p className="text-gray-900">{date}</p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Statut</h3>
            <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              status === "termine"
                ? "bg-green-100 text-green-800"
                : status === "en_cours"
                  ? "bg-orange-100 text-orange-800"
                  : status === "en_retard"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
            }`}>
              {status === "termine"
                ? "Terminé"
                : status === "en_cours"
                  ? "En cours"
                  : status === "en_retard"
                    ? "En retard"
                    : "En attente"}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Priorité</h3>
            <p className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              priorite === "Haute"
                ? "bg-red-100 text-red-800"
                : priorite === "Moyenne"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800"
            }`}>
              {priorite}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-gray-700">Progression</h3>
            <div className="flex items-center space-x-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progression}%` }}
                ></div>
              </div>
              <span className="text-sm font-medium text-gray-600">{progression}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsDiligence;