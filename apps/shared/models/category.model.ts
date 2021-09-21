import * as dynamoose from 'dynamoose';
import { DocumentModelType } from '../@types';
import { Category } from '../interfaces';
import { v4 as uuidv4 } from 'uuid';

const CategorySchema = new dynamoose.Schema({
  id: {
    type: String,
    default: uuidv4
  },
  name: String,
  department: String,
  icon_url: String
}, {
  timestamps: true
});

export const categoryModel: DocumentModelType<Category> = dynamoose.model<DocumentModelType<Category>>(process.env.CATEGORIES_TABLE, CategorySchema);