import { useState } from 'react';
import { Heart, Share2 } from 'lucide-react';
import StarRating from '../StarRating';
import { formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';

const ReviewCard = ({ review, onLikeUpdate }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(review.likes || 0);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking || liked) return;

    setIsLiking(true);
    try {
      await reviewService.like(review._id);
      const newLikes = likes + 1;
      setLikes(newLikes);
      setLiked(true);
      if (onLikeUpdate) onLikeUpdate(review._id, newLikes);
      toast.success('Thanks for the feedback!');
    } catch (error) {
      toast.error(error.message || 'Failed to like review');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    const text = `${review.fullName} reviewed: "${review.subject}" - ${review.rating} stars`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Review on Reviewly',
          text: text,
        });
        toast.success('Shared successfully');
    } catch {
      // user cancelled
    }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(text);
      toast.success('Review copied to clipboard');
    }
  };

  return (
    <div className="bg-white border border-border rounded-2xl p-6 transition-all hover:shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-semibold text-text-h">{review.fullName}</div>
          <div className="text-xs text-text mt-0.5">{formatDate(review.createdAt)}</div>
        </div>
        <StarRating rating={review.rating} size={16} />
      </div>

      <h4 className="font-medium text-text-h mb-2">{review.subject}</h4>
      <p className="text-sm leading-relaxed text-text mb-4">{review.reviewText}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <button
          onClick={handleLike}
          disabled={liked || isLiking}
          className={`flex items-center gap-1.5 text-sm transition-colors ${
            liked ? 'text-red-500' : 'text-text hover:text-accent'
          } disabled:opacity-60`}
        >
          <Heart 
            size={16} 
            className={liked ? 'fill-red-500' : ''} 
          />
          <span>{likes}</span>
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 text-sm text-text hover:text-accent transition-colors"
        >
          <Share2 size={16} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
};

export default ReviewCard;
