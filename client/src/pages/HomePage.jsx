import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, MapPin, Plus, Filter } from 'lucide-react';
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

  const handleAddCompany = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add a company');
      navigate(`/login?returnTo=${encodeURIComponent('/')}`);
      return;
    }
    setIsAddCompanyOpen(true);
  };

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

  const FilterSection = () => (
    <>
      {/* City Filter */}
      <div className="flex-1 min-w-full sm:min-w-[200px] lg:min-w-[260px]">
        <label htmlFor="city-filter" className="block text-[11px] text-text mb-2">
          Select City
        </label>
        <div className="relative">
          <input
            id="city-filter"
            value={cityFilter}
            onChange={handleCityChange}
            placeholder="Indore, Madhya Pradesh, India"
            className="w-full h-10 pl-3 pr-10 rounded-md border border-border text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-shadow"
          />
          <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-accent pointer-events-none" />
        </div>
      </div>

      {/* Find Company Button - Desktop Only */}
      <button
        type="button"
        className="hidden lg:flex h-10 px-5 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow whitespace-nowrap"
      >
        Find Company
      </button>

      {/* Add Company Button */}
      <button
        type="button"
        onClick={handleAddCompany}
        className="h-10 px-5 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow whitespace-nowrap flex items-center gap-2"
      >
        <Plus size={16} />
        <span className="hidden sm:inline">Add Company</span>
        <span className="sm:hidden">Add</span>
      </button>

      {/* Sort Dropdown */}
      <div className="w-full sm:w-auto lg:w-[180px]">
        <label htmlFor="sort-select" className="block text-[11px] text-text mb-2">
          Sort by:
        </label>
        <div className="relative">
          <select
            id="sort-select"
            value={sortBy}
            onChange={handleSortChange}
            className="w-full h-10 px-3 pr-8 rounded-md border border-border text-sm outline-none appearance-none bg-white focus:ring-2 focus:ring-accent/20 transition-shadow"
          >
            <option value="name-az">Name (A-Z)</option>
            <option value="newest">Newest First</option>
            <option value="highest-rated">Highest Rated</option>
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-text pointer-events-none" />
        </div>
      </div>
    </>
  );

  return (
    <div className="pt-6 sm:pt-8 pb-8">
      {/* Page Header */}
      <div className="text-lg sm:text-[22px] text-[#8b8b8b] font-medium">Home</div>

      {/* Filters Section */}
      <div className="mt-4 sm:mt-6 border-t border-border pt-4 sm:pt-6">
        {/* Desktop Filters */}
        <div className="hidden lg:flex items-end gap-4 flex-wrap">
          <FilterSection />
        </div>

        {/* Mobile/Tablet Filters */}
        <div className="lg:hidden space-y-4">
          {/* Mobile Filter Toggle */}
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex items-center gap-2 text-sm text-accent"
          >
            <Filter size={16} />
            {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          {/* Mobile Filter Content */}
          {showMobileFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FilterSection />
            </div>
          )}

          {/* Always visible on mobile if filters are hidden */}
          {!showMobileFilters && (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddCompany}
                className="flex-1 h-10 px-5 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                Add Company
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="text-center py-12 px-4 text-red-500 border border-red-200 rounded-lg mt-6 bg-red-50">
          <p className="mb-2">Failed to load companies.</p>
          <button 
            onClick={() => refetch()} 
            className="text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="mt-8 sm:mt-10 space-y-4 sm:space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 sm:py-20 border border-dashed border-border rounded-2xl sm:rounded-3xl mt-8 sm:mt-10 px-4">
          <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-text-h">
            No companies found
          </h3>
          <p className="text-sm sm:text-base text-text mb-6">
            {debouncedSearch || debouncedCity 
              ? 'Try adjusting your filters or search terms.'
              : 'Be the first to add a company!'}
          </p>
          <button
            type="button"
            onClick={handleAddCompany}
            className="h-10 px-6 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow inline-flex items-center gap-2"
          >
            <Plus size={16} />
            Add Company
          </button>
        </div>
      ) : (
        /* Results */
        <>
          <div className="mt-8 sm:mt-10 text-[11px] text-[#9b9b9b] mb-3">
            {totalFound} {totalFound === 1 ? 'Result' : 'Results'} Found
          </div>

          <div className="space-y-4 sm:space-y-6 mb-8 sm:mb-10">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              {/* Previous Button */}
              {page > 1 && (
                <button
                  onClick={() => handlePageChange(page - 1)}
                  className="w-10 h-10 rounded-md text-sm font-medium border border-border hover:bg-gray-50 text-text-h transition-colors"
                >
                  ←
                </button>
              )}

              {/* Page Numbers */}
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(p => {
                  // Show first page, last page, current page, and adjacent pages
                  return p === 1 || 
                         p === pagination.pages || 
                         Math.abs(p - page) <= 1;
                })
                .map((p, index, array) => (
                  <div key={p} className="flex items-center gap-2">
                    {/* Show ellipsis if there's a gap */}
                    {index > 0 && array[index - 1] !== p - 1 && (
                      <span className="text-text-h px-2">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(p)}
                      className={`w-10 h-10 rounded-md text-sm font-medium transition-all ${
                        p === page 
                          ? 'bg-black text-white shadow-md' 
                          : 'border border-border hover:bg-gray-50 text-text-h'
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))}

              {/* Next Button */}
              {page < pagination.pages && (
                <button
                  onClick={() => handlePageChange(page + 1)}
                  className="w-10 h-10 rounded-md text-sm font-medium border border-border hover:bg-gray-50 text-text-h transition-colors"
                >
                  →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Add Company Modal */}
      <Modal 
        isOpen={isAddCompanyOpen} 
        onClose={() => setIsAddCompanyOpen(false)} 
        title="Add Company" 
        size="md"
      >
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