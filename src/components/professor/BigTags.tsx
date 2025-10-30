import { Tag } from "./tag";

export default function BigTag({
  icon,
  text,
  className = "text-primary-300 bg-primary-50",
  onClick,
}: Tag & { onClick?: () => void }) {
  return (
    <div
      className={`px-5 py-2 ${className} rounded-full ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
    >
      {icon && <span className="">{icon}</span>}
      {text}
    </div>
  );
}
