// Login Page Component (no bypass)
export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, password })
      });

      if (!res.ok) {
        const msg = (await res.text()) || 'Invalid credentials';
        throw new Error(msg);
      }

      const data = await res.json(); // expect { token, user: { id, name, email, jurisdiction? } }
      localStorage.setItem('token', data.token);

      const userData = {
        id: data.user?.id,
        name: data.user?.name || email.split('@')[0],
        email: data.user?.email || email,
        jurisdiction: data.user?.jurisdiction || 'California, USA',
        token: data.token
      };

      onLogin?.(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Sign in to NextEra Estate</h2>
          <p className="mt-2 text-gray-600 text-sm">Enter your email and password to continue</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded p-3">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <Link to="/register" className="text-indigo-600 hover:text-indigo-500 text-sm">
            Don’t have an account? Create one
          </Link>
        </div>
      </div>
    </div>
  );
};
