import StarRating from '../StarRating';
import { formatDMYTime } from '../../utils/formatters';

const ReviewCard = ({ review }) => {
  return (
    <div className="py-6 border-b border-border last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(review.fullName)}&background=e5e5e5&color=111&size=64`}
            alt={review.fullName}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="min-w-0">
            <div className="font-semibold text-text-h">{review.fullName}</div>
            <div className="text-[11px] text-[#9b9b9b] mt-0.5">
              {review.createdAt ? formatDMYTime(review.createdAt) : ''}
            </div>
          </div>
        </div>

        <div className="shrink-0 pt-1">
          <StarRating rating={review.rating || 0} size={14} />
        </div>
      </div>

      <div className="mt-3 text-sm text-text-h font-medium">{review.subject}</div>
      <div className="mt-2 text-[12px] leading-relaxed text-[#6f6f6f] max-w-[820px]">
        {review.reviewText}
      </div>
    </div>
  );
};

export default ReviewCard;

