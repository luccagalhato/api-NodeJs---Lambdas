import { Injectable } from "@nestjs/common";
import { distanceTo, LatLng } from "geolocation-utils";
import { ElasticClientWithCredentials } from "./services/elastic/client";

@Injectable()
export class SearchService {
  async categories(q?: string): Promise<any> {
    const client = ElasticClientWithCredentials("category", "categories");
    return new Promise((resolve, reject) => {
      client
        .Search({ q: q ? `name:*${q}*` : undefined })
        .then(resolve)
        .catch(reject);
    });
  }

  async products(q?: string): Promise<any> {
    const client = ElasticClientWithCredentials("product", "products");
    return new Promise((resolve, reject) => {
      client
        .Search({ q: q ? `name:*${q}* OR description:*${q}*` : undefined })
        .then(resolve)
        .catch(reject);
    });
  }

  async partners(
    q?: string,
    categories?: string,
    userLatLng?: LatLng
  ): Promise<any> {
    try {
      const query = ["is_online:true"];

      if (q) {
        query.push(`(name:*${q}* OR description:*${q}*)`);
      }
      if (categories) {
        query.push(`categories.name:${categories.split(",")}`);
      }

      const client = ElasticClientWithCredentials("partner", "partners");
      const partners = await client.Search({
        body: {
          query: {
            query_string: {
              query: query.join(" AND "),
            },
          },
        },
      });

      if (!userLatLng) {
        return partners;
      }

      return partners.filter((partner: any) => {
        const { radius } = partner;
        if (radius) {
          const { location } = partner;
          const partnerLatLng: LatLng = {
            lat: location.latitude,
            lng: location.longitude,
          };
          const distance = distanceTo(partnerLatLng, userLatLng);
          return distance <= radius;
        }
        return false;
      });
    } catch (error) {
      throw error;
    }
  }
}
