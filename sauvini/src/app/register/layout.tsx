import Logo from "@/components/logo/logo";

export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-neutral-100 sm:mx-28 mx-0 md:my-20 my-14 rounded-[80px] flex justify-center items-center relative">
      <div className="absolute flex justify-between w-full top-0 p-6">
        <Logo color={"text-primary-300"} width={84} height={84} />
      </div>
      {children}
    </div>
  );
}
