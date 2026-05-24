const SafeImage = ({ src, fallbackSrc, alt, className, ...rest }) => {
  const resolvedSrc = src || fallbackSrc;

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (!fallbackSrc) return;
        const target = e.currentTarget;
        if (target?.src && target.src.endsWith(fallbackSrc)) return;
        target.src = fallbackSrc;
      }}
      {...rest}
    />
  );
};

export default SafeImage;
