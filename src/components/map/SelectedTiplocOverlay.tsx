import { Icon, type IconOptions, type LatLngTuple } from "leaflet";
import { LayerGroup, Marker } from "react-leaflet";

export default function SelectedTiplocOverlay({ position = null, ...props }: { position?: LatLngTuple | null, radius?: number }) {
	const center = position ?? [0.0, 0.0];

	const icon : IconOptions = {
		iconUrl : "tiplocMarker.svg",
		iconAnchor:  [20.0, 20.0]
	}

	return (
		<LayerGroup>
			<Marker interactive={false} icon={new Icon(icon)} position={center} {...props}/>
		</LayerGroup>
	);
}