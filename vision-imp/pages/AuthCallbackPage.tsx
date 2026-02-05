import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/icons/Logo';
import { useAuth } from '../contexts/AuthContext';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { session, loading } = useAuth();

    useEffect(() => {
        // This effect replaces the previous unreliable timer.
        // It waits for the AuthProvider to finish processing the session from the URL.
        if (!loading) {
            if (session) {
                // If a session is successfully established, redirect to the main app.
                navigate('/chat-studio', { replace: true });
            } else {
                // If there's no session after the callback (e.g., an error occurred),
                // send the user back to the sign-in page.
                navigate('/signin', { replace: true });
            }
        }
    }, [session, loading, navigate]);

    // The UI remains the same, showing a loading state while Supabase processes the callback.
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-default-bg-secondary to-default-accent-peach/50 dark:from-space-bg-secondary dark:to-space-accent-purple/20">
            <Logo className="h-24 w-24 text-default-accent-gold animate-pulse-gentle" />
            <div className="mt-8 flex items-center gap-4">
                 <div className="w-8 h-8 border-4 border-t-default-accent-gold dark:border-t-space-accent-cyan border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
                <p className="text-2xl font-medium">Signing you in...</p>
            </div>
            <p className="mt-2 text-default-text-secondary dark:text-space-text-secondary">Please wait a moment.</p>
        </div>
    );
};

export default AuthCallbackPage;