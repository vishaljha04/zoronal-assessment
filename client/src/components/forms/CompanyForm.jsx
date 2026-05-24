import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { MapPin } from 'lucide-react';
import { companyService } from '../../services/companyService';
import circle1 from '../../assets/circle1.svg';
import circle2 from '../../assets/circle2.svg';

const companySchema = z.object({
  name: z.string().min(2, 'Company name is required').max(100),
  location: z.string().min(2, 'Location is required'),
  foundedOn: z.string().min(4, 'Founded date is required'),
  city: z.string().min(2, 'City is required'),
  description: z.string().min(20, 'Description must be at least 20 characters').max(1000),
  logo: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});

const AddCompanyForm = ({ onSuccess, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
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
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        location: data.location,
        foundedOn: data.foundedOn,
        city: data.city,
        description: data.description,
        logo: data.logo || undefined,
      };

      const newCompany = await companyService.create(payload);
      toast.success('Company saved');
      if (onSuccess) onSuccess(newCompany.data);
      if (onClose) onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add company');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative">
      <div className="pointer-events-none absolute -left-10 -top-10">
        <img src={circle2} alt="" className="w-[92px] h-auto" />
        <img src={circle1} alt="" className="-mt-6 ml-10 w-[120px] h-auto" />
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Company name</label>
          <input
            {...register('name')}
            className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
            placeholder="Enter..."
          />
          {errors.name && <div className="text-xs text-red-500 mt-1">{errors.name.message}</div>}
        </div>

        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Location</label>
          <div className="relative">
            <input
              {...register('location')}
              className="w-full h-10 px-3 pr-10 rounded-md border border-border text-sm outline-none"
              placeholder="Select Location"
            />
            <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b9b9b]" />
          </div>
          {errors.location && <div className="text-xs text-red-500 mt-1">{errors.location.message}</div>}
        </div>

        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Founded on</label>
          <input
            {...register('foundedOn')}
            type="date"
            className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
          />
          {errors.foundedOn && <div className="text-xs text-red-500 mt-1">{errors.foundedOn.message}</div>}
        </div>

        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">City</label>
          <input
            {...register('city')}
            className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
            placeholder="Enter..."
          />
          {errors.city && <div className="text-xs text-red-500 mt-1">{errors.city.message}</div>}
        </div>

        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Description</label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 rounded-md border border-border text-sm outline-none resize-none"
            placeholder="Description"
          />
          {errors.description && <div className="text-xs text-red-500 mt-1">{errors.description.message}</div>}
        </div>

        <div>
          <label className="block text-[11px] text-[#9b9b9b] mb-2">Logo URL (optional)</label>
          <input
            {...register('logo')}
            className="w-full h-10 px-3 rounded-md border border-border text-sm outline-none"
            placeholder="https://"
          />
          {errors.logo && <div className="text-xs text-red-500 mt-1">{errors.logo.message}</div>}
        </div>

        <div className="pt-4 flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="h-9 w-[96px] rounded-md text-white text-sm font-medium shadow-sm disabled:opacity-70 bg-gradient-to-r from-[var(--brand-from)] to-[var(--brand-to)]"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddCompanyForm;

