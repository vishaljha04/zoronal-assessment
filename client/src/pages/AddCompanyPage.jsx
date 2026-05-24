import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import AddCompanyForm from '../components/forms/CompanyForm';
import { useAuth } from '../context/auth.jsx';

const AddCompanyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/login?returnTo=${encodeURIComponent(location.pathname)}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location.pathname]);

  const handleSuccess = (newCompany) => {
    // Navigate to the new company's detail page
    navigate(`/companies/${newCompany._id}`);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto pt-10 pb-12">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
      </div>
    );
  }

  // Don't render the form if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto pt-6 sm:pt-10 pb-12">
      <h1 className="text-3xl sm:text-[42px] leading-none tracking-[-1.2px] font-semibold text-text-h mb-2">
        Add a new company
      </h1>
      <p className="text-base sm:text-lg text-text mb-6 sm:mb-8">
        Help the community by sharing information about a company you've worked with.
      </p>

      <div className="bg-[var(--surface)] border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-sm">
        <AddCompanyForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default AddCompanyPage;