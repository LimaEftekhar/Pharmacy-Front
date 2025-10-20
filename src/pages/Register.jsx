import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError, isAuthenticated } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError(); // Clear previous errors before validation
    if (password !== confirmPassword) {
      useAuthStore.getState().setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      useAuthStore.getState().setError('Password must be at least 6 characters long');
      return;
    }
    try {
      console.log('Registering user with:', { name: name.trim(), email: email.trim().toLowerCase() });
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      navigate('/login', { replace: true }); 
    } catch (err) {
      console.error('Register failed:', err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
  };

  // const handleGoogleLogin = () => {
  //   console.log('Initiating Google login'); 
  //   window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/v1/auth/google`;
  // };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300 relative overflow-hidden">
      <div className="absolute -top-16 -left-16 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl"></div>
      <div className="w-full max-w-md bg-white/70 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/30 relative">
        <div className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-tr from-blue-400/20 via-transparent to-blue-400/20 pointer-events-none"></div>
        <h2 className="text-2xl font-bold text-black text-center mb-2 relative z-10">
          Pharmacy Management System
        </h2>
        <p className="text-gray-600 text-center mb-6 relative z-10">
          Create your account
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
            type="text"
            name="name"
            placeholder="Name"
            value={name}
            onChange={handleInputChange}
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
            required
          />
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
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleInputChange}
            className="w-full p-3 rounded-xl bg-white/80 border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] transition"
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 hover:scale-[1.01] transition disabled:opacity-60"
          >
            {isLoading ? 'Creating account...' : 'Start now'}
          </button>
        </form>
        <div className="flex items-center my-6 relative z-10">
          <hr className="flex-grow border-gray-300" />
          <span className="px-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        {/* <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-200 py-3 rounded-xl bg-white/80 hover:bg-gray-100 shadow-sm transition relative z-10"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            className="w-5 h-5"
          />
          Continue with Google
        </button> */}
        <p className="mt-6 text-center text-sm text-black relative z-10">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;