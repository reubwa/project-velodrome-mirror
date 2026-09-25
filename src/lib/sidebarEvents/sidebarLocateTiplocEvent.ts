import SidebarEvent from "../sidebarEvent";

// The sidebar requests to locate a particular TIPLOC on the map.
/**
 * The sidebar hints to move the canvas to focus on a particular TIPLOC.
 */
export default class SidebarLocateTiplocEvent extends SidebarEvent {
	/**
	 * Subject of event. Tiploc to focus upon.
	 */
	public readonly Target : string;

	public constructor(target : string) {
		super();
		this.Target = target;
	}

	public fmt(): string {
		return `Locate Tiploc: ${this.Target}`
	}
}