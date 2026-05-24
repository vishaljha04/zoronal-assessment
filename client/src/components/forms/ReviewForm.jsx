import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { reviewService } from '../../services/reviewService';

const reviewSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(60),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(120),
  reviewText: z.string().min(20, 'Review must be at least 20 characters').max(2000),
});

const AddReviewForm = ({ companyId, onSuccess, onClose }) => {
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      fullName: '',
      subject: '',
      reviewText: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const newReview = await reviewService.add(companyId, {
        ...data,
        rating,
      });
      
      toast.success('Review submitted successfully!');
      reset();
      setRating(5);
      setCharCount(0);
      onSuccess(newReview.data);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewTextChange = (e) => {
    setCharCount(e.target.value.length);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-text-h mb-1.5">Your Name</label>
        <input
          {...register('fullName')}
          type="text"
          placeholder="Jane Doe"
          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition"
        />
        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-text-h mb-1.5">Subject</label>
        <input
          {...register('subject')}
          type="text"
          placeholder="Great place to work"
          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none transition"
        />
        {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-medium text-text-h">Your Rating</label>
          <div className="flex">
            {[1,2,3,4,5].map((star) => (
              <Star
                key={star}
                size={22}
                className={`cursor-pointer transition-all ${star <= rating ? 'fill-accent text-accent' : 'text-border hover:text-accent/60'}`}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>
        <div className="text-xs text-text">Click to rate from 1 to 5 stars</div>
      </div>

      <div>
        <div className="flex justify-between mb-1.5">
          <label className="text-sm font-medium text-text-h">Your Review</label>
          <span className="text-xs text-text">{charCount}/2000</span>
        </div>
        <textarea
          {...register('reviewText')}
          onChange={(e) => {
            register('reviewText').onChange(e);
            handleReviewTextChange(e);
          }}
          rows={5}
          placeholder="Share your experience working at this company..."
          className="w-full px-4 py-3 rounded-2xl border border-border focus:border-accent focus:ring-1 focus:ring-accent/30 outline-none resize-y transition"
        />
        {errors.reviewText && <p className="text-xs text-red-500 mt-1">{errors.reviewText.message}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 py-3 rounded-xl border border-border font-medium hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-accent text-white font-medium disabled:opacity-70 hover:bg-[#9a2ee6] active:scale-[0.985] transition flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
};

export default AddReviewForm;
