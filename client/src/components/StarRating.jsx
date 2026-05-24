const STAR_PATH =
  'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z';

const StarIcon = ({ size, fillPercent = 0, className }) => {
  const id = `star-grad-${Math.random().toString(16).slice(2)}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="24" y2="0">
          <stop offset={`${fillPercent}%`} stopColor="var(--star)" />
          <stop offset={`${fillPercent}%`} stopColor="transparent" />
        </linearGradient>
      </defs>
      <path d={STAR_PATH} fill={`url(#${id})`} stroke="var(--star)" strokeWidth="1" />
      <path d={STAR_PATH} fill="none" stroke="#d7d7d7" strokeWidth="1" />
    </svg>
  );
};

const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

const StarRating = ({ rating, size = 18, interactive = false, onChange, showValue = false }) => {
  const safeRating = Number.isFinite(rating) ? clamp(rating, 0, 5) : 0;
  const stars = [1, 2, 3, 4, 5];

  const handleClick = (value) => {
    if (interactive && onChange) onChange(value);
  };

  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => {
        const fill = clamp((safeRating - (star - 1)) * 100, 0, 100);
        if (!interactive) {
          return (
            <span key={star} className="cursor-default">
              <StarIcon size={size} fillPercent={fill} />
            </span>
          );
        }

        return (
          <button
            type="button"
            key={star}
            onClick={() => handleClick(star)}
            className="cursor-pointer hover:scale-105 active:scale-95"
            aria-label={`Rate ${star} star`}
          >
            <StarIcon size={size} fillPercent={fill} />
          </button>
        );
      })}
      {showValue && (
        <span className="ml-1 text-sm font-medium text-text-h">{safeRating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default StarRating;
