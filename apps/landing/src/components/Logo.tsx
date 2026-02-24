export default function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logo.png`}
      alt="Undisputed Noobs"
      className={className}
      draggable={false}
    />
  );
}
