import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/icons/Logo';

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12
      s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
      s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
      C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
    <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36
      c-5.222,0-9.617-3.473-11.171-8.169l-6.571,4.819C9.656,39.663,16.318,44,24,44z"></path>
    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571
      c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  </svg>
);

const SignInPage = () => {
  const { signIn, signUp, signInWithGoogle, loading, user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [signupMessage, setSignupMessage] = useState('');

  useEffect(() => {
    // Redirect user to the main app if they are already authenticated.
    if (user) {
      navigate('/chat-studio', { replace: true });
    }
  }, [user, navigate]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSignupMessage('');

    try {
      if (isRegistering) {
        if (!name || !email || !password) throw new Error('Please fill in all fields');
        const { data, error: signUpError } = await signUp(name, email, password);
        if (signUpError) throw signUpError;
        
        // If Supabase requires email confirmation, a session won't be returned immediately.
        // We inform the user to check their email in that case.
        if (data.user && !data.session) {
          setSignupMessage('Registration successful! Please check your email to verify your account.');
          setIsSubmitting(false);
        }
        // If a session is returned, the onAuthStateChange listener will update the user state,
        // and the useEffect hook above will handle the redirect.
      } else {
        if (!email || !password) throw new Error('Please fill in all fields');
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        // On successful sign-in, onAuthStateChange listener will trigger the redirect via useEffect.
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError('');
    setSignupMessage('');
    try {
      const { error: googleError } = await signInWithGoogle();
      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setIsSubmitting(false);
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-bg-secondary to-default-accent-peach/50 dark:from-space-bg-secondary dark:to-space-accent-purple/20 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-md bg-white dark:bg-space-card rounded-3xl shadow-2xl p-8 sm:p-12 text-center"
      >
        <Logo className="h-20 w-20 mx-auto text-default-accent-gold" />
        <h1 className="text-3xl font-bold mt-4">{isRegistering ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="text-default-text-secondary dark:text-space-text-secondary mt-2 mb-8">
          {isRegistering ? 'Join Vision to start creating.' : 'Sign in to your Vision account.'}
        </p>

        {error && (
            <div className="bg-red-500/10 text-red-500 text-sm font-semibold p-3 rounded-lg mb-6 text-center">
                ⚠️ {error}
            </div>
        )}
        {signupMessage && (
          <div className="bg-green-500/10 text-green-600 text-sm font-semibold p-3 rounded-lg mb-6 text-center">
              ✅ {signupMessage}
          </div>
        )}
        
        <motion.button 
          onClick={handleGoogleSignIn}
          disabled={isLoading} 
          whileHover={{ y: isLoading ? 0 : -2 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
          className="w-full h-14 mb-4 rounded-full bg-white dark:bg-space-bg-primary border border-default-border dark:border-space-border text-default-text-primary dark:text-space-text-primary font-semibold flex items-center justify-center gap-3 transition-all"
        >
          {isLoading ? (
             <div className="w-6 h-6 border-2 border-default-accent-gold border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <GoogleIcon /> Continue with Google
            </>
          )}
        </motion.button>
        
        <div className="flex items-center my-4">
            <hr className="flex-grow border-default-border dark:border-space-border"/>
            <span className="mx-4 text-xs font-bold text-default-text-secondary uppercase">OR</span>
            <hr className="flex-grow border-default-border dark:border-space-border"/>
        </div>

        <form onSubmit={handleEmailSubmit} className="text-left space-y-4">
            {isRegistering && (
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your Name" 
                        required
                        disabled={isLoading}
                        className="w-full mt-1 h-12 px-6 rounded-full bg-default-bg-secondary dark:bg-space-bg-primary border border-default-border dark:border-space-border focus:ring-2 focus:ring-default-accent-gold outline-none transition" />
                </div>
            )}
            <div>
                <label className="text-sm font-medium">Email Address</label>
                <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com" 
                    required
                    disabled={isLoading}
                    className="w-full mt-1 h-12 px-6 rounded-full bg-default-bg-secondary dark:bg-space-bg-primary border border-default-border dark:border-space-border focus:ring-2 focus:ring-default-accent-gold outline-none transition" />
            </div>
            <div>
                <label className="text-sm font-medium">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password" 
                    required
                    disabled={isLoading}
                    className="w-full mt-1 h-12 px-6 rounded-full bg-default-bg-secondary dark:bg-space-bg-primary border border-default-border dark:border-space-border focus:ring-2 focus:ring-default-accent-gold outline-none transition" />
            </div>
            
            <motion.button 
              type="submit" 
              disabled={isLoading} 
              whileHover={{ y: isLoading ? 0 : -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              className="w-full h-14 rounded-full bg-default-accent-gold text-white font-semibold flex items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (isRegistering ? 'Create Account' : 'Sign In')}
            </motion.button>
        </form>

        <div className="mt-6 text-sm">
            <button onClick={() => { setIsRegistering(!isRegistering); setError(''); setSignupMessage(''); }} className="font-semibold text-default-accent-gold hover:underline">
                {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
            </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SignInPage;