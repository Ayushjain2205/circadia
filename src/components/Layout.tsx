import React, { ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Moon, Activity, User, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

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
          <Link href="/askAi" className="relative ">
            <Button className="rounded-full bg-[#7B2CBF] text-white hover:bg-[#E2CFEA] hover:text-[#7B2CBF] w-16 h-16 flex flex-col items-center justify-center ">
              <Brain className="w-8 h-8" />
            </Button>
          </Link>
          <NavItem
            href="/activity"
            icon={<Activity className="w-6 h-6" />}
            label="Activity"
            isActive={isActive("/activity")}
          />
          <NavItem
            href="/profile"
            icon={<User className="w-6 h-6" />}
            label="Profile"
            isActive={isActive("/profile")}
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
