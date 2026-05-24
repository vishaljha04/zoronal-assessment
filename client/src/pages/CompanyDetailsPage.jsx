import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, ArrowLeft } from 'lucide-react';
import { companyService } from '../services/companyService';
import { reviewService } from '../services/reviewService';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/cards/ReviewCard';
import AddReviewForm from '../components/forms/ReviewForm';
import Modal from '../components/ui/Modal';
import { formatDMY } from '../utils/formatters';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth.jsx';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const { data: companyData, isLoading: companyLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getById(id),
    enabled: !!id,
  });

  const { data: reviewsData, isLoading: reviewsLoading, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getByCompany(id, { sort: 'latest', limit: 50 }),
    enabled: !!id,
  });

  const company = companyData?.data;
  const reviews = reviewsData?.data || [];
  const totalFound = useMemo(() => reviewsData?.pagination?.total ?? reviews.length, [reviewsData, reviews.length]);

  const handleReviewAdded = async () => {
    await queryClient.invalidateQueries({ queryKey: ['company', id] });
    await refetchReviews();
    toast.success('Review submitted');
  };

  const handleAddReviewClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add a review');
      navigate(`/login?returnTo=${encodeURIComponent(`/companies/${id}`)}`);
      return;
    }
    setIsReviewModalOpen(true);
  };

  if (companyLoading) {
    return (
      <div className="pt-6 sm:pt-10">
        <div className="max-w-[920px] mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-6 w-32 bg-border rounded" />
            <div className="h-64 sm:h-44 bg-border rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="pt-12 sm:pt-16 text-center px-4">
        <div className="text-xl sm:text-2xl font-semibold text-text-h mb-4">
          Company not found
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-accent hover:underline"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-4 sm:pt-8">
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-sm text-accent hover:underline mb-4 sm:mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="border-t border-border pt-6 sm:pt-8">
        <div className="max-w-[920px] mx-auto">
          <div className="bg-white border border-border rounded-lg sm:rounded-xl shadow-[0_10px_22px_rgba(0,0,0,0.08)] px-4 sm:px-8 lg:px-10 py-6 sm:py-8">
            
            {/* Company Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              {/* Company Info */}
              <div className="flex items-start gap-4 sm:gap-6 min-w-0 flex-1">
                {/* Logo */}
                <div className="w-16 h-16 sm:w-[86px] sm:h-[72px] rounded-md bg-[#0b1030] overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-2 sm:p-3 bg-white"
                    onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=0b1030&color=fff&size=96`)}
                  />
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <h1 className="font-semibold text-text-h text-lg sm:text-[15px] break-words">
                    {company.name}
                  </h1>
                  
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#8f8f8f]">
                    <MapPin size={14} className="text-[#9b9b9b] shrink-0" />
                    <div className="truncate">{company.location}</div>
                  </div>

                  {/* Rating */}
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-h">
                        {(company.averageRating || 0).toFixed(1)}
                      </span>
                      <StarRating rating={company.averageRating || 0} size={14} />
                    </div>
                    <div className="text-sm text-text-h">
                      <span className="font-semibold">{company.totalReviews || 0}</span> Reviews
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Section */}
              <div className="flex sm:flex-col items-center sm:items-end gap-4 sm:gap-0 shrink-0">
                <div className="text-[10px] text-[#9b9b9b] order-2 sm:order-1">
                  Founded: {company.foundedOn ? formatDMY(company.foundedOn) : '--'}
                </div>
                <button
                  type="button"
                  onClick={handleAddReviewClick}
                  className="order-1 sm:order-2 sm:mt-4 h-9 px-4 sm:px-6 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow whitespace-nowrap"
                >
                  + Add Review
                </button>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-6 sm:mt-8">
              <div className="text-[11px] text-[#9b9b9b] mb-3">
                {totalFound} {totalFound === 1 ? 'Review' : 'Reviews'} Found
              </div>

              {reviewsLoading ? (
                <div className="py-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                  <p className="mt-4 text-sm text-[#9b9b9b]">Loading reviews...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="py-12 text-center border border-dashed border-border rounded-lg">
                  <p className="text-sm text-[#9b9b9b] mb-4">
                    No reviews yet. Be the first to review!
                  </p>
                  <button
                    type="button"
                    onClick={handleAddReviewClick}
                    className="h-9 px-6 rounded-md text-white text-sm font-medium bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md transition-shadow"
                  >
                    Write a Review
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <ReviewCard key={review._id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <Modal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        title="Add Review" 
        size="md"
      >
        <AddReviewForm
          companyId={id}
          onSuccess={async () => {
            setIsReviewModalOpen(false);
            await handleReviewAdded();
          }}
          onClose={() => setIsReviewModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CompanyDetailsPage;