import { Injectable } from "@nestjs/common";
import { Catalog, Products } from "../../../shared/interfaces";
import { catalogModel } from "../../../shared/models/catalog.model";
import { productsModel } from "../../../shared/models/products.model";
import { DocumentModelType } from "../../../shared/@types";
import { ScanResponse } from "dynamoose/dist/DocumentRetriever";

@Injectable()
export class CatalogsService {
  async createCatalog(catalog: Catalog): Promise<DocumentModelType<any>> {
    const result = await catalogModel.create(catalog);
    return result;
  }

  async deleteCatalog(id: string): Promise<DocumentModelType<any>> {
    const result = await catalogModel.delete({ id: id });
    return result;
  }

  async updateCatalog(
    id: string,
    catalog: Catalog
  ): Promise<DocumentModelType<any>> {
    const result = await catalogModel.update({ id: id }, catalog);
    return result;
  }

  async getAll(): Promise<DocumentModelType<any>> {
    const result = await catalogModel.scan().exec();
    return result;
  }

  async getCatalogById(id: string): Promise<Catalog> {
    const result = await catalogModel.get({ id });
    return result;
  }

  async getCatalogByPartern(partner_id: string): Promise<any> {
    return catalogModel
      .scan("partner_id")
      .contains(partner_id)
      .exec();
  }

  async getCatalogProducts(id: string): Promise<Products[]> {
    const catalog = await this.getCatalogById(id);
    if (!catalog || !catalog.items || catalog.items.length === 0) return [];
    return productsModel
      .scan("sku")
      .in(catalog.items)
      .exec();
  }
}