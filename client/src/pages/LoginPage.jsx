import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth.jsx';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const { login, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo') || '/';
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Logged in successfully');
      navigate(returnTo, { replace: true });
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Login failed. Please try again.';
      toast.error(message);
    }
  };

  const isLoading = isSubmitting || authLoading;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-text-h mb-2">
            Welcome back
          </h1>
          <p className="text-sm text-[#8f8f8f]">
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border border-border rounded-lg sm:rounded-xl shadow-[0_10px_22px_rgba(0,0,0,0.08)] p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register('email')}
                className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
                }`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span>✕</span> {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`w-full h-10 px-3 pr-10 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
                    errors.password ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
                  }`}
                  placeholder="••••••••"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b9b9b] hover:text-text-h transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
                  <span>✕</span> {errors.password.message}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 rounded-md text-white text-sm font-semibold shadow-sm transition-all duration-200 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white text-[#9b9b9b]">Don't have an account?</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <Link
            to={`/signup${returnTo !== '/' ? `?returnTo=${encodeURIComponent(returnTo)}` : ''}`}
            className="block w-full mt-6 h-10 rounded-md border border-border text-sm font-semibold text-text-h hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Create Account
          </Link>
        </div>

        {/* Footer Text */}
        <p className="text-center text-xs text-[#9b9b9b] mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-accent hover:underline">
            Terms of Service
          </a>
          {' '}and{' '}
          <a href="#" className="text-accent hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;