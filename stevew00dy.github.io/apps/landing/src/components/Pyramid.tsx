export default function Pyramid({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <img
        src="/values-triangles.png"
        alt="Undisputed Noobs Values — Be Respectful, Stay Positive, Have Fun"
        className="w-full max-w-md mx-auto"
      />
    </div>
  );
}
