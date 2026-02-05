import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '../types';
import type { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password:string) => Promise<{ data: any, error: AuthError | null }>;
  signUp: (name: string, email: string, password: string) => Promise<{ data: any, error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  updateUser: (data: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session on initial load
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({
            uid: session.user.id,
            email: session.user.email!,
            name: profile.name,
            avatarId: profile.avatarId,
          });
        }
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for changes in authentication state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      
      if (session?.user) {
        // A user is logged in. Check if they have a profile.
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          // Profile exists, update the user state.
          setUser({
            uid: session.user.id,
            email: session.user.email!,
            name: profile.name,
            avatarId: profile.avatarId,
          });
        } else {
          // Profile does not exist, create one. This is crucial for new sign-ups, especially via OAuth.
          const newName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Vision User';
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert({ id: session.user.id, name: newName, email: session.user.email, avatarId: Math.floor(Math.random() * 6) + 1 })
            .select()
            .single();

          if (insertError) {
            console.error("Failed to create user profile:", insertError);
            setUser(null);
          } else if (newProfile) {
            setUser({
              uid: newProfile.id,
              email: newProfile.email,
              name: newProfile.name,
              avatarId: newProfile.avatarId,
            });
          }
        }
      } else {
        // User is signed out.
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // --- Auth Actions ---

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return { data, error };
  };

  const signUp = async (name: string, email: string, password: string) => {
    setLoading(true);
    // Sign up the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ 
      email, 
      password 
    });

    if (authError) {
      setLoading(false);
      return { data: null, error: authError };
    }

    // If auth is successful, create a corresponding profile in the 'profiles' table.
    // The onAuthStateChange listener will handle setting the user state.
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: authData.user.id, name, email, avatarId: Math.floor(Math.random() * 6) + 1 });
      
      if (profileError) {
        // This is a critical failure. The auth user was created, but the profile wasn't.
        // We'll return the error so the UI can display it. The robust onAuthStateChange might fix this later.
        console.error("Failed to create user profile during sign-up:", profileError);
      }
    }
    
    setLoading(false);
    return { data: authData, error: authError };
  };
  
  const signInWithGoogle = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}#/auth/callback`,
      },
    });
    if (error) {
      setLoading(false);
    }
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const updateUser = async (data: Partial<User>) => {
    if (!user) return;
    
    const profileUpdate: { name?: string; avatarId?: number } = {};
    if (data.name) profileUpdate.name = data.name;
    if (data.avatarId) profileUpdate.avatarId = data.avatarId;

    if (Object.keys(profileUpdate).length > 0) {
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdate)
        .eq('id', user.uid);

      if (error) {
        console.error('Error updating user profile:', error);
      } else {
        setUser(prev => prev ? { ...prev, ...data } : null);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, updateUser, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};