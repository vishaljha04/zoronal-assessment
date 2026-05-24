import StarRating from '../StarRating';
import { formatDMYTime } from '../../utils/formatters';
import { ThumbsUp, Flag } from 'lucide-react';
import { useState } from 'react';

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const reviewText = review.reviewText || '';
  const shouldTruncate = reviewText.length > 200;
  const displayText = isExpanded || !shouldTruncate 
    ? reviewText 
    : reviewText.slice(0, 200) + '...';

  return (
    <article className="py-6 sm:py-8 border-b border-border last:border-b-0">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
        
        {/* User Info */}
        <div className="flex items-start gap-3 min-w-0">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.fullName)}&background=e5e5e5&color=111&size=64`}
            alt={`${review.fullName}'s avatar`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0 ring-2 ring-gray-100"
            loading="lazy"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-text-h text-sm sm:text-base truncate">
              {review.fullName}
            </h4>
            <div className="flex items-center gap-2 text-[10px] sm:text-xs text-[#9b9b9b] mt-0.5 sm:mt-1">
              <time dateTime={review.createdAt}>
                {review.createdAt ? formatDMYTime(review.createdAt) : ''}
              </time>
              <span className="hidden sm:inline">•</span>
              <span className="hidden sm:inline text-[#6f6f6f]">Verified Review</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg sm:text-xl font-bold text-text-h">
            {review.rating?.toFixed(1) || '0.0'}
          </span>
          <StarRating rating={review.rating || 0} size={16} />
        </div>
      </div>

      {/* Subject */}
      <h5 className="mt-4 sm:mt-5 text-base sm:text-lg text-text-h font-semibold leading-snug">
        {review.subject}
      </h5>

      {/* Review Content */}
      <div className="mt-2 sm:mt-3">
        <p className="text-sm sm:text-[15px] leading-relaxed text-[#6f6f6f]">
          {displayText}
        </p>
        
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs sm:text-sm text-accent hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-accent/20 rounded"
          >
            {isExpanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {/* Footer Actions */}
      <div className="mt-4 sm:mt-6 flex items-center gap-4 pt-4 border-t border-gray-100">
        <button 
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6f6f6f] hover:text-text-h transition-colors group"
          aria-label="Helpful"
        >
          <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
          <span>Helpful</span>
        </button>
        
        <button 
          className="flex items-center gap-1.5 text-xs sm:text-sm text-[#6f6f6f] hover:text-red-500 transition-colors group ml-auto"
          aria-label="Report"
        >
          <Flag size={14} className="group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Report</span>
        </button>
      </div>
    </article>
  );
};

export default ReviewCard;