export default function MainCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="max-w-2xl mx-auto md:my-4 md:border md:border-neutral-300 md:rounded-lg md:shadow-[#000_0px_2px_2px] bg-white overflow-hidden min-h-[100dvh] md:min-h-0 flex flex-col justify-between">
      {children}
    </main>
  );
}
