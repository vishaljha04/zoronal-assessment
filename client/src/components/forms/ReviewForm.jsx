import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo, useState } from 'react';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';
import StarRating from '../StarRating';
import { getRatingText } from '../../utils/formatters';

const reviewSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(60, 'Full name must be less than 60 characters'),
  subject: z.string().min(2, 'Subject is required').max(120, 'Subject must be less than 120 characters'),
  reviewText: z.string().min(20, 'Review must be at least 20 characters').max(2000, 'Review must be less than 2000 characters'),
});

const AddReviewForm = ({ companyId, onSuccess, onClose }) => {
  const [rating, setRating] = useState(5);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { fullName: '', subject: '', reviewText: '' },
    mode: 'onBlur',
  });

  const reviewTextValue = watch('reviewText');
  const charCount = useMemo(() => (reviewTextValue || '').length, [reviewTextValue]);
  const charLimit = 2000;

  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName.trim(),
        subject: data.subject.trim(),
        reviewText: data.reviewText.trim(),
        rating,
      };

      await reviewService.add(companyId, payload);
      toast.success('Review submitted successfully');
      reset();
      onSuccess?.();
      onClose?.();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to submit review';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className="space-y-5">
        
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Full Name *
          </label>
          <input
            id="fullName"
            {...register('fullName')}
            type="text"
            className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
              errors.fullName ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="John Doe"
            disabled={isSubmitting}
            autoComplete="name"
          />
          {errors.fullName && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.fullName.message}
            </div>
          )}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Subject *
          </label>
          <input
            id="subject"
            {...register('subject')}
            type="text"
            className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
              errors.subject ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="e.g., Great workplace experience"
            disabled={isSubmitting}
          />
          {errors.subject && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.subject.message}
            </div>
          )}
        </div>

        {/* Rating Section */}
        <div className="bg-[var(--surface)] border border-border rounded-lg p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-text-h mb-3">Your Rating</h3>
              <StarRating 
                rating={rating} 
                size={28} 
                interactive 
                onChange={setRating}
              />
            </div>
            <div className="text-center sm:text-right">
              <div className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]">
                {rating.toFixed(1)}
              </div>
              <p className="text-xs sm:text-sm text-[#9b9b9b] mt-1">
                {getRatingText(rating)}
              </p>
            </div>
          </div>
        </div>

        {/* Review Text */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="reviewText" className="block text-[11px] text-[#9b9b9b] font-medium">
              Your Review *
            </label>
            <div className={`text-[10px] font-medium ${
              charCount > charLimit * 0.9 ? 'text-red-500' : 'text-[#9b9b9b]'
            }`}>
              {charCount}/{charLimit}
            </div>
          </div>
          <textarea
            id="reviewText"
            {...register('reviewText')}
            rows={5}
            className={`w-full px-3 py-2 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 resize-none ${
              errors.reviewText ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="Share your experience with the company... (minimum 20 characters)"
            disabled={isSubmitting}
          />
          {errors.reviewText && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.reviewText.message}
            </div>
          )}
          <p className="text-xs text-[#9b9b9b] mt-1.5">
            Be honest and constructive in your feedback
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-10 rounded-md text-white text-sm font-semibold shadow-sm transition-all duration-200 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              'Submit Review'
            )}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 h-10 rounded-md border border-border text-text-h text-sm font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default AddReviewForm;