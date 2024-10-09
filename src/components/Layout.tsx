import React, { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Moon, Activity, Footprints, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const isActive = (path: string) => router.pathname === path;

  if (!isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#F3E8FF] to-white font-poppins text-gray-800 p-4">
        <div className="flex flex-col items-center justify-center max-w-md text-center">
          <h1 className="text-3xl font-bold text-[#7B2CBF] mb-4">Circadia</h1>
          <p className="text-lg mb-8">
            Kindly open this app on a mobile device for the best experience.
          </p>
          <Image
            src="/logo.svg"
            alt="Circadia Logo"
            width={100}
            height={100}
            className="mx-auto"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-poppins text-gray-800">
      <main className="flex-1 p-4 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
        <div className="flex justify-around items-center h-20">
          <NavItem
            href="/home"
            icon={<Home className="w-6 h-6" />}
            label="Home"
            isActive={isActive("/home")}
          />
          <NavItem
            href="/sleep"
            icon={<Moon className="w-6 h-6" />}
            label="Sleep"
            isActive={isActive("/sleep")}
          />
          <Link href="/askAi" className="relative">
            <Button
              className={`rounded-full w-16 h-16 flex flex-col items-center justify-center transition-colors ${
                isActive("/askAi")
                  ? "bg-[#E2CFEA] text-[#7B2CBF]"
                  : "bg-[#7B2CBF] text-white hover:bg-[#E2CFEA] hover:text-[#7B2CBF]"
              }`}
            >
              <Brain className="w-8 h-8" />
            </Button>
          </Link>
          <NavItem
            href="/rhythm"
            icon={<Activity className="w-6 h-6" />}
            label="Rhythm"
            isActive={isActive("/rhythm")}
          />
          <NavItem
            href="/activity"
            icon={<Footprints className="w-6 h-6" />}
            label="Activity"
            isActive={isActive("/activity")}
          />
        </div>
      </nav>
    </div>
  );
};

interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon, label, isActive }) => (
  <Link
    href={href}
    className={`flex flex-col items-center ${
      isActive ? "text-[#7B2CBF]" : "text-gray-400"
    } hover:text-[#7B2CBF] transition-colors`}
  >
    {icon}
    <span className="text-xs mt-1">{label}</span>
  </Link>
);

export default Layout;
