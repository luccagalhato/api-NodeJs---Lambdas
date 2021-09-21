import { Injectable } from '@nestjs/common';
import {Category} from '../../../shared/interfaces'
import {categoryModel} from '../../../shared/models/category.model'
import { DocumentModelType } from '../../../shared/@types';

@Injectable()
export class CategoriesService {
  async createCategory(category: Category): Promise<DocumentModelType<any>> {
    const result = await categoryModel.create(category);
    return result
  }

  async deleteCategory(id: string): Promise<DocumentModelType<any>> {
    const result = await categoryModel.delete({ "id": id });
    return result
  }

  async updateCategory(id: string, category: Category): Promise<DocumentModelType<any>> {
    const result = await categoryModel.update({ "id": id }, category);
    return result
  }

  async getAll(): Promise<DocumentModelType<any>> {
    const result =  await categoryModel.scan().exec();
    return result;
  }


  async getCategoriesById(id: string): Promise<DocumentModelType<any>> {
    const result = await categoryModel.get({ "id": id });
    return result
  }
}
