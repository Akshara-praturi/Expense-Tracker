import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { toast } from 'react-hot-toast';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.user ?? null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
}

export async function handleAuthError(error: any) {
  if (
    error?.name === 'AuthApiError' || 
    error?.message?.includes('Invalid Refresh Token') ||
    error?.code === 'refresh_token_not_found' ||
    error?.message?.includes('JWT')
  ) {
    // Clear all auth data
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    
    // Redirect to login with a message
    window.location.href = '/login?error=session_expired';
    
    toast.error('Your session has expired. Please log in again.');
  }
}