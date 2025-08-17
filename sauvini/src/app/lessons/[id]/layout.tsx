// export default function RegisterLayout({
//   children,
// }: Readonly<{ children: React.ReactNode }>) {
//   return (
//     <div className="flex min-h-screen">
//       <div className="w-52 h-screen bg-red-400"></div>
//       <div className="flex-1 overflow-y-auto bg-blue-300">{children}</div>
//     </div>
//   );
// }

export default function LessonLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen gradient-background-gradient px-14 py-10 flex justify-center items-center">{children}</div>;
}
