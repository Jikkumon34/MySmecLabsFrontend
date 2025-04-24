"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import DropdownMenu from "./DropdownMenu";
import { MenuData } from "@/types/types";
import { fetchGraphQL } from "@/lib/graphql";
import { CourseCategory } from "@/types/types";

// Static menus for Menu2 and Menu3 remain unchanged.
const menuData2: MenuData = {
  title: "Menu 2",
  groups: [
    {
      header: "Header 1",
      items: [
        { label: "Link 2.1", link: "/link2-1" },
        { label: "Link 2.2", link: "/link2-2" },
        { label: "Link 2.3", link: "/link2-3" },
      ],
    },
    {
      header: "Header 2",
      items: [
        { label: "Link 2.4", link: "/link2-4" },
        { label: "Link 2.5", link: "/link2-5" },
        { label: "Link 2.6", link: "/link2-6" },
      ],
    },
  ],
};

const menuData3: MenuData = {
  title: "Menu 3",
  groups: [
    {
      header: "Header 1",
      items: [
        { label: "Link 3.1", link: "/link3-1" },
        { label: "Link 3.2", link: "/link3-2" },
        { label: "Link 3.3", link: "/link3-3" },
      ],
    },
    {
      header: "Header 2",
      items: [
        { label: "Link 3.4", link: "/link3-4" },
        { label: "Link 3.5", link: "/link3-5" },
        { label: "Link 3.6", link: "/link3-6" },
      ],
    },
  ],
};

// We keep a MenuData constant for Menu 1 only for its title;
// its groups will be built dynamically after data is loaded.
const menuData1: MenuData = {
  title: "Menu 1",
  groups: [] // initially empty; will be replaced by the dynamic course groups
};

export default function HeaderNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [courseCategories, setCourseCategories] = useState<CourseCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Theme effect (unchanged)
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (storedTheme === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark-theme");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark-theme");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark-theme", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // When toggling Menu1, fetch the course categories if not already loaded.
  const toggleMenu = (menuTitle: string) => {
    if (menuTitle === "Menu 1" && activeMenu !== menuTitle && courseCategories.length === 0) {
      fetchCourseCategories();
    }
    setActiveMenu(activeMenu === menuTitle ? null : menuTitle);
  };

  const closeAll = () => {
    setActiveMenu(null);
    setMenuOpen(false);
  };

  // Lazy-load course categories and their courses via GraphQL.
  const fetchCourseCategories = async () => {
    setIsLoadingCategories(true);
    const query = `
      query GetCourseCategories {
        courseCategories {
          id
          name
          slug
          courses {
            id
            title
            slug
          }
        }
      }
    `;
    try {
      const data = await fetchGraphQL<{ courseCategories: CourseCategory[] }>(query);
      setCourseCategories(data.courseCategories);
    } catch (error) {
      console.error("Error fetching course categories", error);
    }
    setIsLoadingCategories(false);
  };

  // Build dynamic groups: each course category becomes a header with its courses as items.
  const dynamicCourseGroups = courseCategories.map((category) => ({
    header: category.name,
    items: category.courses.map((course) => ({
      label: course.title,
      link: `/${course.slug}` // adjust link structure if needed
    })),
  }));

  // Create the combined MenuData for Menu1.
  const combinedMenuData1: MenuData = {
    title: menuData1.title,
    groups: dynamicCourseGroups
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 h-12 flex items-center justify-between px-4 z-[60]"
        style={{ backgroundColor: "var(--header-bg)" }}
      >
        <div className="flex items-center space-x-4">
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
          <nav className="hidden md:flex space-x-4">
            {/* Menu 1 */}
            <div className="relative">
              <button
                onClick={() => toggleMenu("Menu 1")}
                className="px-4 py-2 flex items-center"
              >
                <span>Menu 1</span>
                <span className="ml-1" style={{ fontSize: "0.6rem" }}>
                  {activeMenu === "Menu 1" ? "▲" : "▼"}
                </span>
              </button>
              {activeMenu === "Menu 1" && (
                isLoadingCategories ? (
                  <div className="p-4 bg-white shadow-xl">Loading...</div>
                ) : (
                  <DropdownMenu
                    menuData={combinedMenuData1}
                    isOpen
                    onClose={closeAll}
                  />
                )
              )}
            </div>

            {/* Menu 2 */}
            <div className="relative">
              <button
                onClick={() => toggleMenu(menuData2.title)}
                className="px-4 py-2 flex items-center"
              >
                <span>{menuData2.title}</span>
                <span className="ml-1" style={{ fontSize: "0.6rem" }}>
                  {activeMenu === menuData2.title ? "▲" : "▼"}
                </span>
              </button>
              {activeMenu === menuData2.title && (
                <DropdownMenu
                  menuData={menuData2}
                  isOpen
                  onClose={closeAll}
                />
              )}
            </div>

            {/* Menu 3 */}
            <div className="relative">
              <button
                onClick={() => toggleMenu(menuData3.title)}
                className="px-4 py-2 flex items-center"
              >
                <span>{menuData3.title}</span>
                <span className="ml-1" style={{ fontSize: "0.6rem" }}>
                  {activeMenu === menuData3.title ? "▲" : "▼"}
                </span>
              </button>
              {activeMenu === menuData3.title && (
                <DropdownMenu
                  menuData={menuData3}
                  isOpen
                  onClose={closeAll}
                />
              )}
            </div>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/" className="text-xl font-bold text-gray-800">
            LudoCode
          </Link>
          <nav className="flex space-x-4">
            <Link href="/courses" className="text-gray-600 hover:text-gray-800">
              Courses
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-800">
              Login
            </Link>
            <Link href="/signup" className="text-gray-600 hover:text-gray-800">
              Sign Up
            </Link>
          </nav>
          <button
            onClick={toggleTheme}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: theme === "light" ? "#2d2d2d" : "#f8f8f8",
            }}
          >
            {theme === "light" ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-800 absolute top-12 left-0 right-0 z-[9999]">
          <nav className="flex flex-col space-y-2 p-4">
            {/* Mobile Menu 1 */}
            <div>
              <button
                onClick={() => toggleMenu("Menu 1")}
                className="text-white text-left w-full px-4 py-2 flex justify-between items-center"
              >
                <span>Menu 1</span>
                <span style={{ fontSize: "0.5rem" }}>
                  {activeMenu === "Menu 1" ? "▲" : "▼"}
                </span>
              </button>
              {activeMenu === "Menu 1" && (
                isLoadingCategories ? (
                  <div className="p-4 bg-white">Loading...</div>
                ) : (
                  <DropdownMenu
                    menuData={combinedMenuData1}
                    isOpen
                    onClose={closeAll}
                    isMobile
                  />
                )
              )}
            </div>

            {/* Mobile Menu 2 */}
            <div>
              <button
                onClick={() => toggleMenu(menuData2.title)}
                className="text-white text-left w-full px-4 py-2 flex justify-between items-center"
              >
                <span>{menuData2.title}</span>
                <span style={{ fontSize: "0.5rem" }}>
                  {activeMenu === menuData2.title ? "▲" : "▼"}
                </span>
              </button>
              {activeMenu === menuData2.title && (
                <DropdownMenu
                  menuData={menuData2}
                  isOpen
                  onClose={closeAll}
                  isMobile
                />
              )}
            </div>

            {/* Mobile Menu 3 */}
            <div>
              <button
                onClick={() => toggleMenu(menuData3.title)}
                className="text-white text-left w-full px-4 py-2 flex justify-between items-center"
              >
                <span>{menuData3.title}</span>
                <span style={{ fontSize: "0.5rem" }}>
                  {activeMenu === menuData3.title ? "▲" : "▼"}
                </span>
              </button>
              {activeMenu === menuData3.title && (
                <DropdownMenu
                  menuData={menuData3}
                  isOpen
                  onClose={closeAll}
                  isMobile
                />
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
