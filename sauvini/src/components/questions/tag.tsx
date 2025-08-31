type Tag = {
  icon: any;
  text: string;
  className: string;
};

export default function Tag({ icon, text, className }: Tag) {
  return (
    <div
      className={`flex flex-row justify-center items-center w-fit gap-1 px-2 ${className} rounded-full`}
    >
      {icon && <span>{icon}</span>}

      <span className="text-sm font-normal">{text}</span>
    </div>
  );
}
