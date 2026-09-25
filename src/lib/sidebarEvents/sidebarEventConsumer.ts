import SidebarEvent from "../sidebarEvent";

/**
 * A function that handles sidebar events produced at any depth of th Sidebar.
 */
export type SidebarEventConsumer = (v : SidebarEvent) => void; 