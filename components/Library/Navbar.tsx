"use client";

import Link from "next/link";
import { Course } from "@/types/types";

interface NavbarProps {
  courses: Course[];
}

export default function Navbar({ courses }: NavbarProps) {
  return (
<nav className="navbar text-white fixed top-12 left-0 right-0 h-10 flex items-center z-50 p-2">

      <div className="flex items-center w-full px-4">
        {/* Mobile hamburger placeholder if needed */}
        <div className="md:hidden mr-4"></div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-x-auto scrollable-nav">
          <ul className="flex space-x-4 whitespace-nowrap">
            <li>
              {/* Increase margin below lg, reset at lg */}
              <Link
                href="/"
                className="text-white hover:underline ml-2 lg:ml-0"
              >
                Home
              </Link>
            </li>
            {courses.map((course) => (
              <li key={course.id}>
                <Link
                  href={`library/${course.slug}`}
                  className="text-white hover:underline"
                >
                  {course.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
