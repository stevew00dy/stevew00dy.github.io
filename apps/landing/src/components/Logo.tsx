export default function Logo({ className = "w-16 h-16" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} xmlns="http://www.w3.org/2000/svg" aria-label="Undisputed Noobs">
      <path d="M16 7 C20.5 7, 25 10.5, 25 15.5 C25 20.5, 20.5 24, 16 24 C13 24, 11 22.5, 9.8 20" fill="none" stroke="#00b4d8" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 10 C19 10, 22 12.5, 22 15.5 C22 18.5, 19 21, 16 21 C14 21, 12.5 19.5, 11.8 18" fill="none" stroke="#00b4d8" strokeWidth="1.5" strokeLinecap="round" />
      <polygon points="13,6 14.5,2 16,6" fill="#f0a500" />
      <polygon points="16.5,5 18,1 19.5,5" fill="#ffc847" />
      <polygon points="20,6 21.5,2 23,6" fill="#f0a500" />
    </svg>
  );
}
