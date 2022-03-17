import { useState } from "react";
import ReactMapGL, { Layer, NavigationControl, Source } from "react-map-gl";
import data from "./data/data.json";
import { MAPBOX_TOKEN } from "./env";
import { buildMapboxURI } from "./utils";
import cadastersStyle from "./utils/map/cadasters.json";
import mapboxStreetStyle from "./utils/map/mapbox-bright-v9.json";
import { baseLayers, baseSources } from "./utils/map/styles";
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
    ...mapBaseStyle.sources,
    "mapbox-raster": baseSources["mapbox-raster"]
  },
  layers: [...baseLayers, ...mapBaseStyle.layers]
};

const mapStreetsStyle = {
  id: "streets",
  ...mapBaseStyle,
  metadata: {
    ...mapBaseStyle.metadata,
    ...mapboxStreetStyle.metadata
  },
  sources: {
    ...mapBaseStyle.sources,
    mapbox: mapboxStreetStyle.sources.mapbox
  },
  layers: [...mapboxStreetStyle.layers, ...mapBaseStyle.layers]
};

function App() {
  const data1 = data[0];
  const dataPointArray = data1.geo_point_2d.split(",");
  const dataPoint = {
    latitude: Number(dataPointArray[0]),
    longitude: Number(dataPointArray[1])
  };

  const geoShape = JSON.parse(data1.geo_shape);

  const layerLineProps = {
    id: "map__parcel__layer__line__id",
    type: "line",
    paint: {
      "line-color": "#000",
      "line-width": 3,
      "line-color-transition": { duration: 1 },
      "line-width-transition": { duration: 1 }
    }
  };

  const layerFillProps = {
    id: "map__parcel__layer__fill__id",
    type: "fill",
    paint: { "fill-color": "#fff", "fill-opacity": 0.5 }
  };

  const initialViewport = {
    latitude: dataPoint.latitude || 48.868992,
    longitude: dataPoint.longitude || 2.310128,
    zoom: 13.5,
    maxZoom: 20
  };

  let initialMapStyle = localStorage.getItem("__map_style__");
  initialMapStyle = initialMapStyle ? JSON.parse(initialMapStyle) : mapSatelliteStyle;

  const [mapStyle, updateMapStyle] = useState<any>(mapSatelliteStyle);

  const toggleStyle = () => {
    updateMapStyle((prev: any) => {
      const newStyle = prev.id === "satellite" ? mapStreetsStyle : mapSatelliteStyle;
      localStorage.setItem("__map_style__", JSON.stringify(newStyle));
      return newStyle;
    });
  };

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
          initialViewState={{ ...initialViewport }}
          mapboxAccessToken={MAPBOX_TOKEN as string}
          mapStyle={mapStyle}
          attributionControl={true}
        >
          <NavigationControl position="top-right" />
          <Source type="geojson" data={geoShape}>
            <Layer {...(layerLineProps as any)} />
            <Layer {...(layerFillProps as any)} />
          </Source>
        </ReactMapGL>
      </div>
    </div>
  );
}

export default App;
