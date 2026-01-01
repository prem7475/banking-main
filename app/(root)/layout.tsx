import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-full font-inter bg-black">
      <Sidebar />
      <div className="flex size-full flex-col">
        <div className="root-layout">
          {/* Mobile Nav Placeholder if needed */}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-black text-white">
            {children}
        </div>
      </div>
    </main>
  );
}