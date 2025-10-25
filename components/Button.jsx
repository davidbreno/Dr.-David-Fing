export default function Button({ children, onClick, className = "", type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`rounded-xl px-4 py-2 bg-white/10 hover:bg-white/20 active:bg-white/25 transition-colors border border-white/10 ${className}`}
    >
      {children}
    </button>
  );
}
