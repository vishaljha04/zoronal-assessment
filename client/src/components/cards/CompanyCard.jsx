import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating';
import { formatDMY } from '../../utils/formatters';

const CompanyCard = ({ company }) => {
  return (
    <div className="bg-white border border-border rounded-md shadow-[0_6px_18px_rgba(0,0,0,0.08)] px-6 py-5">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-5 flex-1 min-w-0">
          <div className="w-[84px] h-[70px] rounded-md bg-[#0b1030] overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={company.logo}
              alt={`${company.name} logo`}
              className="w-full h-full object-contain p-3 bg-white"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0b1030&color=fff&size=96`;
              }}
            />
          </div>

          <div className="min-w-0">
            <div className="font-semibold text-text-h truncate">{company.name}</div>
            <div className="mt-1 flex items-center gap-2 text-xs text-[#8f8f8f] min-w-0">
              <MapPin size={14} className="text-[#9b9b9b]" />
              <div className="truncate">{company.location}</div>
            </div>

            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-text-h">{(company.averageRating || 0).toFixed(1)}</span>
                <StarRating rating={company.averageRating || 0} size={14} />
              </div>
              <div className="text-sm text-text-h">
                <span className="font-semibold">{company.totalReviews || 0}</span> Reviews
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-end gap-3">
          <div className="text-[10px] text-[#9b9b9b] md:mb-1">
            Founded on {company.foundedOn ? formatDMY(company.foundedOn) : '--'}
          </div>
          <Link
            to={`/companies/${company._id}`}
            className="inline-flex items-center justify-center h-9 px-5 rounded-md bg-[#2f2f2f] text-white text-sm shadow-sm hover:bg-[#1f1f1f]"
          >
            Detail Review
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

