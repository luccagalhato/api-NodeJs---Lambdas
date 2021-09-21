import { Document } from 'dynamoose/dist/Document'
import { ModelType } from 'dynamoose/dist/General'

export * from './authentication'

export type DocumentModelType<T> = ModelType<T & Document>
