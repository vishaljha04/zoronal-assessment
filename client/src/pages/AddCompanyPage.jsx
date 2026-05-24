import { useNavigate } from 'react-router-dom';
import AddCompanyForm from '../components/forms/CompanyForm';
import { useAuth } from '../context/auth.jsx';
import { useEffect } from 'react';

const AddCompanyPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(`/login?returnTo=${encodeURIComponent('/companies/new')}`, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSuccess = (newCompany) => {
    // Navigate to the new company's detail page
    navigate(`/companies/${newCompany._id}`);
  };

  return (
    <div className="max-w-[1126px] mx-auto pt-10 pb-12">
      <div className="max-w-2xl">
        <h1 className="text-[42px] leading-none tracking-[-1.2px] font-semibold text-text-h mb-2">
          Add a new company
        </h1>
        <p className="text-lg text-text mb-8">
          Help the community by sharing information about a company you've worked with.
        </p>

        <div className="bg-[var(--surface)] border border-border rounded-3xl p-8 shadow-sm">
          <AddCompanyForm onSuccess={handleSuccess} />
        </div>
      </div>
    </div>
  );
};

export default AddCompanyPage;
