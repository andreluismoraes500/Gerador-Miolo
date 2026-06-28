export default function Logo({ src, alt = "Logo", className = "" }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`h-8 w-auto object-contain ${className}`}
    />
  );
}
