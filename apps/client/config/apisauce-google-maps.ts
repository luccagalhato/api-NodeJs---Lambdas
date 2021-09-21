import { HttpException } from "@nestjs/common";
import { create } from "apisauce";
import { getAWSSecret } from "../../shared/aws";

const autocomplete = "autocomplete";
const details = "details";
const geocode = "geocode";
const place = "place";

const collaboratorApi = create({
  baseURL: `https://maps.googleapis.com/maps/api`,
});

const GOOGLE_API_SECRET_ARN = process.env.GOOGLE_API_SECRET_ARN;

export const getLocation = async (address: string) => {
  const GOOGLE_API_TOKEN: any = await getAWSSecret(GOOGLE_API_SECRET_ARN);
  const jsonApiToken = `json?key=${GOOGLE_API_TOKEN.GoogleMapsAPIToken}`;

  const queryParams = {
    libraries: "geometry",
    componentRestrictions: { country: "br" },
    input: `${address} Brasil`,
    language: "pt_BR",
  };
  const resp = await collaboratorApi.get<any>(
    `/${place}/${autocomplete}/${jsonApiToken}`,
    queryParams
  );

  if (resp.ok) return resp.data.predictions;

  throw new HttpException("Error", 500);
};

export const getFullGoogleAddressByPlaceId = async (place_id: string) => {
  const GOOGLE_API_TOKEN: any = await getAWSSecret(GOOGLE_API_SECRET_ARN);
  const jsonApiToken = `json?key=${GOOGLE_API_TOKEN.GoogleMapsAPIToken}`;

  const queryParams = {
    libraries: "geometry",
    componentRestrictions: { country: "br" },
    place_id,
    language: "pt_BR",
  };

  const resp = await collaboratorApi.get<any>(
    `/${place}/${details}/${jsonApiToken}`,
    queryParams
  );

  if (resp.ok) return resp.data.result;

  throw new HttpException("Error", 500);
};

export const getFullGoogleAddressByLatLng = async (
  lat: number,
  lng: number
) => {
  try {
    const GOOGLE_API_TOKEN: any = await getAWSSecret(GOOGLE_API_SECRET_ARN);
    const jsonApiToken = `json?key=${GOOGLE_API_TOKEN.GoogleMapsAPIToken}`;

    const resp = await collaboratorApi.get<any>(
      `/${geocode}/${jsonApiToken}&latlng=${lat},${lng}`
    );
    console.error(resp);
    if (resp.ok) return resp.data.results[0];
  } catch (error) {
    console.error(error);
    throw new HttpException("Error", 500);
  }
};
