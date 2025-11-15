import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';

export default function LoginForm({ onSubmit, loading, errors: formErrors }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSubmit(email, password);
  };

  const currentErrors = { ...errors, ...formErrors };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-6 border border-gray-200/50">
      <div className="space-y-2">
        <h2 className="text-3xl font-heading font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600">Enter your credentials to access your dashboard</p>
      </div>

      {currentErrors.submit && (
        <div 
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm animate-shake" 
          role="alert" 
          aria-live="assertive"
        >
          {currentErrors.submit}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail 
                className={`h-5 w-5 transition-colors ${
                  currentErrors.email 
                    ? 'text-red-400' 
                    : 'text-gray-400 group-focus-within:text-primary-500'
                }`} 
              />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                currentErrors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-primary-500'
              }`}
              placeholder="you@example.com"
              aria-invalid={!!currentErrors.email}
              aria-describedby={currentErrors.email ? 'email-error' : undefined}
            />
          </div>
          {currentErrors.email && (
            <p id="email-error" className="text-sm text-red-600 animate-fade-in" role="alert">
              {currentErrors.email}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock 
                className={`h-5 w-5 transition-colors ${
                  currentErrors.password 
                    ? 'text-red-400' 
                    : 'text-gray-400 group-focus-within:text-primary-500'
                }`} 
              />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
              className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all ${
                currentErrors.password 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 hover:border-gray-400 focus:border-primary-500'
              }`}
              placeholder="••••••••"
              aria-invalid={!!currentErrors.password}
              aria-describedby={currentErrors.password ? 'password-error' : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary-600 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <FiEye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {currentErrors.password && (
            <p id="password-error" className="text-sm text-red-600 animate-fade-in" role="alert">
              {currentErrors.password}
            </p>
          )}
        </div>

        {/* Remember Me & Forgot Password */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input 
              id="remember-me" 
              name="remember-me" 
              type="checkbox" 
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer transition-colors" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>
          <Link 
            href="/forgot-password" 
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 text-white font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:scale-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg hover:shadow-xl"
          aria-busy={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <FiArrowRight className="h-5 w-5" />
            </>
          )}
        </button>
      </form>

      {/* Sign Up Link */}
      <div className="pt-6 border-t border-gray-200 text-center">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link 
            href="/register" 
            className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
          >
            Create one now
          </Link>
        </p>
      </div>

      {/* Demo Credentials */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-blue-900 mb-2">Demo Credentials:</p>
        <div className="space-y-1 text-xs text-blue-800">
          <p><strong>Admin:</strong> shashicoeb@gmail.com / Shashi@123</p>
          <p><strong>Mentor:</strong> sarah.johnson@techfield.com / Password123</p>
          <p><strong>Intern:</strong> amit.kumar@example.com / Password123</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
