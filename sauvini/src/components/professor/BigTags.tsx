import { Tag } from "./tag";

export default function BigTag({
  icon,
  text,
  className = "text-primary-300 bg-primary-50",
}: Tag) {
  return (
    <div className={`px-5 py-2 ${className} rounded-full`}>
      {icon && <span className="">{icon}</span>}
      {text}
    </div>
  );
}
