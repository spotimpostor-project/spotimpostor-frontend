import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../configs/api';
import { useGame } from '../../../store';

// SVG Icons for the form
const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const EyeIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = ({ ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .946-3.013 3.42-5.413 6.458-6.458m3.134-1.12A9.974 9.974 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-2.009 3.568M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
    </svg>
);

const WarningIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { dispatch } = useGame();
  
    const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setError('');
  
      try {
        const response = await api.post('/usuarios/auth/login', {
          correo: email,
          password: password,
        });
  
        if (response.status === 200 && response.data.data) {
          const { token, nombre } = response.data.data;
          localStorage.setItem('token_spot', token);
          localStorage.setItem('user_name', nombre);
          dispatch({ type: 'LOGIN_SUCCESS', payload: { token, userName: nombre } });
          navigate('/');
        }
      } catch (err: any) {
        if (err.response && err.response.data && err.response.data.message) {
          setError(err.response.data.message);
        } else {
            setError('Invalid credentials. Try again.');
        }
      }
    };

    return (
        <div className="min-h-screen bg-[#050a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
            {/* Subtle gradient effect */}
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-900/50 to-transparent filter blur-3xl opacity-30"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-teal-900/50 to-transparent filter blur-3xl opacity-30"></div>

            <div className="w-full max-w-md p-8 space-y-6 bg-[#0d1515] rounded-2xl border border-emerald-800/60 shadow-[0_0_15px_rgba(34,197,94,0.3)] relative">
                
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-900/50 hover:bg-emerald-800/70 transition-colors">
                    <ArrowLeftIcon />
                </button>

                <div className="text-center pt-8">
                    <h1 className="text-4xl font-bold text-white">Log in</h1>
                    <p className="text-gray-400 mt-2">Welcome back, detective</p>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="text-sm text-gray-400" htmlFor="email">Email</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <MailIcon />
                            </div>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-emerald-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-gray-400" htmlFor="password">Password</label>
                        <div className="relative mt-1">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <LockIcon />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-10 py-2.5 bg-gray-900/50 border border-emerald-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                {showPassword ? (
                                    <EyeOffIcon onClick={() => setShowPassword(false)} className="cursor-pointer" />
                                ) : (
                                    <EyeIcon onClick={() => setShowPassword(true)} className="cursor-pointer" />
                                )}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center p-3 text-sm text-red-300 bg-red-900/30 border border-red-500/50 rounded-lg">
                            <WarningIcon />
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full py-3 px-4 bg-green-500 rounded-full font-bold text-gray-900 transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_20px_#22c55e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500"
                    >
                        Log in
                    </button>
                </form>

                <div className="text-center text-gray-400">
                    Don’t have an account?{' '}
                    <Link to="/auth/register" className="font-semibold text-green-400 hover:text-green-300 transition-colors">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;