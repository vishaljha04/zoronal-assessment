import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onClose, title, children, size = 'lg' }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/25">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className={`relative bg-white border border-border rounded-2xl shadow-2xl w-full ${sizeClasses[size]} overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 text-[#6f6f6f] hover:text-black transition-colors rounded-full"
          >
            <X size={18} />
          </button>

          <div className="px-8 pt-10 pb-7">
            <h2 className="text-[18px] font-semibold text-text-h text-center">{title}</h2>
            <div className="mt-6">{children}</div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default Modal;
