import { Injectable } from "@nestjs/common";
import { CategorizedPartners } from "apps/shared/dto/categorized-partners.dto";
import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import {
  Partners,
  Products,
  Category,
  Catalog,
} from "../../../shared/interfaces";
import {
  catalogModel,
  categoryModel,
  partnerModel,
  productsModel,
} from "../../../shared/models";

@Injectable()
export class SearchService {
  async getAllTrackedSearch(query): Promise<any[]> {
    const products = await this.getProducts(query);
    const categories = await this.getCategories(query);
    const partners = await this.getPartners(query);
    const catalogs = await this.getCatalogs(query);
    return products.concat(categories as any, partners as any, catalogs as any);
  }

  async trackedSearch(query): Promise<any[]> {
    const { tracked } = query;

    const trackedSearchType = {
      products: async (query) => await this.getProducts(query),
      categories: async (query) => await this.getCategories(query),
      partners: async (query) => await this.getPartners(query),
      catalogs: async (query) => await this.getCatalogs(query),
    };

    if (trackedSearchType[`${tracked}`])
      return trackedSearchType[`${tracked}`](query);

    return await this.getAllTrackedSearch(query);
  }

  async getProducts(query: any = {}): Promise<ScanResponse<Products>> {
    try {
      if (query.name) {
        return await productsModel
          .scan()
          .filter("name")
          .contains(query.name)
          .exec();
      }

      return await productsModel.scan().exec();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getCategories(query: any = {}): Promise<ScanResponse<Category>> {
    try {
      if (query.name) {
        return await categoryModel
          .scan()
          .filter("name")
          .contains(query.name)
          .exec();
      }

      return await categoryModel.scan().exec();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }

  async getPartners(query: any = {}): Promise<ScanResponse<Partners>> {
    try {
      const { name, category_id } = query;
      if (name) {
        return partnerModel
          .scan()
          .contains(name)
          .exec();
      }

      if (category_id) {
        return partnerModel
          .scan({
            categories: {
              contains: category_id,
            },
          })
          .exec();
      }
      return partnerModel.scan().exec();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCategorizedPartners(): Promise<CategorizedPartners> {
    try {
      const categories = await categoryModel.scan().exec();
      const partners = await partnerModel.scan().exec();

      const data: CategorizedPartners = {};

      for (const category of categories) {
        const { id } = category;
        if (!data[id]) data[id] = [];
        for (const partner of partners) {
          const { categories } = partner;
          if (categories.indexOf(id) !== -1) {
            data[id].push(partner);
          }
        }
        if (data[id].length === 0) delete data[id];
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getCatalogs(query: any = {}): Promise<ScanResponse<Catalog>> {
    try {
      if (query.name) {
        return await catalogModel
          .scan()
          .filter("name")
          .contains(query.name)
          .exec();
      }

      return await catalogModel.scan().exec();
    } catch (error) {
      console.error(error);
      throw new Error(error);
    }
  }
}
