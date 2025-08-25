"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProtectedTab({
  children,
  allowedRoles = ['admin', 'Administrateur'],
  bypassCheck = false
}: {
  children: React.ReactNode,
  allowedRoles: string[],
  bypassCheck?: boolean
}) {
  const router = useRouter();
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      // Pour l'instant, on accorde l'accès à tous les utilisateurs
      // À remplacer par une vraie vérification d'authentification
      setAccessGranted(true);
      setLoading(false);
    };
    checkAccess();
  }, [allowedRoles, router, bypassCheck]);

  if (loading) {
    return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  }

  if (!accessGranted) {
    return <div className="p-8 text-center text-gray-500">
      Vous n&apos;avez pas les permissions nécessaires
    </div>;
  }

  return children;
}