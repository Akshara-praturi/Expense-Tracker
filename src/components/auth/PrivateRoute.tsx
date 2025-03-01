import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { handleAuthError } from '../../lib/auth';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const [session, setSession] = React.useState<boolean | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    async function checkSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(!!session);

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          setSession(!!session);
          
          if (!session) {
            navigate('/login');
          }
        });

        return () => subscription.unsubscribe();
      } catch (error) {
        await handleAuthError(error);
        setSession(false);
      }
    }

    checkSession();
  }, [navigate]);

  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return session ? <>{children}</> : <Navigate to="/login" />;
}