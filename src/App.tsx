import ReactMapGL, { NavigationControl } from "react-map-gl";
import { MAPBOX_TOKEN } from "./env";
import { buildMapboxURI } from "./utils";
import { baseLayers, baseSources } from "./utils/map/styles";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

const mapStyle = {
  version: 8,
  glyphs: buildMapboxURI(
    "/fonts/v1/permettez-moi-de-construire/{fontstack}/{range}.pbf"
  ).toString(),
  metadata: {
    "mapbox:autocomposite": true,
    "mapbox:type": "template"
  },
  sources: {
    "mapbox-raster": baseSources["mapbox-raster"],
    "ign-raster": baseSources["ign-raster"],
    "koumoul-cadastre": baseSources["koumoul-cadastre"]
  },
  layers: [...baseLayers],
  sprite: "mapbox://styles/mapbox/satellite-v9"
};

function App() {
  const initialViewport = {
    latitude: 48.868992,
    longitude: 2.310128,
    zoom: 16,
    maxZoom: 20
  };

  return (
    <div className="App">
      <h1>Demo</h1>
      <div className="MapContainer">
        <ReactMapGL
          initialViewState={{ ...initialViewport }}
          mapboxAccessToken={MAPBOX_TOKEN as string}
          mapStyle={mapStyle as any}
          attributionControl={true}
        >
          <NavigationControl position="top-right" />
        </ReactMapGL>
      </div>
    </div>
  );
}

export default App;
