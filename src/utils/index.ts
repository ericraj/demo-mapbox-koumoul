import { MAPBOX_BASE_URL, MAPBOX_TOKEN } from "../env";
import URI from "urijs";

interface Params {
  [key: string]: unknown;
}

export const buildMapboxURI = (path: string, params: Params = {}) => {
  return URI(`${MAPBOX_BASE_URL}${path}`).search({
    ...params,
    access_token: MAPBOX_TOKEN
  });
};
