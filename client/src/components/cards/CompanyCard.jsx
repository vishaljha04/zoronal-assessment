import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating';
import { formatFoundedDate, truncate } from '../../utils/formatters';

const CompanyCard = ({ company }) => {
  return (
    <div className="group bg-white border border-border rounded-2xl p-6 flex flex-col transition-all hover:shadow-custom hover:-translate-y-0.5">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-xl border border-border overflow-hidden flex-shrink-0 bg-white">
          <img
            src={company.logo}
            alt={`${company.name} logo`}
            className="w-full h-full object-contain p-1"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=aa3bff&color=fff&size=56`;
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-xl text-text-h truncate group-hover:text-accent transition-colors">
            {company.name}
          </h3>
          <div className="flex items-center gap-1.5 text-sm text-text mt-1">
            <MapPin size={14} />
            <span>{company.location}</span>
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-text mb-5 flex-1">
        {truncate(company.description, 110)}
      </p>

      <div className="flex items-center justify-between text-xs text-text mb-4">
        <div className="flex items-center gap-1.5">
          <Calendar size={14} />
          <span>Founded {formatFoundedDate(company.foundedOn)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <StarRating rating={company.averageRating || 0} size={16} />
          <span className="text-xs text-text ml-1">
            ({company.totalReviews || 0} reviews)
          </span>
        </div>

        <Link
          to={`/companies/${company._id}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:gap-2 transition-all group-hover:text-accent"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default CompanyCard;
