export default function Watermark({ src }) {
  if (!src) return null;

  return (
    <img
      src={src}
      className="
        absolute
        inset-0
        m-auto
        w-48
        opacity-[0.03]
        pointer-events-none
      "
      alt=""
    />
  );
}
