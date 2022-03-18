import { useEffect, useState } from "react";
import ReactMapGL, {
  FlyToInterpolator,
  Layer,
  NavigationControl,
  Source,
  ViewportProps,
  TRANSITION_EVENTS
} from "react-map-gl";
import { MAPBOX_TOKEN } from "./env";
import { buildMapboxURI } from "./utils";
import cadastersStyle from "./utils/map/cadasters.json";
import mapboxStreetStyle from "./utils/map/mapbox-bright-v9.json";
import { baseLayers, baseSources } from "./utils/map/styles";
import * as d3 from "d3-ease";
import "./App.css";
import "mapbox-gl/dist/mapbox-gl.css";

const mapBaseStyle = {
  version: 8,
  glyphs: buildMapboxURI(
    "/fonts/v1/permettez-moi-de-construire/{fontstack}/{range}.pbf"
  ).toString(),
  metadata: {
    "mapbox:autocomposite": true,
    "mapbox:type": "template"
  },
  sources: {
    // "mapbox-raster": baseSources["mapbox-raster"],
    // "ign-raster": baseSources["ign-raster"],
    // "koumoul-cadastre": baseSources["koumoul-cadastre"],
    // mapbox: mapboxStreetStyle.sources.mapbox,
    "koumoul-cadastre": cadastersStyle.sources["koumoul-cadastre"]
  },
  layers: [...cadastersStyle.layers]
  // layers: [...baseLayers, ...mapboxStreetStyle.layers, ...cadastersStyle.layers],
};

const mapSatelliteStyle = {
  id: "satellite",
  ...mapBaseStyle,
  sources: {
    // ...mapBaseStyle.sources,
    "mapbox-raster": baseSources["mapbox-raster"]
  },
  layers: [
    ...baseLayers
    //  ...mapBaseStyle.layers
  ]
};

const mapStreetsStyle = {
  id: "streets",
  ...mapBaseStyle,
  metadata: {
    ...mapBaseStyle.metadata,
    ...mapboxStreetStyle.metadata
  },
  sources: {
    // ...mapBaseStyle.sources,
    mapbox: mapboxStreetStyle.sources.mapbox
  },
  layers: [
    ...mapboxStreetStyle.layers
    // ...mapBaseStyle.layers
  ]
};

const layerLineProps = {
  id: "map__layer__line__id",
  type: "line",
  paint: {
    "line-color": "#000",
    "line-width": 3
  }
};

const layerFillProps = {
  id: "map__layer__fill__id",
  type: "fill",
  paint: { "fill-color": "#fff", "fill-opacity": 0.5 }
};

const initialViewportZoomOptions: ViewportProps = {
  transitionDuration: 3000,
  transitionInterruption: TRANSITION_EVENTS.UPDATE,
  transitionInterpolator: new FlyToInterpolator({ speed: 1.2 }),
  transitionEasing: d3.easeCubic
};

function App() {
  let initialMapStyle = localStorage.getItem("__map_style__");
  initialMapStyle = initialMapStyle ? JSON.parse(initialMapStyle) : mapSatelliteStyle;

  const initialViewport: ViewportProps = {
    latitude: 48.868992,
    longitude: 2.310128,
    zoom: 12,
    maxZoom: 20,
    ...initialViewportZoomOptions
  };

  const [mapStyle, updateMapStyle] = useState<any>(mapStreetsStyle);
  const [point, updatePoint] = useState<any>(null);
  const [viewport, setViewport] = useState<ViewportProps>(initialViewport);

  const toggleStyle = () => {
    updateMapStyle((prev: any) => {
      const newStyle = prev.id === "satellite" ? mapStreetsStyle : mapSatelliteStyle;
      localStorage.setItem("__map_style__", JSON.stringify(newStyle));
      return newStyle;
    });
  };

  useEffect(() => {
    fetch(
      "https://geo.api.gouv.fr/communes/19275?fields=nom,code,centre,contour&format=json&geometry=contour"
    ).then((res) =>
      res.json().then((data) => {
        updatePoint(data);
      })
    );
  }, []);

  useEffect(() => {
    if (point) {
      const latitude = point.centre.coordinates[1];
      const longitude = point.centre.coordinates[0];
      setViewport((prev) => ({
        ...prev,
        latitude,
        longitude
      }));
    }
  }, [point]);

  return (
    <div className="App">
      <div className="Header">
        <h1>Demo Mapbox Koumoul</h1>
        <button className="Btn" onClick={toggleStyle}>
          Switch Style
        </button>
      </div>
      <div className="MapContainer">
        <ReactMapGL
          {...viewport}
          mapboxApiAccessToken={MAPBOX_TOKEN as string}
          attributionControl={true}
          onViewportChange={(nextViewport: ViewportProps) => setViewport(nextViewport)}
          // mapStyle={mapStyle}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          <NavigationControl />
          {point && (
            <Source type="geojson" data={point.contour}>
              <Layer {...(layerLineProps as any)} />
              <Layer {...(layerFillProps as any)} />
            </Source>
          )}
        </ReactMapGL>
      </div>
    </div>
  );
}

export default App;
