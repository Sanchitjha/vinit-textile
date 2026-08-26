import { ClientSession, FilterQuery, SortOrder } from 'mongoose';
import { SareeModel } from './saree.model';
import { ISaree, ISareeDocument, SareeFilterOptions, SareeSortOption } from './saree.types';

const SORT_MAP: Record<SareeSortOption, Record<string, SortOrder>> = {
  price_asc: { price: 1 },
  price_desc: { price: -1 },
  newest: { createdAt: -1 },
  oldest: { createdAt: 1 },
  rating_desc: { ratings: -1 },
  name_asc: { name: 1 },
};

export class SareeRepository {
  create(data: Partial<ISaree>): Promise<ISareeDocument> {
    return SareeModel.create(data);
  }

  findById(id: string): Promise<ISareeDocument | null> {
    return SareeModel.findById(id).populate('category subCategory', 'name slug').exec();
  }

  findBySlug(slug: string): Promise<ISareeDocument | null> {
    return SareeModel.findOne({ slug }).populate('category subCategory', 'name slug').exec();
  }

  findBySku(sku: string): Promise<ISareeDocument | null> {
    return SareeModel.findOne({ sku: sku.toUpperCase() }).exec();
  }

  findManyByIds(ids: string[], session?: ClientSession): Promise<ISareeDocument[]> {
    return SareeModel.find({ _id: { $in: ids } })
      .session(session ?? null)
      .exec();
  }

  buildFilter(options: SareeFilterOptions): FilterQuery<ISareeDocument> {
    const filter: FilterQuery<ISareeDocument> = {};

    if (options.isActive !== undefined) filter.isActive = options.isActive;
    if (options.search) filter.$text = { $search: options.search };
    if (options.category) filter.category = options.category;
    if (options.subCategory) filter.subCategory = options.subCategory;
    if (options.fabric) filter.fabric = new RegExp(`^${options.fabric}$`, 'i');
    if (options.sareeType) filter.sareeType = new RegExp(`^${options.sareeType}$`, 'i');
    if (options.color) {
      filter.$or = [
        { color: new RegExp(`^${options.color}$`, 'i') },
        { colors: new RegExp(`^${options.color}$`, 'i') },
      ];
    }
    if (options.occasion) filter.occasion = new RegExp(`^${options.occasion}$`, 'i');
    if (options.region) filter.region = new RegExp(`^${options.region}$`, 'i');
    if (options.featured !== undefined) filter.isFeatured = options.featured;
    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      filter.price = {};
      if (options.minPrice !== undefined) filter.price.$gte = options.minPrice;
      if (options.maxPrice !== undefined) filter.price.$lte = options.maxPrice;
    }

    return filter;
  }

  async findWithFilters(
    filter: FilterQuery<ISareeDocument>,
    pagination: { skip: number; limit: number },
    sort: SareeSortOption,
  ): Promise<{ items: ISareeDocument[]; total: number }> {
    const [items, total] = await Promise.all([
      SareeModel.find(filter)
        .sort(SORT_MAP[sort])
        .skip(pagination.skip)
        .limit(pagination.limit)
        .populate('category subCategory', 'name slug')
        .exec(),
      SareeModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  updateById(id: string, data: Partial<ISaree>): Promise<ISareeDocument | null> {
    return SareeModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  deleteById(id: string): Promise<ISareeDocument | null> {
    return SareeModel.findByIdAndDelete(id).exec();
  }

  countByCategory(categoryId: string): Promise<number> {
    return SareeModel.countDocuments({
      $or: [{ category: categoryId }, { subCategory: categoryId }],
    }).exec();
  }

  /**
   * Atomically deducts stock, guarded so it can never go negative under
   * concurrent orders. Returns null if there isn't enough stock, signalling
   * the caller to abort the enclosing transaction.
   */
  deductStock(id: string, quantity: number, session: ClientSession): Promise<ISareeDocument | null> {
    return SareeModel.findOneAndUpdate(
      { _id: id, stock: { $gte: quantity }, isActive: true },
      { $inc: { stock: -quantity } },
      { new: true, session },
    ).exec();
  }

  restoreStock(id: string, quantity: number, session?: ClientSession): Promise<ISareeDocument | null> {
    return SareeModel.findByIdAndUpdate(
      id,
      { $inc: { stock: quantity } },
      { new: true, session: session ?? null },
    ).exec();
  }

  setStock(id: string, stock: number): Promise<ISareeDocument | null> {
    return SareeModel.findByIdAndUpdate(id, { stock }, { new: true }).exec();
  }

  updateRatingStats(id: string, ratings: number, reviewCount: number): Promise<void> {
    return SareeModel.findByIdAndUpdate(id, { ratings, reviewCount })
      .exec()
      .then(() => undefined);
  }

  findLowStock(threshold: number): Promise<ISareeDocument[]> {
    return SareeModel.find({ stock: { $lte: threshold }, isActive: true }).sort({ stock: 1 }).exec();
  }
}
