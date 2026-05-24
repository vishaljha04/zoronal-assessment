import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, MapPin } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { useDebounce } from '../hooks/useDebounce';
import CompanyCard from '../components/cards/CompanyCard';
import { ITEMS_PER_PAGE } from '../constants';
import Modal from '../components/ui/Modal';
import AddCompanyForm from '../components/forms/CompanyForm';
import { useAuth } from '../context/auth.jsx';
import toast from 'react-hot-toast';

const HomePage = () => {
  const [params] = useSearchParams();
  const searchTerm = params.get('q') || '';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name-az');
  const [page, setPage] = useState(1);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 350);
  const debouncedCity = useDebounce(cityFilter, 350);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['companies', debouncedSearch, debouncedCity, sortBy, page],
    queryFn: () =>
      companyService.getAll({
        search: debouncedSearch || undefined,
        city: debouncedCity || undefined,
        sort: sortBy,
        page,
        limit: ITEMS_PER_PAGE,
      }),
    keepPreviousData: true,
  });

  const companies = data?.data || [];
  const pagination = data?.pagination;
  const totalFound = useMemo(() => pagination?.total ?? companies.length, [pagination, companies.length]);

  const handleCityChange = (e) => {
    setCityFilter(e.target.value);
    setPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  const SkeletonCard = () => (
    <div className="border border-border rounded-md p-5 animate-pulse bg-white shadow-sm">
      <div className="flex items-center gap-5">
        <div className="w-[76px] h-[64px] bg-border rounded-md" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-border rounded w-2/5" />
          <div className="h-3 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/4" />
        </div>
        <div className="w-[110px] h-8 bg-border rounded" />
      </div>
    </div>
  );

  return (
    <div className="pt-8 pb-8">
      <div className="text-[22px] text-[#8b8b8b]">Home</div>

      <div className="mt-6 border-t border-border pt-6">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          <div className="flex items-end gap-4 flex-1 flex-wrap">
            <div className="min-w-[260px]">
              <div className="text-[11px] text-text mb-2">Select City</div>
              <div className="relative">
                <input
                  value={cityFilter}
                  onChange={handleCityChange}
                  placeholder="Indore, Madhya Pradesh, India"
                  className="w-full h-10 pl-3 pr-10 rounded-md border border-border text-sm outline-none"
                />
                <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent" />
              </div>
            </div>

            <button
              type="button"
              className="h-10 px-5 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
            >
              Find Company
            </button>

            <button
              type="button"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please login to add a company');
                  navigate(`/login?returnTo=${encodeURIComponent('/')}`);
                  return;
                }
                setIsAddCompanyOpen(true);
              }}
              className="h-10 px-5 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
            >
              + Add Company
            </button>
          </div>

          <div className="w-full lg:w-[180px]">
            <div className="text-[11px] text-text mb-2">Sort:</div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full h-10 px-3 pr-8 rounded-md border border-border text-sm outline-none appearance-none bg-white"
              >
                <option value="name-az">Name</option>
                <option value="newest">Date</option>
                <option value="highest-rated">Rating</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="text-center py-12 text-red-500">
          Failed to load companies.{' '}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="mt-10 space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl mt-10">
          <h3 className="text-2xl font-semibold mb-2 text-text-h">No companies found</h3>
          <p className="text-text mb-6">Try adjusting your filters.</p>
          <button
            type="button"
            onClick={() => {
              if (!isAuthenticated) {
                toast.error('Please login to add a company');
                navigate(`/login?returnTo=${encodeURIComponent('/')}`);
                return;
              }
              setIsAddCompanyOpen(true);
            }}
            className="h-10 px-5 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
          >
            + Add Company
          </button>
        </div>
      ) : (
        <>
          <div className="mt-10 text-[11px] text-[#9b9b9b] mb-3">Result Found: {totalFound}</div>

          <div className="space-y-6 mb-10">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-md text-sm font-medium transition ${
                    p === page ? 'bg-black text-white' : 'border border-border hover:bg-gray-50 text-text-h'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      <Modal isOpen={isAddCompanyOpen} onClose={() => setIsAddCompanyOpen(false)} title="Add Company" size="md">
        <AddCompanyForm onSuccess={() => setIsAddCompanyOpen(false)} onClose={() => setIsAddCompanyOpen(false)} />
      </Modal>
    </div>
  );
};

export default HomePage;
