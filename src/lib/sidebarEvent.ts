/**
 * Emitted by Sidebar upon an event occurring internally, like requesting an external resource to refresh.
 * 
 * Performs message passing from deeper systems within the left Sidebar.
 */
export default abstract class SidebarEvent {
	/**
	 * Format sidebar event to string.
	 */
	public abstract fmt() : string;
}