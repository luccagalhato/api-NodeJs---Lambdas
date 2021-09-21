import { Injectable } from '@nestjs/common';
import { productsModel } from '../../../shared/models/products.model'
import { Products } from '../../../shared/interfaces/products.interface';
import { DocumentModelType } from '../../../shared/@types';

@Injectable()
export class ProductsService {

  async createProducts(products: Products): Promise<DocumentModelType<any>> {
    const result = await productsModel.create(products);
    return result
  }

  async deleteProducts(id: string): Promise<DocumentModelType<any>> {
    const result = await productsModel.delete({ "sku": id });
    return result
  }

  async updateProduct(id: string, products: Products): Promise<DocumentModelType<any>> {
    const result = await productsModel.update({ "sku": id }, products);
    return result
  }

  async updateStatusProduct(id: string, visible: boolean): Promise<DocumentModelType<any>> {
    const result = await productsModel.update({ "sku": id }, { visible: visible });
    return result
  }

  async showProduct(id: string): Promise<DocumentModelType<any>> {
    const result = await productsModel.get({ "sku": id });
    return result
  }

  async showAllProducts(): Promise<DocumentModelType<any>> {
    return await productsModel.scan().exec();
  }
}
