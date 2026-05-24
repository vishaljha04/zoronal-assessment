import { Star } from 'lucide-react';

const StarRating = ({ rating, size = 18, interactive = false, onChange }) => {
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (interactive && onChange) {
      onChange(value);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <Star
          key={star}
          size={size}
          className={`transition-colors ${
            star <= Math.round(rating)
              ? 'fill-accent text-accent'
              : 'text-border'
          } ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
          onClick={() => handleClick(star)}
        />
      ))}
      <span className="ml-1.5 text-sm font-medium text-text-h">
        {rating ? rating.toFixed(1) : '0.0'}
      </span>
    </div>
  );
};

export default StarRating;
