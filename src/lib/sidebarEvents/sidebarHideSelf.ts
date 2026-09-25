import SidebarEvent from "../sidebarEvent";

/**
 * Request the sidebar hide itself.
 */
export default class SidebarHideSelf extends SidebarEvent {
    public fmt(): string {
        return "Hide sidebar";
    }
}