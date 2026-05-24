import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin } from 'lucide-react';
import { companyService } from '../services/companyService';
import { reviewService } from '../services/reviewService';
import StarRating from '../components/StarRating';
import ReviewCard from '../components/cards/ReviewCard';
import AddReviewForm from '../components/forms/ReviewForm';
import Modal from '../components/ui/Modal';
import { formatDMY } from '../utils/formatters';
import toast from 'react-hot-toast';
import { useAuth } from '../context/auth.jsx';
import { useNavigate } from 'react-router-dom';

const CompanyDetailsPage = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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

  if (companyLoading) {
    return (
      <div className="pt-10">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 bg-border rounded" />
          <div className="h-44 bg-border rounded-md" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="pt-16 text-center">
        <div className="text-xl font-semibold text-text-h">Company not found</div>
        <Link to="/" className="text-accent mt-4 inline-block">
          ← Back
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-8">
      <div className="border-t border-border pt-8">
        <div className="max-w-[920px] mx-auto">
          <div className="bg-white border border-border rounded-md shadow-[0_10px_22px_rgba(0,0,0,0.08)] px-10 py-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex items-start gap-6 min-w-0">
                <div className="w-[86px] h-[72px] rounded-md bg-[#0b1030] overflow-hidden flex items-center justify-center shrink-0">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="w-full h-full object-contain p-3 bg-white"
                    onError={(e) => (e.target.src = `https://ui-avatars.com/api/?name=${company.name}&background=0b1030&color=fff&size=96`)}
                  />
                </div>

                <div className="min-w-0">
                  <div className="font-semibold text-text-h text-[15px] truncate">{company.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-[#8f8f8f] min-w-0">
                    <MapPin size={14} className="text-[#9b9b9b]" />
                    <div className="truncate">{company.location}</div>
                  </div>

                  <div className="mt-3 flex items-center gap-3 text-sm">
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

              <div className="text-right shrink-0">
                <div className="text-[10px] text-[#9b9b9b]">
                  Founded on {company.foundedOn ? formatDMY(company.foundedOn) : '--'}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isAuthenticated) {
                      toast.error('Please login to add a review');
                      navigate(`/login?returnTo=${encodeURIComponent(`/companies/${id}`)}`);
                      return;
                    }
                    setIsReviewModalOpen(true);
                  }}
                  className="mt-4 h-9 px-6 rounded-md text-white text-sm font-medium shadow-sm bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
                >
                  + Add Review
                </button>
              </div>
            </div>

            <div className="mt-8 text-[11px] text-[#9b9b9b]">Result Found: {totalFound}</div>

            <div className="mt-2">
              {reviewsLoading ? (
                <div className="py-8 text-sm text-[#9b9b9b]">Loading...</div>
              ) : reviews.length === 0 ? (
                <div className="py-8 text-sm text-[#9b9b9b]">No reviews yet.</div>
              ) : (
                <div className="mt-2">
                  {reviews.map((r) => (
                    <ReviewCard key={r._id} review={r} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Add Review" size="md">
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
