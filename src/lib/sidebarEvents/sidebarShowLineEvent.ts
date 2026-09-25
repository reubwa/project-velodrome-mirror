import SidebarEvent from "../sidebarEvent";

/**
 * The sidebar hints to draw a line of points on the map.
 */
export default class SidebarShowLineEvent extends SidebarEvent {
	/**
	 * Points referenced by event. A line should be drawn through these points in this sequence.
	 */
	public readonly Points: { lat: number, long: number }[] | null;

	public constructor(points: { lat: number, long: number }[] | null) {
		super();
		this.Points = points;
	}

	public fmt(): string {
		if (!this.Points) return `Hide Line`;
		return `Show Line:\n${this.Points.map(v => `(${v.lat}, ${v.long}),\n` )}`;
	}
}