import { useEffect, useRef, useState } from 'react';
import { Filter, Layers2, TriangleAlert } from 'lucide-react';
import { Circle, LayerGroup, MapContainer, Polyline, TileLayer, useMapEvent } from 'react-leaflet'
import { CircleMarker, FeatureGroup, LatLng, type LatLngExpression, type LatLngTuple, type Map } from 'leaflet';
import L, { Tooltip } from 'leaflet';
import { Switch } from './components/ui/switch';
import { Field, FieldContent, FieldGroup, FieldLabel, FieldTitle } from './components/ui/field';
import { Data } from './lib/innerDatabase';
import RightPanelMenu from './components/generic/RightPanelMenu';
import { TiplocSearchForm } from './components/filtermenu/TiplocSearchForm';
import { WrappedLeftSidebar } from './components/sidebar/Sidebar';
import { type TiplocData } from './lib/tiplocLoader';
import { Button } from './components/ui/button';
import TiplocSearchFormResult_ToFilter from './lib/filtermenu/tiplocSearchFormResult_toFilter';
import TiplocSearchResults from './components/filtermenu/TiplocSearchResults';
import { Clock } from './components/generic/Clock';
import { mapLayer, mapLayer_todata } from './lib/mapLayers';
import { Select, SelectContent, SelectLabel, SelectTrigger, SelectItem, SelectGroup, SelectValue } from './components/ui/select';
import SelectedTiplocOverlay from './components/map/SelectedTiplocOverlay';
import SidebarShowLineEvent from './lib/sidebarEvents/sidebarShowLineEvent';
import SidebarLocateTiplocEvent from './lib/sidebarEvents/sidebarLocateTiplocEvent';

function App() {
	const FargateCoords: LatLngExpression = [53.380852, -1.470092];

	const [BaseMapVisible, setBaseMapVisible] = useState(true);
	const [BaseMapLayer, setBaseMapLayer] = useState(mapLayer.HOT_Style);
	const BaseMapLayerData = mapLayer_todata(BaseMapLayer);
	const [OpenRailMapVisible, setOpenRailMapVisible] = useState(true);

	// Map state management.
	const [Map, setMap] = useState<null | Map>(null);
	const [MapZoom, setMapZoom] = useState<number>(1.0);
	const [TiplocLayer, setTipLocLayer] = useState<null | FeatureGroup>(null);
	const [TiplocLayerCanvas, setTipLocLayerCanvas] = useState<null | L.Canvas>(null);


	const [TiplocVisible, setTipLocVisible] = useState(true);
	const [SelectedTiploc, setSelectedTiploc] = useState<TiplocData | null>(null);
	const SelectedTiplocActivePos: LatLngTuple | null = SelectedTiploc ? [SelectedTiploc.Latitude, SelectedTiploc.Longitude] : null;

	const [DrawLinePoints, setDrawLinePoints] = useState<LatLngExpression[]>([]);

	const tiplocColor = "#F00";
	const journeyLineColor = "#006affff";
	const journeyPointColor = "white";
	const defaultTiplocRadius = 9;
	const defaultTiplocThickness = 3;
	const initialMapZoom = 13;
	const tiplocRadius = useRef<number>(defaultTiplocRadius);
	const tiplocThickness = useRef<number>(defaultTiplocThickness);

	// State variables related to tiploc filtering menu
	const [TiplocFilter, setTiplocFilter] = useState({});
	const [VisibleTiplocsQuantity, setVisibleTiplocsQuantity] = useState(0);

	function RegenerateTiplocLayer() {
		// We also need a mutable map.
		if (!Map) { console.log("Waiting for map..."); return; }
		const mut_Map = Map!;

		// We also need a mutable tiploc layer.
		const mut_TiplocLayer =
			// If the tiploc layer exists, destroy it fully before continuing.
			TiplocLayer?.remove().clearLayers()
			// and if the tiploc layer doesn't exist, create it;
			?? L.featureGroup();

		// We also-also need a new canvas.
		TiplocLayerCanvas?.remove();
		const canvas = L.canvas({ padding: 0.5 });

		// Collect environment.
		const filter = TiplocFilter;
		Data.ForAllMatchingTiplocs(v => {
			TiplocData_CircleMarker(v, canvas).addTo(mut_TiplocLayer);
		}, filter).then(v => { setVisibleTiplocsQuantity(v); });

		// Add the live layer to the map.
		mut_TiplocLayer.addTo(mut_Map);

		// Assign the TiplocLayer and canvas the value of our mutable versions.
		setTipLocLayer(mut_TiplocLayer);
		setTipLocLayerCanvas(canvas);
	}

	function TiplocData_CircleMarker(tdata: TiplocData, canvas: L.Canvas): CircleMarker {
		return L.circleMarker([tdata.Latitude, tdata.Longitude], {
			renderer: canvas,
			color: tiplocColor,
			radius: tiplocRadius.current,
			weight: tiplocThickness.current,
			bubblingMouseEvents: false
		}).bindTooltip(new Tooltip({
			direction: "top",
			content: `<span class="flex flex-col"><h3 class='h3'>${tdata.Tiploc}</h3><p class='italic'>${tdata.Name}</p></span>`,
			className: "tiplocTooltip"
		})).on("click", async () => {
			const thisTiploc = await Data.GetTiploc(tdata.Tiploc);

			if (!thisTiploc) return; // This should likely never happen
			setSelectedTiploc(thisTiploc);
		})
	}

	function ToggleTiplocLayer() {
		if (!Map) return; // I'm not sure what would happen if Map were null, so I just exit this method early.
		if (TiplocVisible) {
			TiplocLayer?.remove();
			setTipLocVisible(false);
		} else {
			TiplocLayer?.addTo(Map);
			setTipLocVisible(true);
		}
	}

	// An effect reacts to Map getting bound upon initialization in order to draw the TIPLOC points upon it.
	useEffect(
		RegenerateTiplocLayer,
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[Map, TiplocFilter]
	)

	function ScaleTiplocs(tiplocLayer: FeatureGroup | null, radius: number) {
		if (!tiplocLayer) return;
		tiplocRadius.current = radius;
		tiplocLayer.eachLayer(layer => {
			if (layer instanceof CircleMarker) layer.setRadius(tiplocRadius.current);
		})
	}

	function CalcTiplocScale(currZoom: number): number {
		// Formulaically scale markers with a min radius clamp
		const scaleFactor = 1.2;
		const minRadius = 1;
		return Math.max(minRadius, scaleFactor * (currZoom - initialMapZoom) + defaultTiplocRadius);
	}

	// Handler for direct map interactions
	function MapClick() {
		useMapEvent("click", () => 
			// Reset marker selection when clicking in an empty spot on the map
			setSelectedTiploc(null)
		);

		useMapEvent("zoom", () => {
			if (!Map) return;

			const currZoom = Map.getZoom();
			// Manage TIPLOC view layer.
			ScaleTiplocs(TiplocLayer, CalcTiplocScale(currZoom));

			const priorThickness = tiplocThickness.current;
			if (currZoom >= 11) {
				tiplocThickness.current = 3;
			} else if (currZoom < 9) {
				tiplocThickness.current = 1;
			}
			else if (currZoom < 11) {
				tiplocThickness.current = 2;
			}
			if (tiplocThickness.current != priorThickness) TiplocLayer?.setStyle({ weight: tiplocThickness.current });

			// Assign zoom value.
			setMapZoom(currZoom);
		})
		return null;
	}

	/**
	 * Pans map to supplied TIPLOC id.
	 */
	async function MapFocusTiploc(target : string) {
		if (!Map) return;

		// Collect TIPLOC data
		const tiploc = await Data.GetTiploc(target);
		if (!tiploc) {
			console.error(`Tried to focus map on tiploc that does not exist: ${target}`);
			return;
		}
		// Convert position
		const where : LatLngExpression = [tiploc.Latitude, tiploc.Longitude];
		// Pan map
		Map.panTo(where);
	}

	// Focus the map on the selected TIPLOC if it changes.
	useEffect(()=>{if (SelectedTiploc) MapFocusTiploc(SelectedTiploc.Tiploc);}, [SelectedTiploc]);

	/**
	 * Consumes sidebar events and routes them accordingly.
	 * 
	 * `event` is of type SidebarEvent.
	 */
	function ConsumeSidebarEvent(event: object) {
		if (event instanceof SidebarShowLineEvent) {
			if (event.Points) {
				// The line should be shown on map.
				setDrawLinePoints(
					event.Points.map(v => {
						return new LatLng(v.lat, v.long);
					})
				);
			}
			else {
				// The line should be hidden from the map and removed.
				setDrawLinePoints([]);
			}
		}
		else if (event instanceof SidebarLocateTiplocEvent) {
			MapFocusTiploc(event.Target);
		}
	}

	return (
		<>
			<div className='grid h-full overflow-hidden'>
				<div className='col-start-1 row-start-1 h-full'>
					<MapContainer center={FargateCoords} zoom={initialMapZoom} ref={setMap}>
						<TileLayer
							attribution={BaseMapLayerData.attr}
							url={BaseMapLayerData.url}
							opacity={BaseMapVisible ? 100 : 0}
						/>
						<TileLayer
							attribution='<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA 2.0</a> <a href="http://www.openrailwaymap.org/">OpenRailwayMap</a>'
							url='https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png'
							opacity={OpenRailMapVisible ? 100 : 0}
						/>
						<SelectedTiplocOverlay position={SelectedTiplocActivePos} />
						{/* Layer describing overlaid graphics on main map for TIPLOC line.  */}
						<LayerGroup>
							{
								DrawLinePoints.map(v => {
									const radius = ((2 ** -(MapZoom - 14)) * 16);
									return (
										<Circle
											key={v.toString()}
											interactive={false}
											center={v}
											radius={radius}
											stroke={false}
											color={journeyPointColor}
											fill={true}
											fillOpacity={100.0}
											fillColor={journeyPointColor}
										/>
									)
								})
							}
							<Polyline
								interactive={false}
								pathOptions={{ color: journeyLineColor, weight: 12.0, opacity: 0.9 }}
								positions={DrawLinePoints}
							/>
						</LayerGroup>
						<MapClick />
					</MapContainer>
				</div>

				{/* HTML overlay widgets */}
				<div className='
				col-start-1 row-start-1 z-1000 pointer-events-none
				flex flex-col overflow-hidden
				'>
					<header className='w-full min-h-16 flex gap-4 place-items-start place-content-center place-content-center'>
						<Clock />
					</header>
					<article className='w-full flex-1 min-h-0 flex flex'>
						<div className='h-full flex items-center'>
							<WrappedLeftSidebar tiploc={SelectedTiploc} onEvent={ConsumeSidebarEvent} />
						</div>
						<div className='w-full h-full'></div>
						<div className='h-full flex flex-col gap-8 items-end place-content-end'>
							{/* Filtering menu */}
							<RightPanelMenu title="TIPLOC Filtering" raiseButtonContent={<Filter className='size-8' />} articleClass="flex flex-col gap-4 overflow-y-auto">
								{!TiplocVisible ? (
									<Button variant="destructive" className='max-w-full h-fit' onClick={() => { ToggleTiplocLayer() }}>
										<TriangleAlert />
										<p className='p-2 text-left text-wrap whitespace-wrap'>The TIPLOC layer is currently disabled; you won't see changes on the map. Click here to enable it.</p>
									</Button>
								) : null}

								<TiplocSearchForm onSubmit={v => { setTiplocFilter(TiplocSearchFormResult_ToFilter(v)); }} />

								<hr />

								<div className="
								border-border dark:bg-input/30
								flex flex-row justify-between
								">
									<h3 className="h3">Results</h3>
									<p className='typo-subtle'>Showing {VisibleTiplocsQuantity} TIPLOCs</p>
								</div>

								<TiplocSearchResults query={TiplocFilter} onClick={v => Data.GetTiploc(v).then(v => setSelectedTiploc(v))} />
							</RightPanelMenu>

							{/* Map layers menu */}
							<RightPanelMenu title="Map Layers" raiseButtonContent={<Layers2 className='size-8' />}>
								<div className='flex flex-row h-full overflow-hidden'>
									<div className='flex flex-col place-items-start justify-between p-2'>
										<p className="[writing-mode:vertical-lr]">Higher</p>
										<p className="[writing-mode:vertical-lr]">Lower</p>
									</div>

									<FieldGroup className="w-full max-w-sm overflow-y-auto overflow-x-hidden">
										<FieldLabel>
											<Field orientation='horizontal'>
												<FieldContent>
													<FieldTitle>TIPLOCs</FieldTitle>
												</FieldContent>
												<Switch checked={TiplocVisible} onCheckedChange={() => ToggleTiplocLayer()} />
											</Field>
										</FieldLabel>

										<FieldLabel>
											<Field orientation='horizontal'>
												<FieldContent>
													<FieldTitle>OpenRailMap</FieldTitle>
												</FieldContent>
												<Switch checked={OpenRailMapVisible} onCheckedChange={setOpenRailMapVisible} />
											</Field>
										</FieldLabel>

										<FieldLabel>
											<Field orientation='horizontal'>
												<FieldContent>
													<FieldTitle>OpenStreetMap</FieldTitle>
												</FieldContent>
												<Switch checked={BaseMapVisible} onCheckedChange={setBaseMapVisible} />
											</Field>
											<Field orientation="horizontal" className='bg-white rounded-b-md' hidden={!BaseMapVisible}>
												<FieldLabel>
													Theme:
												</FieldLabel>
												<Select value={BaseMapLayer} onValueChange={setBaseMapLayer}>
													<SelectTrigger>
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														<SelectGroup>
															<SelectLabel>Layers</SelectLabel>
															<SelectItem value={mapLayer.Carto}>OpenStreetMap Carto</SelectItem>
															<SelectItem value={mapLayer.HOT_Style}>OpenStreetMap HOT Style</SelectItem>
														</SelectGroup>
													</SelectContent>
												</Select>
											</Field>
										</FieldLabel>
									</FieldGroup>
								</div>
							</RightPanelMenu>

						</div>
					</article>
					<div className="col-start-1 row-start-1 z-1000 pointer-events-none flex flex-col">
						<footer className="w-full min-h-16"></footer>
					</div>
				</div>
			</div>
		</>
	)

}

export default App
