export default function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="Undisputed Noobs"
      className={className}
    />
  );
}
