import { FilterQuery } from 'mongoose';
import { CategoryModel } from './category.model';
import { ICategory, ICategoryDocument } from './category.types';

export class CategoryRepository {
  create(data: Partial<ICategory>): Promise<ICategoryDocument> {
    return CategoryModel.create(data);
  }

  findById(id: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findById(id).exec();
  }

  findBySlug(slug: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findOne({ slug }).exec();
  }

  findByName(name: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findOne({ name }).exec();
  }

  find(filter: FilterQuery<ICategoryDocument>): Promise<ICategoryDocument[]> {
    return CategoryModel.find(filter).sort({ name: 1 }).exec();
  }

  updateById(id: string, data: Partial<ICategory>): Promise<ICategoryDocument | null> {
    return CategoryModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteById(id: string): Promise<ICategoryDocument | null> {
    return CategoryModel.findByIdAndDelete(id).exec();
  }

  countByParent(parentId: string): Promise<number> {
    return CategoryModel.countDocuments({ parentCategory: parentId }).exec();
  }
}
