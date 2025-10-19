import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      console.error('Login failed:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (error) clearError();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30 relative">
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-tr from-blue-400/20 via-transparent to-blue-400/20 pointer-events-none"></div>
        <h2 className="text-2xl font-bold text-black text-center mb-2 relative z-10">
          Welcome back
        </h2>
        <p className="text-gray-600 text-center mb-6 relative z-10">
          Sign in to your account
        </p>
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center relative z-10 flex items-center justify-center">
            {error}
            <button
              type="button"
              onClick={clearError}
              className="ml-2 text-sm text-blue-500 hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleInputChange}
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleInputChange}
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 hover:scale-[1.01] transition disabled:opacity-60"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="flex items-center my-6 relative z-10">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
    
        <p className="mt-6 text-center text-sm text-black relative z-10">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;