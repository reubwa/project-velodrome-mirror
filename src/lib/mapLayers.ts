// Defines enum type of "mapLayer" and provides translation table for each layer's discrete info.


/**
 * Enum containing separate map layers to serve on the main map.
 */
export const mapLayer = {
    Carto: "carto",
    HOT_Style: "hot_style",
}
export type mapLayer = typeof mapLayer[keyof typeof mapLayer];

/**
 * Converts `value` into data used to show map layer.
 * 
 * @returns URL and attribution associated with map.
 */
export function mapLayer_todata(value : mapLayer) : { url : string, attr : string } {
    switch (value) {
        case mapLayer.Carto:
            return {
                url : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                attr : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
        case mapLayer.HOT_Style:
            return {
                url : "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
                attr : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors (<a href="https://opendatacommons.org/licenses/odbl/">ODbL</a>)'
            }
        default:
            throw "Invalid mapLayer Type!";
    }
}
