import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

const OAuthSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setOAuthUser, clearError } = useAuthStore();
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleOAuth = async () => {
      try {
        console.log('OAuthSuccess query params:', searchParams.toString());
        const token = searchParams.get('token');
        const name = searchParams.get('name');
        const email = searchParams.get('email');

        if (!token || !name || !email) {
          throw new Error('Missing OAuth parameters');
        }

        console.log('Setting OAuth user with token:', token.substring(0, 20) + '...');
        setOAuthUser({ user: { name, email }, token });

        console.log('Redirecting to /dashboard');
        navigate('/dashboard', { replace: true });
      } catch (err) {
        console.error('OAuth error:', err.message);
        clearError();
        useAuthStore.getState().setError('OAuth authentication failed');
        console.log('Redirecting to /');
        navigate('/login?error=missing_params', { replace: true });
      }
    };

    handleOAuth();
  }, [navigate, searchParams, setOAuthUser, clearError]);

  // if (loading) {
  //   return (
  //     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-gray-300">
  //       <div className="text-lg text-black">Processing Google login...</div>
  //     </div>
  //   );
  // }

  return null;
};

export default OAuthSuccess;