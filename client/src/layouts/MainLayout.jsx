import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/auth.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { user, isAuthenticated, logout } = useAuth();

  const onSearchChange = (e) => {
    const next = e.target.value;
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set('q', next);
    else nextParams.delete('q');
    setParams(nextParams, { replace: true });
    if (location.pathname !== '/') navigate({ pathname: '/', search: nextParams.toString() }, { replace: false });
  };

  return (
    <nav className="border-b border-border bg-white sticky top-0 z-40">
      <div className="max-w-[1126px] mx-auto px-6 flex items-center justify-between h-[72px]">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Review & Rate" className="h-8 w-auto" />
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input
              value={q}
              onChange={onSearchChange}
              placeholder="Search..."
              className="w-[260px] pl-4 pr-10 py-2.5 rounded-md border border-border bg-white text-sm outline-none"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
          </div>

          {isAuthenticated ? (
            <>
              <div className="text-sm text-text-h">{user?.name}</div>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-text-h hover:text-accent"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signup" className="text-sm text-text-h hover:text-accent">SignUp</NavLink>
              <NavLink to="/login" className="text-sm text-text-h hover:text-accent">Login</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <div className="max-w-[1126px] mx-auto min-h-screen bg-white shadow-[0_0_24px_rgba(0,0,0,0.08)]">
        <Navbar />
        <main className="px-6 pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
