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
  <div className="border border-border rounded-2xl p-5 animate-pulse bg-white shadow-sm">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
      <div className="w-16 h-16 sm:w-[76px] sm:h-[64px] bg-gray-200 rounded-xl shrink-0" />

      <div className="flex-1 w-full space-y-3">
        <div className="h-4 bg-gray-200 rounded-md w-2/5" />
        <div className="h-3 bg-gray-200 rounded-md w-4/5" />
        <div className="h-3 bg-gray-200 rounded-md w-1/4" />
      </div>

      <div className="w-full sm:w-[110px] h-10 bg-gray-200 rounded-lg" />
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
    <div className="mt-8 border-t border-border pt-6">
      {/* MOBILE */}
      <div className="flex items-center justify-between gap-3 mb-5 lg:hidden">
        <button
          type="button"
          onClick={onToggleMobileFilters}
          className="h-10 px-4 rounded-lg border border-border text-sm font-medium text-text-h inline-flex items-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <Filter size={16} />
          Filters
        </button>

        <button
          type="button"
          onClick={onAddCompany}
          className="h-10 px-4 rounded-lg bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
        >
          <Plus size={16} />
          Add
        </button>
      </div>

      {/* DESKTOP */}
      <div className="hidden lg:flex items-end gap-4 w-full flex-wrap">
        {/* CITY */}
        <div className="flex-1 min-w-[280px]">
          <label
            htmlFor="city-filter"
            className="block text-[11px] font-medium text-text mb-2"
          >
            Select City
          </label>

          <div className="relative">
            <input
              id="city-filter"
              value={cityFilter}
              onChange={onCityChange}
              placeholder="Indore, Madhya Pradesh, India"
              className="w-full h-11 pl-4 pr-10 rounded-xl border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20 transition-all"
            />

            <MapPin
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-accent"
            />
          </div>
        </div>

        {/* FIND BUTTON */}
        <button
          type="button"
          className="h-11 min-w-[150px] px-6 rounded-xl bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-sm font-semibold inline-flex items-center justify-center shadow-sm hover:shadow-md transition-all whitespace-nowrap"
        >
          Find Company
        </button>

        {/* ADD BUTTON */}
        <button
          type="button"
          onClick={onAddCompany}
          className="h-11 min-w-[170px] px-6 rounded-xl bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
        >
          <Plus size={16} />
          Add Company
        </button>

        {/* SORT */}
        <div className="w-[220px]">
          <label
            htmlFor="sort-select"
            className="block text-[11px] font-medium text-text mb-2"
          >
            Sort by
          </label>

          <div className="relative">
            <select
              id="sort-select"
              value={sortBy}
              onChange={onSortChange}
              className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-white text-sm outline-none appearance-none focus:ring-2 focus:ring-accent/20 transition-all"
            >
              <option value="name-az">Name (A-Z)</option>
              <option value="newest">Newest</option>
              <option value="highest-rated">Highest Rated</option>
            </select>

            <ChevronDown
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* MOBILE FILTERS */}
      {showMobileFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 lg:hidden">
          <div className="sm:col-span-2">
            <label
              htmlFor="city-filter-mobile"
              className="block text-[11px] font-medium text-text mb-2"
            >
              Select City
            </label>

            <div className="relative">
              <input
                id="city-filter-mobile"
                value={cityFilter}
                onChange={onCityChange}
                placeholder="Indore, Madhya Pradesh, India"
                className="w-full h-11 pl-4 pr-10 rounded-xl border border-border bg-white text-sm outline-none focus:ring-2 focus:ring-accent/20"
              />

              <MapPin
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-accent"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="sort-select-mobile"
              className="block text-[11px] font-medium text-text mb-2"
            >
              Sort by
            </label>

            <div className="relative">
              <select
                id="sort-select-mobile"
                value={sortBy}
                onChange={onSortChange}
                className="w-full h-11 px-4 pr-10 rounded-xl border border-border bg-white text-sm outline-none appearance-none focus:ring-2 focus:ring-accent/20"
              >
                <option value="name-az">Name (A-Z)</option>
                <option value="newest">Newest</option>
                <option value="highest-rated">Highest Rated</option>
              </select>

              <ChevronDown
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text"
              />
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="button"
              className="w-full h-11 rounded-xl bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-sm font-semibold shadow-sm hover:shadow-md transition-all"
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

  const totalFound = useMemo(
    () => pagination?.total ?? companies.length,
    [pagination, companies.length]
  );

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

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="max-w-[1126px] mx-auto px-4 pt-6 sm:pt-8 pb-10">
      {/* HEADER */}
      <div className="mb-2">
        <h1 className="text-2xl sm:text-[28px] font-semibold text-text-h">
          Home
        </h1>

        <p className="text-sm text-text mt-1">
          Discover and review top companies.
        </p>
      </div>

      {/* FILTERS */}
      <HomeFilters
        cityFilter={cityFilter}
        onCityChange={onCityChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onAddCompany={onAddCompany}
        showMobileFilters={showMobileFilters}
        onToggleMobileFilters={() =>
          setShowMobileFilters((prev) => !prev)
        }
      />

      {/* ERROR */}
      {error && (
        <div className="mt-8 border border-red-200 bg-red-50 text-red-600 rounded-2xl px-5 py-8 text-center">
          <p className="mb-3 font-medium">
            Failed to load companies.
          </p>

          <button
            onClick={() => refetch()}
            className="text-sm underline hover:no-underline"
          >
            Try Again
          </button>
        </div>
      )}

      {/* LOADING */}
      {isLoading ? (
        <div className="mt-8 space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : companies.length === 0 ? (
        /* EMPTY STATE */
        <div className="mt-8 border border-dashed border-border rounded-3xl py-16 px-5 text-center">
          <h3 className="text-2xl font-semibold text-text-h mb-2">
            No companies found
          </h3>

          <p className="text-text mb-6">
            {debouncedSearch || debouncedCity
              ? 'Try adjusting your filters or search terms.'
              : 'Be the first to add a company!'}
          </p>

          <button
            type="button"
            onClick={onAddCompany}
            className="h-11 px-6 rounded-xl bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all"
          >
            <Plus size={16} />
            Add Company
          </button>
        </div>
      ) : (
        <>
          {/* RESULTS */}
          <div className="mt-7 mb-4 text-sm text-[#8b8b8b]">
            {totalFound} {totalFound === 1 ? 'Result' : 'Results'} Found
          </div>

          {/* COMPANY LIST */}
          <div className="space-y-5">
            {companies.map((company) => (
              <CompanyCard
                key={company._id}
                company={company}
              />
            ))}
          </div>

          {/* PAGINATION */}
          {pagination && pagination.pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2 flex-wrap">
              {/* PREV */}
              {page > 1 && (
                <button
                  type="button"
                  onClick={() => onPageChange(page - 1)}
                  className="w-10 h-10 rounded-xl border border-border bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  ←
                </button>
              )}

              {/* PAGES */}
              {Array.from(
                { length: pagination.pages },
                (_, i) => i + 1
              )
                .filter(
                  (p) =>
                    p === 1 ||
                    p === pagination.pages ||
                    Math.abs(p - page) <= 1
                )
                .map((p, index, array) => (
                  <div
                    key={p}
                    className="flex items-center gap-2"
                  >
                    {index > 0 &&
                      array[index - 1] !== p - 1 && (
                        <span className="px-2 text-text">
                          ...
                        </span>
                      )}

                    <button
                      type="button"
                      onClick={() => onPageChange(p)}
                      className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
                        p === page
                          ? 'bg-black text-white shadow-md'
                          : 'border border-border bg-white hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  </div>
                ))}

              {/* NEXT */}
              {page < pagination.pages && (
                <button
                  type="button"
                  onClick={() => onPageChange(page + 1)}
                  className="w-10 h-10 rounded-xl border border-border bg-white text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  →
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL */}
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