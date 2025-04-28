"use client";

import { FC } from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar: FC = () => {
  return (
    <nav className="bg-white border-b border-gray-100 py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="My SmecLabs Logo"
            width={40}
            height={40}
            priority
          />
          <span className="text-2xl font-bold">
            <span className="bg-gradient-to-br from-[#2E3192] to-[#00A99D] bg-clip-text text-transparent">
              My SmecLabs
            </span>
          </span>
        </Link>

        {/* Menu & CTA */}
        <div className="hidden md:flex space-x-8 items-center">
          <Link href="/courses" className="text-gray-600 hover:text-[#00A99D] transition">
            Courses
          </Link>
          <Link href="#paths" className="text-gray-600 hover:text-[#00A99D] transition">
            Paths
          </Link>
          <Link href="#resources" className="text-gray-600 hover:text-[#00A99D] transition">
            Resources
          </Link>
          <button className="bg-[#0071BC] hover:bg-[#00A99D] text-white px-6 py-2 rounded-full ml-4 transition-all duration-300 hover:-translate-y-0.5">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
