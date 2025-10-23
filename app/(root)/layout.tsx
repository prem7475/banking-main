import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import { AppProvider } from "@/lib/context/AppContext";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get logged in user from database
  const loggedInUser = await getLoggedInUser();

  // Redirect to login if not authenticated
  if (!loggedInUser) {
    redirect('/sign-in');
  }

  return (
    <AppProvider>
    <main className="flex min-h-screen w-full font-inter">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:flex">
          <Sidebar user={loggedInUser} />
        </div>

        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
            <div>
              <MobileNav user={loggedInUser} />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </main>
    </AppProvider>
  );
}
