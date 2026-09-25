// State enum definition for sidebar.
export type SidebarSwitch = typeof SidebarSwitch[keyof typeof SidebarSwitch];

export const SidebarSwitch = {
	Tiploc: "Tiploc",
	Departures: "Departures",
	Journey: "Journey",
	NotSelected: "Not Selected",
}