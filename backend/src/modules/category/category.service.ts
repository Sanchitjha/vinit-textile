import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors';
import { SareeRepository } from '../saree/saree.repository';
import { slugify } from '../../shared/utils/slugify.util';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDtoType, UpdateCategoryDtoType } from './category.dto';
import { ICategoryDocument } from './category.types';

export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository = new CategoryRepository(),
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
  ) {}

  async create(dto: CreateCategoryDtoType): Promise<ICategoryDocument> {
    const existing = await this.categoryRepository.findByName(dto.name);
    if (existing) throw new ConflictError('Category name already exists', 'CATEGORY_EXISTS');

    if (dto.parentCategory) {
      await this.assertTopLevelParent(dto.parentCategory);
    }

    const slug = slugify(dto.name);
    return this.categoryRepository.create({ ...dto, slug, parentCategory: dto.parentCategory ?? null });
  }

  async update(id: string, dto: UpdateCategoryDtoType): Promise<ICategoryDocument> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found', 'CATEGORY_NOT_FOUND');

    if (dto.parentCategory) {
      if (dto.parentCategory === id) {
        throw new BadRequestError('A category cannot be its own parent', 'INVALID_PARENT');
      }
      await this.assertTopLevelParent(dto.parentCategory);
    }

    const patch: Partial<ICategoryDocument> = { ...dto };
    if (dto.name) {
      patch.slug = slugify(dto.name);
    }

    const updated = await this.categoryRepository.updateById(id, patch);
    if (!updated) throw new NotFoundError('Category not found', 'CATEGORY_NOT_FOUND');
    return updated;
  }

  async delete(id: string): Promise<void> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found', 'CATEGORY_NOT_FOUND');

    const [childCount, sareeCount] = await Promise.all([
      this.categoryRepository.countByParent(id),
      this.sareeRepository.countByCategory(id),
    ]);
    if (childCount > 0) {
      throw new ConflictError(
        'Cannot delete a category that has subcategories',
        'CATEGORY_HAS_CHILDREN',
      );
    }
    if (sareeCount > 0) {
      throw new ConflictError(
        'Cannot delete a category that is assigned to sarees',
        'CATEGORY_IN_USE',
      );
    }

    await this.categoryRepository.deleteById(id);
  }

  async getById(id: string): Promise<ICategoryDocument> {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new NotFoundError('Category not found', 'CATEGORY_NOT_FOUND');
    return category;
  }

  async list(filters: { parentCategory?: string; isActive?: boolean }): Promise<ICategoryDocument[]> {
    const query: Record<string, unknown> = {};
    if (filters.parentCategory !== undefined) query.parentCategory = filters.parentCategory;
    if (filters.isActive !== undefined) query.isActive = filters.isActive;
    return this.categoryRepository.find(query);
  }

  private async assertTopLevelParent(parentId: string): Promise<ICategoryDocument> {
    const parent = await this.categoryRepository.findById(parentId);
    if (!parent) throw new NotFoundError('Parent category not found', 'PARENT_CATEGORY_NOT_FOUND');
    if (parent.parentCategory) {
      throw new BadRequestError('Category tree only supports two levels', 'MAX_DEPTH_EXCEEDED');
    }
    return parent;
  }
}
