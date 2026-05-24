import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-[1126px] mx-auto px-6 flex items-center justify-between h-20">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-accent flex items-center justify-center">
            <span className="text-white font-bold text-2xl tracking-tighter">R</span>
          </div>
          <div>
            <div className="font-semibold text-2xl tracking-tight text-text-h">Reviewly</div>
            <div className="text-[10px] text-text -mt-1.5">Company Reviews</div>
          </div>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `px-4 py-2 rounded-xl font-medium transition ${isActive ? 'bg-accent-bg text-accent' : 'text-text-h hover:bg-accent-bg'}`
            }
          >
            Discover
          </NavLink>

          <button
            onClick={() => navigate('/companies/new')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-accent text-white font-medium hover:bg-[#9a2ee6] active:scale-[0.985] transition text-sm"
          >
            <Plus size={18} />
            Add Company
          </button>
        </div>
      </div>
    </nav>
  );
};

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 px-6 pb-16">
        {children}
      </main>
      <footer className="border-t border-border py-6 text-center text-xs text-text">
        Built with ❤️ using MERN • Premium company review platform
      </footer>
    </div>
  );
};

export default MainLayout;
