import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { companyService } from '../../services/companyService';

const companySchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  location: z.string().min(2, 'Location is required'),
  city: z.string().min(2, 'City is required'),
  foundedOn: z.string().min(4, 'Founded date is required'),
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
      logo: '',
      description: '',
      location: '',
      city: '',
      foundedOn: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      const newCompany = await companyService.create(data);
      toast.success('Company added successfully!');
      reset();
      onSuccess(newCompany.data);
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add company');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-h">Company Name *</label>
          <input
            {...register('name')}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent outline-none"
            placeholder="Acme Corporation"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-h">Logo URL</label>
          <input
            {...register('logo')}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent outline-none"
            placeholder="https://example.com/logo.png"
          />
          {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-text-h">Description *</label>
        <textarea
          {...register('description')}
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border border-border focus:border-accent outline-none resize-y"
          placeholder="Brief description of the company..."
        />
        {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-h">Location *</label>
          <input
            {...register('location')}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent outline-none"
            placeholder="San Francisco, CA"
          />
          {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1.5 text-text-h">City *</label>
          <input
            {...register('city')}
            className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent outline-none"
            placeholder="San Francisco"
          />
          {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-text-h">Founded Date *</label>
        <input
          {...register('foundedOn')}
          type="date"
          className="w-full px-4 py-3 rounded-xl border border-border focus:border-accent outline-none"
        />
        {errors.foundedOn && <p className="text-red-500 text-xs mt-1">{errors.foundedOn.message}</p>}
      </div>

      <div className="flex gap-3 pt-3">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 rounded-xl bg-accent hover:bg-[#9a2ee6] text-white font-medium disabled:opacity-70 transition active:scale-[0.985]"
        >
          {isSubmitting ? 'Adding Company...' : 'Add Company'}
        </button>
      </div>
    </form>
  );
};

export default AddCompanyForm;
