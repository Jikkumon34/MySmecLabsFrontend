// navLinks.ts
export type NavLink = {
    label: string;
    icon: string;
    href: string;
  };
  
  export const roleNavLinks: { [key: string]: NavLink[] } = {
    student: [
      { label: "Dashboard", icon: "dashboard", href: "/student/dashboard" },
    
      // Academic
      { label: "Courses", icon: "school", href: "/student/courses" },
      { label: "Syllabus", icon: "menu_book", href: "/student/syllabus" },
      { label: "Assignments", icon: "assignment", href: "/student/assignments" },
    
      // Tools & Resources
      { label: "Library", icon: "local_library", href: "/student/library" },
      { label: "Resources", icon: "folder", href: "/student/resources" },
      { label: "Calendar", icon: "calendar_today", href: "/student/calendar" },
    
      // People
      { label: "Staff", icon: "people", href: "/student/staff" },
    
      // Performance
      // { label: "Grades", icon: "grade", href: "/student/grades" },
    
      // Personal
      { label: "Profile", icon: "people", href: "/student/profile" },
    ],
    admin: [
      { label: "Dashboard", icon: "dashboard", href: "/admin/dashboard" },
      { label: "User Management", icon: "people", href: "/admin/users" },
      { label: "Reports", icon: "bar_chart", href: "/admin/reports" },
      { label: "Settings", icon: "settings", href: "/admin/settings" },
    ],
    staff: [
      { label: "Dashboard", icon: "dashboard", href: "/staff/dashboard" },
      { label: "Courses", icon: "school", href: "/staff/courses" },
      { label: "Students", icon: "group", href: "/staff/students" },
      { label: "Timetable", icon: "schedule", href: "/staff/timetable" },
    ],
  };
  