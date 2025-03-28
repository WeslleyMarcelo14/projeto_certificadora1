"use client";

import UserNav from "@/components/dashboard/user-navbar";
import SheetMenu from "@/components/dashboard/sheet-menu";

const Navbar = ({ title }) => (
  <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
    <div className="mx-4 sm:mx-8 flex h-14 items-center">
      <div className="flex items-center space-x-4 lg:space-x-0">
        <SheetMenu />
        <h1 className="font-bold">{title}</h1>
      </div>
      <div className="flex flex-1 items-center justify-end">
        <UserNav />
      </div>
    </div>
  </header>
);

export default Navbar;
