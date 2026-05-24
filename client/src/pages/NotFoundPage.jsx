import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        {/* 404 Text */}
        <div className="mb-6">
          <div className="text-6xl sm:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] mb-4">
            404
          </div>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-text-h mb-2">
            Page not found
          </h1>
          <p className="text-sm sm:text-base text-text">
            The page you're looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
        </div>

        {/* Illustration/Icon */}
        <div className="my-8 sm:my-12">
          <div className="inline-block p-6 sm:p-8 bg-[var(--surface)] border border-border rounded-2xl">
            <div className="text-4xl">🔍</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] text-white rounded-lg sm:rounded-xl font-semibold shadow-sm hover:shadow-md transition-shadow"
          >
            <Home size={18} />
            <span>Go back home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 border border-border text-text-h rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Go back</span>
          </button>
        </div>

        {/* Helpful Links */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border">
          <p className="text-xs sm:text-sm text-[#9b9b9b] mb-4">
            Need help? Check out these pages:
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
            <Link
              to="/"
              className="text-sm text-accent hover:underline"
            >
              Browse Companies
            </Link>
            <span className="hidden sm:inline text-[#9b9b9b]">•</span>
            <a
              href="#"
              className="text-sm text-accent hover:underline"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;