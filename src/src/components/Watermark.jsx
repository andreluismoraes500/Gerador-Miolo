export default function Watermark({ src, opacity = 0.03 }) {
  if (!src) return null;
  return (
    <img
      src={src}
      className="absolute inset-0 m-auto w-48 pointer-events-none"
      style={{ opacity }}
      alt=""
    />
  );
}
