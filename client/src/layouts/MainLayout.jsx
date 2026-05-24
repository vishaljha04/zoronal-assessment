import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.svg';
import { useAuth } from '../context/auth.jsx';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const onSearchChange = (e) => {
    const next = e.target.value;
    const nextParams = new URLSearchParams(params);
    if (next) nextParams.set('q', next);
    else nextParams.delete('q');
    setParams(nextParams, { replace: true });
    if (location.pathname !== '/') {
      navigate({ pathname: '/', search: nextParams.toString() }, { replace: false });
    }
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b border-border bg-white sticky top-0 z-40">
      <div className="max-w-full mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img src={logo} alt="Review & Rate" className="h-6 sm:h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="relative">
              <input
                value={q}
                onChange={onSearchChange}
                placeholder="Search..."
                className="w-[260px] pl-4 pr-10 py-2.5 rounded-md border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
              />
              <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
            </div>

            {isAuthenticated ? (
              <>
                <div className="text-sm text-text-h font-medium">{user?.name}</div>
                <button
                  type="button"
                  onClick={logout}
                  className="text-sm text-text-h hover:text-accent transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink 
                  to="/signup" 
                  className={({ isActive }) => 
                    `text-sm transition-colors ${isActive ? 'text-accent' : 'text-text-h hover:text-accent'}`
                  }
                >
                  SignUp
                </NavLink>
                <NavLink 
                  to="/login" 
                  className={({ isActive }) => 
                    `text-sm transition-colors ${isActive ? 'text-accent' : 'text-text-h hover:text-accent'}`
                  }
                >
                  Login
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-h hover:text-accent transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Search Bar (always visible on mobile) */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <input
              value={q}
              onChange={onSearchChange}
              placeholder="Search..."
              className="w-full pl-4 pr-10 py-2.5 rounded-md border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
            />
            <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-2 text-sm text-text-h font-medium">
                  {user?.name}
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-text-h hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/signup"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm transition-colors ${
                      isActive ? 'text-accent bg-gray-50' : 'text-text-h hover:bg-gray-50'
                    }`
                  }
                >
                  SignUp
                </NavLink>
                <NavLink
                  to="/login"
                  onClick={closeMobileMenu}
                  className={({ isActive }) =>
                    `block px-4 py-2 text-sm transition-colors ${
                      isActive ? 'text-accent bg-gray-50' : 'text-text-h hover:bg-gray-50'
                    }`
                  }
                >
                  Login
                </NavLink>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[var(--page-bg)]">
      <div className="max-w-[1126px] mx-auto min-h-screen bg-white shadow-[0_0_24px_rgba(0,0,0,0.08)]">
        <Navbar />
        <main className="px-4 sm:px-6 py-6 sm:py-8 pb-12 sm:pb-16">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;