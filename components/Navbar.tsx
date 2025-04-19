"use client";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-gray-100 py-4 fixed w-full top-0 z-50">
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <span className="bg-gradient-to-br from-[#2E3192] to-[#00A99D] bg-clip-text text-transparent">
            My SmecLabs
          </span>
        </div>
        <div className="hidden md:flex space-x-8 items-center">
          <a href="#" className="text-gray-600 hover:text-[#00A99D] transition">
            Courses
          </a>
          <a href="#" className="text-gray-600 hover:text-[#00A99D] transition">
            Paths
          </a>
          <a href="#" className="text-gray-600 hover:text-[#00A99D] transition">
            Resources
          </a>
          <button className="bg-[#0071BC] hover:bg-[#00A99D] text-white px-6 py-2 rounded-full ml-4 transition-all duration-300 hover:-translate-y-0.5">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;