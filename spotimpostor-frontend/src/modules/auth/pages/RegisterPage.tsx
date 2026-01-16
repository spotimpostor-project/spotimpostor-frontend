import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, User, Lock, Eye, EyeOff, ArrowLeft, AlertTriangle } from 'lucide-react';
import api from '../../../configs/api';
import { useGame } from '../../../store';

const RegisterPage: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { dispatch } = useGame();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!nombre || !correo || !password) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/usuarios/auth/register', {
        nombre,
        correo,
        password,
      });

      if (response.data && response.data.data) {
        const token = response.data.data;
        const userName = nombre;

        console.log('User registered successfully:', { userName, token });
        
        localStorage.setItem('token_spot', token);
        localStorage.setItem('user_name', userName);

        dispatch({ type: 'LOGIN_SUCCESS', payload: { token, userName } });

        navigate('/');
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050a0a] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle gradient effect */}
      <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-green-900/50 to-transparent filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-teal-900/50 to-transparent filter blur-3xl opacity-30"></div>

      <div className="w-full max-w-md p-8 space-y-6 bg-[#0d1515] rounded-2xl border border-emerald-800/60 shadow-[0_0_15px_rgba(34,197,94,0.3)] relative">
        
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 h-10 w-10 flex items-center justify-center rounded-full bg-emerald-900/50 hover:bg-emerald-800/70 transition-colors">
            <ArrowLeft className="h-6 w-6" />
        </button>

        <div className="text-center pt-8">
            <h1 className="text-4xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 mt-2">Join the ranks of agents</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="text-sm text-gray-400" htmlFor="codename">Codename</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        id="codename"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-emerald-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />
                </div>
            </div>
            <div>
                <label className="text-sm text-gray-400" htmlFor="email">Email</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="email"
                        id="email"
                        value={correo}
                        onChange={(e) => setCorreo(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-gray-900/50 border border-emerald-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="text-sm text-gray-400" htmlFor="password">Password</label>
                <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
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
                            <EyeOff onClick={() => setShowPassword(false)} className="cursor-pointer h-5 w-5 text-gray-400" />
                        ) : (
                            <Eye onClick={() => setShowPassword(true)} className="cursor-pointer h-5 w-5 text-gray-400" />
                        )}
                    </div>
                </div>
            </div>

            {error && (
                <div className="flex items-center p-3 text-sm text-red-300 bg-red-900/30 border border-red-500/50 rounded-lg">
                    <AlertTriangle className="h-5 w-5 mr-3" />
                    <span>{error}</span>
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-green-500 rounded-full font-bold text-gray-900 transition-all duration-300 hover:bg-green-400 hover:shadow-[0_0_20px_#22c55e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Register'}
            </button>
        </form>

        <div className="text-center text-gray-400">
            Already have an account?{' '}
            <Link to="/auth/login" className="font-semibold text-green-400 hover:text-green-300 transition-colors">
                Log in
            </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;