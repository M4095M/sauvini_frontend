import Logo from "@/components/logo/logo";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";

// export default function RegisterLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <div className="min-h-screen bg-neutral-100 sm:mx-28 mx-0 md:my-20 my-14 rounded-[80px] flex justify-center items-center relative">
//       <div className="absolute flex justify-between w-full top-0 p-6">
//         <Logo color={"text-primary-300"} width={84} height={84} />
//       </div>
//       {children}
//     </div>
//   );
// }

export default function RegisterLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen auth-background-gradient sm:px-28 pb-0 pt-14 px-0 md:py-20 flex justify-center items-center ">
      <div className="w-full h-full flex justify-center items-center bg-neutral-100 rounded-[80px] relative">
        <div className="absolute flex justify-between w-full top-0 p-6">
          <Logo color={"text-primary-300"} width={84} height={84} />
          <LanguageSwitcher />
        </div>
        {children}
      </div>
    </div>
  );
}
