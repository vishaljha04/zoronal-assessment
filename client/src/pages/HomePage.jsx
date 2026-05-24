import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, Filter, MapPin, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { companyService } from '../services/companyService';
import { useDebounce } from '../hooks/useDebounce';
import CompanyCard from '../components/cards/CompanyCard';
import { ITEMS_PER_PAGE } from '../constants';
import Modal from '../components/ui/Modal';
import AddCompanyForm from '../components/forms/CompanyForm';
import { useAuth } from '../context/auth.jsx';

const SkeletonCard = () => (
  <div className="border border-border rounded-lg p-4 sm:p-5 animate-pulse bg-white shadow-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
      <div className="w-16 h-16 sm:w-[76px] sm:h-[64px] bg-border rounded-md shrink-0" />
      <div className="flex-1 space-y-2 w-full">
        <div className="h-4 bg-border rounded w-3/5 sm:w-2/5" />
        <div className="h-3 bg-border rounded w-4/5 sm:w-3/4" />
        <div className="h-3 bg-border rounded w-2/5 sm:w-1/4" />
      </div>
      <div className="w-full sm:w-[110px] h-8 bg-border rounded" />
    </div>
  </div>
);

const HomeFilters = ({
  cityFilter,
  onCityChange,
  sortBy,
  onSortChange,
  onAddCompany,
  showMobileFilters,
  onToggleMobileFilters,
}) => {
  return (
    <div className="mt-6 border-t border-border pt-6">
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button
          type="button"
          onClick={onToggleMobileFilters}
          className="inline-flex items-center gap-2 text-sm font-medium text-text-h border border-border px-4 py-2 rounded-md hover:bg-gray-50"
        >
          <Filter size={16} />
          Filters
        </button>

        <button
          type="button"
          onClick={onAddCompany}
          className="h-10 px-4 rounded-md text-white text-sm font-semibold shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      <div className="hidden lg:flex items-end gap-4 flex-wrap">
        <div className="min-w-[260px] flex-1">
          <label htmlFor="city-filter" className="block text-[11px] text-text mb-2">
            Select City
          </label>
          <div className="relative">
            <input
              id="city-filter"
              value={cityFilter}
              onChange={onCityChange}
              placeholder="Indore, Madhya Pradesh, India"
              className="w-full h-10 pl-3 pr-10 rounded-md border border-border text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
            />
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
          </div>
        </div>

        <button
          type="button"
          className="h-10 px-6 rounded-md text-white text-sm font-semibold shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow whitespace-nowrap"
        >
          Find Company
        </button>

        <button
          type="button"
          onClick={onAddCompany}
          className="h-10 px-6 rounded-md text-white text-sm font-semibold shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow whitespace-nowrap inline-flex items-center gap-2"
        >
          <Plus size={16} />
          Add Company
        </button>

        <div className="w-[190px]">
          <label htmlFor="sort-select" className="block text-[11px] text-text mb-2">
            Sort by:
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={onSortChange}
              className="w-full h-10 px-3 pr-9 rounded-md border border-border text-sm outline-none appearance-none bg-white focus:ring-2 focus:ring-accent/20"
            >
              <option value="name-az">Name (A-Z)</option>
              <option value="newest">Date (Newest)</option>
              <option value="highest-rated">Rating</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text pointer-events-none" />
          </div>
        </div>
      </div>

      {showMobileFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          <div className="sm:col-span-2">
            <label htmlFor="city-filter-m" className="block text-[11px] text-text mb-2">
              Select City
            </label>
            <div className="relative">
              <input
                id="city-filter-m"
                value={cityFilter}
                onChange={onCityChange}
                placeholder="Indore, Madhya Pradesh, India"
                className="w-full h-10 pl-3 pr-10 rounded-md border border-border text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
              />
              <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-1">
            <label htmlFor="sort-select-m" className="block text-[11px] text-text mb-2">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select-m"
                value={sortBy}
                onChange={onSortChange}
                className="w-full h-10 px-3 pr-9 rounded-md border border-border text-sm outline-none appearance-none bg-white focus:ring-2 focus:ring-accent/20"
              >
                <option value="name-az">Name (A-Z)</option>
                <option value="newest">Date (Newest)</option>
                <option value="highest-rated">Rating</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text pointer-events-none" />
            </div>
          </div>

          <div className="sm:col-span-1 flex items-end">
            <button
              type="button"
              className="w-full h-10 px-6 rounded-md text-white text-sm font-semibold shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow"
            >
              Find Company
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const HomePage = () => {
  const [params] = useSearchParams();
  const searchTerm = params.get('q') || '';
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name-az');
  const [page, setPage] = useState(1);
  const [isAddCompanyOpen, setIsAddCompanyOpen] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const onCityChange = (e) => {
    setCityFilter(e.target.value);
    setPage(1);
  };

  const onSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  const onAddCompany = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add a company');
      navigate(`/login?returnTo=${encodeURIComponent('/')}`);
      return;
    }
    setIsAddCompanyOpen(true);
  };

  const onPageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 80, behavior: 'smooth' });
  };

  return (
    <div className="pt-6 sm:pt-8 pb-8">
      <div className="text-[22px] text-[#8b8b8b]">Home</div>

      <HomeFilters
        cityFilter={cityFilter}
        onCityChange={onCityChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onAddCompany={onAddCompany}
        showMobileFilters={showMobileFilters}
        onToggleMobileFilters={() => setShowMobileFilters((v) => !v)}
      />

      {error && (
        <div className="text-center py-10 px-4 text-red-600 border border-red-200 rounded-lg mt-6 bg-red-50">
          <p className="mb-2">Failed to load companies.</p>
          <button onClick={() => refetch()} className="text-sm underline hover:no-underline">
            Try Again
          </button>
        </div>
      )}

      {isLoading ? (
        <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-16 sm:py-20 border border-dashed border-border rounded-2xl sm:rounded-3xl mt-8 sm:mt-10 px-4">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-text-h">No companies found</h3>
          <p className="text-sm sm:text-base text-text mb-6">
            {debouncedSearch || debouncedCity ? 'Try adjusting your filters or search terms.' : 'Be the first to add a company!'}
          </p>
          <button
            type="button"
            onClick={onAddCompany}
            className="h-10 px-6 rounded-md text-white text-sm font-semibold shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Add Company
          </button>
        </div>
      ) : (
        <>
          <div className="mt-8 sm:mt-10 text-[11px] text-[#9b9b9b] mb-3">
            {totalFound} {totalFound === 1 ? 'Result' : 'Results'} Found
          </div>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {page > 1 && (
                <button
                  type="button"
                  onClick={() => onPageChange(page - 1)}
                  className="w-10 h-10 rounded-md text-sm font-medium border border-border hover:bg-gray-50 text-text-h transition-colors"
                >
                  {'\u2190'}
                </button>
              )}

              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .map((p, index, array) => (
                  <div key={p} className="flex items-center gap-2">
                    {index > 0 && array[index - 1] !== p - 1 && <span className="text-text-h px-2">...</span>}
                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`w-10 h-10 rounded-md text-sm font-medium transition-all ${
                        p === page ? 'bg-black text-white shadow-md' : 'border border-border hover:bg-gray-50 text-text-h'
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))}

              {page < pagination.pages && (
                <button
                  type="button"
                  onClick={() => onPageChange(page + 1)}
                  className="w-10 h-10 rounded-md text-sm font-medium border border-border hover:bg-gray-50 text-text-h transition-colors"
                >
                  {'\u2192'}
                </button>
              )}
            </div>
          )}
        </>
      )}

      <Modal isOpen={isAddCompanyOpen} onClose={() => setIsAddCompanyOpen(false)} title="Add Company" size="md">
        <AddCompanyForm
          onSuccess={() => {
            setIsAddCompanyOpen(false);
            refetch();
          }}
          onClose={() => setIsAddCompanyOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default HomePage;

