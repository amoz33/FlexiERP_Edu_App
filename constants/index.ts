// Colors
export const GOLD = "#C9A020";
export const GOLD_LIGHT = "#E8C547";
export const GOLD_DIM = "#9B7A18";
export const BLACK = "#0D0D0D";
export const SURFACE = "#161616";
export const BORDER = "#E8E4DC";
export const TEXT = "#0D0D0D";
export const TEXT2 = "#5C5750";
export const TEXT3 = "#9B9590";
export const GREEN = "#1D9E75";
export const RED = "#E24B4A";
export const BLUE = "#378ADD";

// Navigation
export const STUDENT_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
  { id: "projects", label: "Projects", icon: "ClipboardList", href: "/projects" },
  { id: "subjects", label: "Subjects & Scores", icon: "BookOpen", href: "/subjects" },
  { id: "fees", label: "School Fees", icon: "Banknote", href: "/fees" },
  { id: "attendance", label: "Attendance", icon: "CalendarCheck", href: "/attendance" },
  { id: "report-card", label: "Report Card", icon: "FileText", href: "/report-card" },
];

export const PARENT_NAV = [
  { id: "switch", label: "My Children", icon: "Users", href: "/switch" },
  { id: "notifications", label: "Notifications", icon: "Bell", href: "/notifications" },
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard", href: "/dashboard" },
  { id: "subjects", label: "Subjects & Scores", icon: "BookOpen", href: "/subjects" },
  { id: "fees", label: "School Fees", icon: "Banknote", href: "/fees" },
  { id: "attendance", label: "Attendance", icon: "CalendarCheck", href: "/attendance" },
  { id: "report-card", label: "Report Card", icon: "FileText", href: "/report-card" },
];

// Helper function
export function getGrade(score: number) {
  if (score >= 75) return { grade: "A1", label: "Excellent", color: GOLD };
  if (score >= 70) return { grade: "B2", label: "Very Good", color: GREEN };
  if (score >= 65) return { grade: "B3", label: "Good", color: GREEN };
  if (score >= 60) return { grade: "C4", label: "Credit", color: BLUE };
  if (score >= 55) return { grade: "C5", label: "Credit", color: BLUE };
  if (score >= 50) return { grade: "C6", label: "Credit", color: BLUE };
  if (score >= 45) return { grade: "D7", label: "Pass", color: "#E8A020" };
  if (score >= 40) return { grade: "E8", label: "Pass", color: "#E8A020" };
  return { grade: "F9", label: "Fail", color: RED };
}
