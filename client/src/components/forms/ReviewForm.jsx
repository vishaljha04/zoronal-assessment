import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';
import StarRating from '../StarRating';
import circle1 from '../../assets/circle1.svg';
import circle2 from '../../assets/circle2.svg';
import { getRatingText } from '../../utils/formatters';

const reviewSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(60),
  subject: z.string().min(2, 'Subject is required').max(120),
  reviewText: z.string().min(20, 'Review must be at least 20 characters').max(2000),
});

const AddReviewForm = ({ companyId, onSuccess, onClose }) => {
  const [rating, setRating] = useState(4);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { fullName: '', subject: '', reviewText: '' },
  });

  const reviewTextValue = watch('reviewText');
  const charCount = useMemo(() => (reviewTextValue || '').length, [reviewTextValue]);

  const onSubmit = async (data) => {
    try {
      const newReview = await reviewService.add(companyId, { ...data, rating });
      toast.success('Saved');
      reset();
      if (onSuccess) onSuccess(newReview.data);
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div className="pointer-events-none absolute -left-10 -top-10">
        <img src={circle2} alt="" className="w-[92px] h-auto" />
        <img src={circle1} alt="" className="-mt-6 ml-10 w-[120px] h-auto" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Full Name</label>
          <input
            {...register('fullName')}
            className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
            placeholder="Enter"
          />
          {errors.fullName && <div className="text-xs text-red-500 mt-1">{errors.fullName.message}</div>}
        </div>

        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Subject</label>
          <input
            {...register('subject')}
            className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
            placeholder="Enter"
          />
          {errors.subject && <div className="text-xs text-red-500 mt-1">{errors.subject.message}</div>}
        </div>

        <div>
          <div className="flex items-end justify-between mb-2">
            <label className="block text-[11px] text-[#9b9b9b]">Enter your Review</label>
            <div className="text-[10px] text-[#9b9b9b]">{charCount}/2000</div>
          </div>
          <textarea
            {...register('reviewText')}
            rows={4}
            className="w-full px-3 py-2 rounded-md border border-border text-sm outline-none resize-none"
            placeholder="Description"
          />
          {errors.reviewText && <div className="text-xs text-red-500 mt-1">{errors.reviewText.message}</div>}
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-between">
            <div className="text-[16px] font-semibold text-text-h">Rating</div>
            <div className="text-[11px] text-[#9b9b9b]">{getRatingText(rating)}</div>
          </div>
          <div className="mt-3">
            <StarRating rating={rating} size={26} interactive onChange={setRating} />
          </div>
        </div>

        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 w-[96px] rounded-md text-white text-sm font-medium shadow-sm disabled:opacity-70 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddReviewForm;

