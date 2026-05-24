import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth.jsx';

const schema = z.object({
  name: z.string().min(2, 'Enter your name').max(60),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Minimum 6 characters'),
});

const SignupPage = () => {
  const { register: signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = new URLSearchParams(location.search).get('returnTo') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema), defaultValues: { name: '', email: '', password: '' } });

  const onSubmit = async (values) => {
    try {
      await signup(values);
      toast.success('Account created');
      navigate(returnTo, { replace: true });
    } catch (e) {
      toast.error(e.message || 'Signup failed');
    }
  };

  return (
    <div className="pt-14">
      <div className="max-w-md mx-auto bg-white border border-border rounded-md shadow-[0_10px_22px_rgba(0,0,0,0.08)] p-8">
        <div className="text-center">
          <div className="text-xl font-semibold text-text-h">Sign Up</div>
          <div className="mt-2 text-sm text-[#8f8f8f]">Create your account</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-4">
          <div>
            <label className="block text-[11px] text-[#9b9b9b] mb-2">Name</label>
            <input
              {...register('name')}
              className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
              placeholder="Enter..."
            />
            {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name.message}</div>}
          </div>

          <div>
            <label className="block text-[11px] text-[#9b9b9b] mb-2">Email</label>
            <input
              {...register('email')}
              className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
              placeholder="Enter..."
            />
            {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email.message}</div>}
          </div>

          <div>
            <label className="block text-[11px] text-[#9b9b9b] mb-2">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
              placeholder="Enter..."
            />
            {errors.password && <div className="text-xs text-red-500 mt-1">{errors.password.message}</div>}
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-9 w-[120px] rounded-md text-white text-sm font-medium shadow-sm disabled:opacity-70 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
            >
              {isSubmitting ? 'Please wait...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-[#8f8f8f]">
          Already have an account?{' '}
          <Link to={`/login?returnTo=${encodeURIComponent(returnTo)}`} className="text-accent">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

