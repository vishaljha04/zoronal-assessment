import { MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating';
import { formatDMY } from '../../utils/formatters';

const CompanyCard = ({ company }) => {
  return (
    <Link
      to={`/companies/${company._id}`}
      className="group bg-white border border-border rounded-lg sm:rounded-xl shadow-[0_6px_18px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)] transition-all duration-200 overflow-hidden"
    >
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          
          {/* Logo & Info Section */}
          <div className="flex items-start gap-4 sm:gap-5 flex-1 min-w-0">
            
            {/* Logo */}
            <div className="w-16 h-16 sm:w-[84px] sm:h-[70px] rounded-lg bg-[#0b1030] overflow-hidden flex items-center justify-center shrink-0 group-hover:ring-2 group-hover:ring-accent/20 transition-all">
              <img
                src={company.logo}
                alt={`${company.name} logo`}
                className="w-full h-full object-contain p-2 sm:p-3 bg-white"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0b1030&color=fff&size=96`;
                }}
              />
            </div>

            {/* Company Details */}
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-text-h text-base sm:text-lg group-hover:text-accent transition-colors truncate">
                {company.name}
              </h3>

              {/* Location */}
              <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-[#8f8f8f]">
                <MapPin size={14} className="text-[#9b9b9b] shrink-0" />
                <span className="truncate">{company.location}</span>
              </div>

              {/* Rating & Reviews */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text-h text-sm">
                    {(company.averageRating || 0).toFixed(1)}
                  </span>
                  <StarRating rating={company.averageRating || 0} size={14} />
                </div>
                <div className="text-xs sm:text-sm text-text-h">
                  <span className="font-semibold">{company.totalReviews || 0}</span>
                  {' '}
                  <span className="text-[#8f8f8f]">
                    {company.totalReviews === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0 w-full sm:w-auto">
            
            {/* Founded Date */}
            <div className="text-[10px] sm:text-xs text-[#9b9b9b] text-right">
              <div className="hidden sm:block mb-3">
                Founded {company.foundedOn ? formatDMY(company.foundedOn) : '--'}
              </div>
            </div>

            {/* View Details Button */}
            <div className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md group-hover:scale-105 transition-all duration-200 shrink-0 gap-1.5">
              <span>View</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        {/* Mobile Founded Date */}
        <div className="mt-3 sm:hidden text-[10px] text-[#9b9b9b]">
          Founded {company.foundedOn ? formatDMY(company.foundedOn) : '--'}
        </div>
      </div>
    </Link>
  );
};

export default CompanyCard;