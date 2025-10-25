export default function Card({ className = "", children }) {
  return <div className={`glass rounded-2xl ${className}`}>{children}</div>;
}
