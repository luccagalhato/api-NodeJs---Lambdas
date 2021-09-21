import { Collaborator } from "../../../shared/interfaces";

export const handlerCreateCollaboratorGeoData = (data: Collaborator) => {
  const id = Date.now();
  return {
    RangeKeyValue: { S: id.toString() },
    geoKey: { S: id.toString() },
    GeoPoint: makeGeoPoint(data),
    PutItemInput: { Item: handlerCollaboratorSchema(data) },
  };
};

export const makeGeoPoint = (data) => ({
  latitude: data.latitude,
  longitude: data.longitude,
});

export const handlerCollaboratorSchema = (data): any => {
  const geoData = {
    id: { S: data.id },
    is_available: { BOOL: data.is_available },
    is_online: { BOOL: data.is_online },
    radius: { N: data.radius.toString() },
    contact: {
      M: {
        email: { S: data.contact.email },
        phone: { S: data.contact.phone },
      },
    },
    first_name: { S: data.first_name },
    last_name: { S: data.last_name },
    createdAt: { N: Date.now().toString() },
    updatedAt: { N: Date.now().toString() },
  };
  return geoData;
};
