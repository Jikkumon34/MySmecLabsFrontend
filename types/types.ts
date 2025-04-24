export interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    topics?: Topic[];
  }
  
   export interface TopicHeadersType {
    id: string;
    title: string;
    topics: Topic[];
  
  }
  export interface Topic {
    id: string;
    title: string;
    slug: string;
    children:Topic[];
  }
  // types/menu.ts
export interface MenuItem {
  label: string;
  link: string;
}

export interface MenuGroup {
  header: string;
  items: MenuItem[];
}

export interface MenuData {
  title: string;
  groups: MenuGroup[];
}

export interface CourseCategory {
  id: string;
  name: string;
  slug: string;
  courses: Course[];
}