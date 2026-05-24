import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MapPin, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { companyService } from '../../services/companyService';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  location: z.string().min(2, 'Location is required'),
  foundedOn: z.string().min(1, 'Founded date is required'),
  city: z.string().min(2, 'City is required'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000, 'Description must be less than 1000 characters'),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const AddCompanyForm = ({ onSuccess, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      location: '',
      foundedOn: '',
      city: '',
      description: '',
      logo: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name.trim(),
        location: data.location.trim(),
        foundedOn: data.foundedOn,
        city: data.city.trim(),
        description: data.description.trim(),
        logo: data.logo?.trim() || undefined,
      };

      const newCompany = await companyService.create(payload);
      toast.success('Company added successfully');
      reset();
      onSuccess?.(newCompany.data);
      onClose?.();
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Failed to add company';
      toast.error(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full">
      <div className="space-y-5">
        
        {/* Company Name */}
        <div>
          <label htmlFor="name" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Company Name *
          </label>
          <input
            id="name"
            {...register('name')}
            type="text"
            className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
              errors.name ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="e.g., Acme Corporation"
            disabled={isSubmitting}
          />
          {errors.name && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.name.message}
            </div>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Location *
          </label>
          <div className="relative">
            <input
              id="location"
              {...register('location')}
              type="text"
              className={`w-full h-10 px-3 pr-10 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
                errors.location ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
              }`}
              placeholder="e.g., 123 Main St, City"
              disabled={isSubmitting}
            />
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b9b9b] pointer-events-none" />
          </div>
          {errors.location && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.location.message}
            </div>
          )}
        </div>

        {/* Founded Date */}
        <div>
          <label htmlFor="foundedOn" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Founded On *
          </label>
          <input
            id="foundedOn"
            {...register('foundedOn')}
            type="date"
            className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
              errors.foundedOn ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            disabled={isSubmitting}
          />
          {errors.foundedOn && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.foundedOn.message}
            </div>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            City *
          </label>
          <input
            id="city"
            {...register('city')}
            type="text"
            className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
              errors.city ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="e.g., New York"
            disabled={isSubmitting}
          />
          {errors.city && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.city.message}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={4}
            className={`w-full px-3 py-2 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 resize-none ${
              errors.description ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="Tell us about the company (minimum 20 characters)"
            disabled={isSubmitting}
          />
          {errors.description && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.description.message}
            </div>
          )}
        </div>

        {/* Logo URL */}
        <div>
          <label htmlFor="logo" className="block text-[11px] text-[#9b9b9b] mb-2 font-medium">
            Logo URL <span className="text-gray-400">(optional)</span>
          </label>
          <input
            id="logo"
            {...register('logo')}
            type="url"
            className={`w-full h-10 px-3 rounded-md border text-sm outline-none transition-colors focus:ring-2 focus:ring-accent/20 ${
              errors.logo ? 'border-red-500 bg-red-50' : 'border-border focus:border-accent'
            }`}
            placeholder="https://example.com/logo.png"
            disabled={isSubmitting}
          />
          {errors.logo && (
            <div className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>✕</span> {errors.logo.message}
            </div>
          )}
          <p className="text-xs text-[#9b9b9b] mt-1.5">
            Must be a valid image URL (PNG, JPG, SVG, etc.)
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 h-10 rounded-md text-white text-sm font-semibold shadow-sm transition-all duration-200 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)] hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader size={16} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              'Add Company'
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

export default AddCompanyForm;