// components/Menu1Dropdown.tsx
"use client";
import Link from "next/link";

const commonStyles = {
  bg: "bg-white",
  headerText: "text-gray-800",
  itemText: "text-gray-700",
  hoverBg: "hover:bg-gray-200",
};

const menuData = {
  title: "Menu 1",
  groups: [
    {
      header: "Python Basic",
      items: [
        { label: "Introduction", link: "/python/introduction" },
        { label: "Syntax", link: "/python/syntax" },
        { label: "Variables", link: "/python/variables" },
      ],
    },
    {
      header: "Pandas",
      items: [
        { label: "Intro", link: "/pandas/intro" },
        { label: "DataFrames", link: "/pandas/dataframes" },
        { label: "Series", link: "/pandas/series" },
      ],
    },
  ],
};

export default function MenuDropdown({
  isOpen,
  onClose,
  isMobile,
}: {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
}) {
  if (!isOpen) return null;

  return isMobile ? (
    <div className={`${commonStyles.bg} p-4`}>
      {menuData.groups.map((group, idx) => (
        <div key={idx} className="mb-4">
          <h3 className={`text-lg font-bold ${commonStyles.headerText}`}>
            {group.header}
          </h3>
          <ul>
            {group.items.map((item, jdx) => (
              <li key={jdx}>
                <Link
                  href={item.link}
                  className={`block ${commonStyles.itemText} py-1`}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ) : (
    <div
      className={`${commonStyles.bg} md:fixed md:top-[60px] md:left-0 md:w-full md:h-[calc(100vh-60px)] md:overflow-y-auto md:pt-10 md:px-4 md:pb-4 transition-opacity shadow-xl p-4 z-[9999]`}
    >
      <button
        onClick={onClose}
        className="hidden md:flex md:absolute md:top-2 md:right-2 bg-red-500 text-white font-bold rounded-full w-8 h-8 items-center justify-center hover:bg-red-600"
      >
        ×
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menuData.groups.map((group, idx) => (
          <div key={idx}>
            <h3
              className={`text-xl font-bold mb-2 ${commonStyles.headerText} uppercase tracking-wide`}
            >
              {group.header}
            </h3>
            <ul>
              {group.items.map((item, jdx) => (
                <li key={jdx}>
                  <Link
                    href={item.link}
                    className={`block ${commonStyles.itemText} py-1 px-2 rounded ${commonStyles.hoverBg} hover:shadow-sm`}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}