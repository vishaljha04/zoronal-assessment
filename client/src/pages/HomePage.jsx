import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyService } from '../services/companyService';
import { useDebounce } from '../hooks/useDebounce';
import CompanyCard from '../components/cards/CompanyCard';
import { SORT_OPTIONS, ITEMS_PER_PAGE } from '../constants';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(searchTerm, 450);
  const debouncedCity = useDebounce(cityFilter, 450);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['companies', debouncedSearch, debouncedCity, sortBy, page],
    queryFn: () => companyService.getAll({
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

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
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="border border-border rounded-2xl p-6 animate-pulse">
      <div className="flex gap-4 mb-4">
        <div className="w-14 h-14 bg-border rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-border rounded w-3/4" />
          <div className="h-3 bg-border rounded w-1/2" />
        </div>
      </div>
      <div className="space-y-2 mb-8">
        <div className="h-3 bg-border rounded" />
        <div className="h-3 bg-border rounded w-5/6" />
      </div>
      <div className="h-4 bg-border rounded w-1/3" />
    </div>
  );

  return (
    <div className="max-w-[1126px] mx-auto pt-10">
      {/* Hero / Header */}
      <div className="mb-10">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[52px] leading-none tracking-[-1.5px] font-semibold text-text-h mb-3">
              Discover great<br />companies.
            </h1>
            <p className="text-xl text-text max-w-md">
              Real reviews from real employees. Find your next workplace.
            </p>
          </div>
          <Link 
            to="/companies/new"
            className="hidden md:flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-medium hover:bg-[#9a2ee6] active:scale-[0.985] transition"
          >
            <Plus size={20} /> Add a Company
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8 sticky top-[79px] bg-[var(--bg)] z-30 py-4 -mx-1 px-1">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-4 text-text" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search companies by name..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border focus:border-accent focus:ring-1 focus:ring-accent/30 bg-white placeholder:text-text outline-none text-base"
          />
        </div>

        <div className="flex gap-3 flex-1 lg:flex-none">
          <div className="relative flex-1 lg:w-48">
            <Filter className="absolute left-4 top-4 text-text" size={18} />
            <input
              type="text"
              value={cityFilter}
              onChange={handleCityChange}
              placeholder="Filter by city"
              className="w-full pl-11 py-3.5 rounded-2xl border border-border focus:border-accent bg-white outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={handleSortChange}
            className="flex-1 lg:w-52 px-4 py-3.5 rounded-2xl border border-border bg-white focus:border-accent outline-none cursor-pointer text-sm font-medium"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      {error && (
        <div className="text-center py-12 text-red-500">
          Failed to load companies. <button onClick={() => refetch()} className="underline">Retry</button>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-border rounded-3xl">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold mb-2 text-text-h">No companies found</h3>
          <p className="text-text mb-6">Try adjusting your search or filters.</p>
          <Link to="/companies/new" className="inline-flex items-center gap-2 text-accent font-medium">
            <Plus size={18} /> Add the first company
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
            {companies.map((company) => (
              <CompanyCard key={company._id} company={company} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`w-10 h-10 rounded-2xl text-sm font-medium transition ${
                    p === page 
                      ? 'bg-accent text-white' 
                      : 'border border-border hover:bg-accent-bg text-text-h'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HomePage;
