import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-[1126px] mx-auto pt-20 text-center">
      <div className="text-8xl mb-4">404</div>
      <h1 className="text-4xl font-semibold tracking-tight text-text-h mb-3">Page not found</h1>
      <p className="text-text mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-medium"
      >
        <ArrowLeft size={18} /> Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
