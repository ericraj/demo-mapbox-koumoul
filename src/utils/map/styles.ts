import { omit } from "lodash";
import { KOUMOUL_TOKEN, MAPBOX_TOKEN } from "../../env";

const sources = {
  mapboxRaster: {
    id: "mapbox-raster",
    type: "raster",
    tiles: ["a", "b"].map(
      (srv) =>
        `https://${srv}.tiles.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.png?access_token=${MAPBOX_TOKEN}`
    ),
    tileSize: 256,
    maxZoom: 20
  },
  ignRaster: {
    id: "ign-raster",
    type: "raster",
    tiles: [
      `https://wxs.ign.fr/ortho/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=normal&TILEMATRIXSET=PM&FORMAT=image/jpeg&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`
    ],
    tileSize: 256,
    maxZoom: 20
  },
  koumoulCadastre: {
    id: "koumoul-cadastre",
    type: "raster",
    tiles: [
      `https://koumoul.com/s/tileserver/styles/cadastre/{z}/{x}/{y}.jpg?apiKey=${KOUMOUL_TOKEN}`
    ],
    tileSize: 256,
    maxZoom: 20
  }
};

const layers = {
  backgroundTilesFallback: {
    id: "background-tiles-fallback",
    type: "raster",
    source: sources.mapboxRaster.id
  }
  // backgroundTiles: {
  //   id: "background-tiles",
  //   type: "raster",
  //   source: sources.ignRaster.id
  // }
  // backgroundCadastre: {
  //   id: "background-cadastre",
  //   type: "raster",
  //   source: sources.koumoulCadastre.id
  // }
};

const formattedLayers = Object.values(layers);

const formattedSources: { [key: string]: unknown } = Object.values(sources).reduce(
  (acc, source) => ({
    ...acc,
    [source.id]: omit(source, "id")
  }),
  {}
);

export { formattedSources as baseSources, formattedLayers as baseLayers };
