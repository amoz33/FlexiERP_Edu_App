// Barrel re-export. This file used to contain all 9 portal view
// components directly (1229 LOC, a flagged "god file") - they're now
// split into components/portal/views/*.tsx, one component per file.
// Kept as a re-export so nothing importing from './PortalViews'
// elsewhere in the app needs to change.
export { Dashboard } from './views/Dashboard'
export { Subjects } from './views/Subjects'
export { Fees } from './views/Fees'
export { Attendance } from './views/Attendance'
export { ReportCard } from './views/ReportCard'
export { ParentNotifications } from './views/ParentNotifications'
export { StudentProjects } from './views/StudentProjects'
export { ParentSwitch } from './views/ParentSwitch'
