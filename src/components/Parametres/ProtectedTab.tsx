"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
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
      const { data: { user } } = await supabase.auth.getUser();
      const userRole = user?.app_metadata?.role || user?.user_metadata?.role || 'user';
      
      console.log('User metadata:', {
        app_metadata: user?.app_metadata,
        user_metadata: user?.user_metadata,
        role: userRole
      });
      console.log('Allowed roles:', allowedRoles);
      const normalizedUserRole = userRole?.toString().trim().toLowerCase();
      console.log('Normalized user role:', normalizedUserRole);
      console.log('Normalized allowed roles:', allowedRoles.map(role => role?.toString().trim().toLowerCase()));
      
      // Logique de comparaison plus robuste avec fallback pour différents formats
      let hasAccess = bypassCheck;
      
      if (!hasAccess) {
        hasAccess = allowedRoles.some(role => {
          const normalizedRole = role?.toString().trim().toLowerCase();
          const match = normalizedRole === normalizedUserRole;
          console.log(`Comparing role "${normalizedRole}" with user role "${normalizedUserRole}": ${match}`);
          return match;
        });
      }
      
      // Fallback: vérifier si le rôle utilisateur contient "admin" (pour gérer différents formats)
      if (!hasAccess && normalizedUserRole?.includes('admin')) {
        console.log('Fallback: User role contains "admin", granting access');
        hasAccess = true;
      }
      
      if (hasAccess) {
        console.log('Access granted for role:', userRole);
        setAccessGranted(true);
      } else {
        console.warn('Access denied for role:', userRole, '- Expected one of:', allowedRoles);
        router.replace('/dashboard');
      }
      setLoading(false);
    };
    checkAccess();
  }, [allowedRoles, router, bypassCheck]);

  if (loading) {
    return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  }

  if (!accessGranted) {
    return <div className="p-8 text-center text-gray-500">
      Vous n'avez pas les permissions nécessaires
    </div>;
  }

  return children;
}