import { collaboratorGeoTableManager } from "../../../../config/database/geo-config";
import { convertDynamoDataToObject } from "../../../shared/aws";
import { ClosestCollaborator, Collaborator } from "../../../shared/interfaces";
import { isEmpty } from "lodash";
import { distanceTo } from "geolocation-utils";

export const simpleSortArrayByField = (first, second, field) => {
  if (first[`${field}`] < second[`${field}`]) return -1;
  if (first[`${field}`] > second[`${field}`]) return 1;
  return 0;
};

export const calcDistanceAvailableCollaborator = (
  collaborator: Collaborator,
  partnerLatitude: number,
  partnerLongitude: number
): ClosestCollaborator => {
  const [lat, lon] = JSON.parse(collaborator.geoJson).coordinates;
  const parnerLatLon = { lat: partnerLatitude, lon: partnerLongitude };

  const distance = Math.round(distanceTo({ lat, lon }, parnerLatLon));

  // Checks if collaborator has able to delivery in specified area
  if (distance <= collaborator.radius) {
    // Push on result array to finish loop (while)
    return {
      ...collaborator,
      distance,
      latitude: lat,
      longitude: lon,
    };
  }
};

export const findClosestCollaborator = async (
  partnerLatitude,
  partnerLongitude,
  is_available
): Promise<ClosestCollaborator | null> => {
  const indexMap = [2000, 4000, 6000, 8000, 10000];

  for await (const radius of indexMap) {
    const closestCollaborators = await collaboratorGeoTableManager.queryRadius({
      RadiusInMeter: radius,
      CenterPoint: {
        latitude: partnerLatitude,
        longitude: partnerLongitude,
      },
      QueryInput: {
        TableName: "collaborators",
        FilterExpression:
          "is_available = :is_available AND is_online = :is_online",
        ExpressionAttributeValues: {
          ":is_available": { BOOL: is_available },
          ":is_online": { BOOL: true },
        },
      },
    });

    if (!isEmpty(closestCollaborators)) {
      const collaboratosDistance = closestCollaborators
        .map(convertDynamoDataToObject)
        .map((collaborator: Collaborator) =>
          calcDistanceAvailableCollaborator(
            collaborator,
            partnerLatitude,
            partnerLongitude
          )
        )
        .sort((first, second) =>
          simpleSortArrayByField(first, second, "distance")
        );
      return collaboratosDistance[0];
    }
  }

  return null;
};
