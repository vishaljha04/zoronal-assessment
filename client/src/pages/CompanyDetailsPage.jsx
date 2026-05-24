import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, MapPin, Calendar, Users, Share2, Plus } from 'lucide-react';
import { companyService } from '../services/companyService';
import { reviewService } from '../services/reviewService';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/cards/ReviewCard';
import AddReviewForm from '../components/forms/ReviewForm';
import Modal from '../components/ui/Modal';
import { formatFoundedDate } from '../utils/formatters';
import { REVIEW_SORT_OPTIONS } from '../constants';
import toast from 'react-hot-toast';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [sort, setSort] = useState('latest');
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getById(id),
  });

  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id, sort],
    queryFn: () => reviewService.getByCompany(id, { sort, limit: 50 }),
    enabled: !!id,
  });

  const company = companyData?.data;
  const currentReviews = reviews.length > 0 ? reviews : (reviewsData?.data || []);

  const handleReviewAdded = (newReview) => {
    // Optimistically update UI
    setReviews(prev => [newReview, ...prev]);
    
    // Invalidate company to get fresh average rating
    queryClient.invalidateQueries(['company', id]);
    refetchReviews();
    
    // Show success
    toast.success('Thank you! Your review is live.');
  };

  const handleLikeUpdate = (reviewId, newLikes) => {
    setReviews(prev =>
      prev.map(r => r._id === reviewId ? { ...r, likes: newLikes } : r)
    );
  };

  const handleShareCompany = async () => {
    if (!company) return;
    const text = `Check out ${company.name} on Reviewly — ${company.averageRating?.toFixed(1)}★ from ${company.totalReviews} reviews`;

    if (navigator.share) {
      try {
        await navigator.share({ title: company.name, text });
      } catch (_) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  if (companyLoading) {
    return (
      <div className="max-w-[1126px] mx-auto pt-10">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-40 bg-border rounded" />
          <div className="h-40 bg-border rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="max-w-[1126px] mx-auto pt-16 text-center">
        <h2 className="text-3xl font-semibold">Company not found</h2>
        <Link to="/" className="text-accent mt-4 inline-block">← Back to all companies</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1126px] mx-auto pt-8">
      {/* Back */}
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-text hover:text-accent mb-6">
        <ArrowLeft size={16} /> Back to all companies
      </Link>

      {/* Company Header */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mb-10">
        <div className="w-24 h-24 rounded-2xl border-2 border-border overflow-hidden flex-shrink-0 bg-white shadow-sm">
          <img
            src={company.logo}
            alt={company.name}
            className="w-full h-full object-contain p-2"
            onError={(e) => e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=aa3bff&color=fff&size=96`}
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-3">
            <h1 className="text-5xl tracking-[-1.5px] font-semibold text-text-h">{company.name}</h1>
            <div className="flex items-center gap-2 bg-accent-bg text-accent px-3 py-1 rounded-full text-sm font-medium">
              <Users size={15} /> {company.totalReviews} reviews
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-text mb-4">
            <div className="flex items-center gap-1.5">
              <MapPin size={17} /> {company.location}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={17} /> Founded {formatFoundedDate(company.foundedOn)}
            </div>
          </div>

          <div className="mb-5">
            <StarRating rating={company.averageRating || 0} size={24} />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent text-white font-medium hover:bg-[#9a2ee6] transition active:scale-[0.985]"
            >
              <Plus size={18} /> Write a Review
            </button>
            <button
              onClick={handleShareCompany}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border font-medium hover:bg-accent-bg transition"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="mb-12">
        <h2 className="font-semibold text-2xl tracking-tight mb-3 text-text-h">Overview</h2>
        <p className="text-[15px] leading-relaxed text-text max-w-3xl">{company.description}</p>
      </div>

      {/* Reviews Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-2xl tracking-tight text-text-h">
            Reviews <span className="font-normal text-text">({currentReviews.length})</span>
          </h2>
          
          <select 
            value={sort} 
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 text-sm border border-border rounded-2xl bg-white outline-none"
          >
            {REVIEW_SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {reviewsLoading && currentReviews.length === 0 ? (
          <div className="text-center py-8 text-text">Loading reviews...</div>
        ) : currentReviews.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {currentReviews.map((review) => (
              <ReviewCard 
                key={review._id} 
                review={review} 
                onLikeUpdate={handleLikeUpdate} 
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-3xl p-10 text-center">
            <div className="text-5xl mb-3">📝</div>
            <p className="text-text mb-4">No reviews yet for this company.</p>
            <button 
              onClick={() => setIsReviewModalOpen(true)}
              className="text-accent font-medium flex items-center gap-1 mx-auto"
            >
              Be the first to review <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Add Review Modal */}
      <Modal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        title="Write a Review"
        size="lg"
      >
        <AddReviewForm 
          companyId={id} 
          onSuccess={handleReviewAdded} 
          onClose={() => setIsReviewModalOpen(false)} 
        />
      </Modal>
    </div>
  );
};

export default CompanyDetailsPage;
