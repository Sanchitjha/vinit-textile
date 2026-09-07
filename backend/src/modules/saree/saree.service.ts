import { BadRequestError, ConflictError, NotFoundError } from '../../shared/errors';
import { CategoryRepository } from '../category/category.repository';
import { PaginatedResult, buildPaginationMeta } from '../../shared/responses/Paginated';
import { toSkipLimit } from '../../shared/utils/pagination.util';
import { slugify } from '../../shared/utils/slugify.util';
import { AdjustStockDtoType, CreateSareeDtoType, SareeQueryDtoType, UpdateSareeDtoType } from './saree.dto';
import { SareeRepository } from './saree.repository';
import { ISareeDocument } from './saree.types';
import { UploadService } from '../upload/upload.service';

export class SareeService {
  constructor(
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
    private readonly categoryRepository: CategoryRepository = new CategoryRepository(),
    private readonly uploadService: UploadService = new UploadService(),
  ) {}

  private async attachPresignedUrls(saree: ISareeDocument): Promise<ISareeDocument> {
    if (saree && saree.images && saree.images.length > 0) {
      saree.images = await this.uploadService.presignImageUrls(saree.images);
    }
    return saree;
  }

  async list(query: SareeQueryDtoType): Promise<PaginatedResult<ISareeDocument>> {
    const { page, limit, sort, categorySlug, ...filters } = query;
    
    if (categorySlug) {
      const cat = await this.categoryRepository.findBySlug(categorySlug);
      if (cat) {
        filters.category = cat.id;
      } else {
        // If category slug is invalid, return empty result by providing a dummy non-existent ID
        filters.category = '000000000000000000000000';
      }
    }

    const filter = this.sareeRepository.buildFilter({ ...filters, isActive: true });
    const { skip, limit: safeLimit } = toSkipLimit({ page, limit });
    const { items, total } = await this.sareeRepository.findWithFilters(filter, { skip, limit: safeLimit }, sort);
    
    for (let i = 0; i < items.length; i++) {
      items[i] = await this.attachPresignedUrls(items[i]);
    }
    
    return { items, meta: buildPaginationMeta(page, safeLimit, total) };
  }

  async getById(id: string): Promise<ISareeDocument> {
    const saree = await this.sareeRepository.findById(id);
    if (!saree) throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');
    return this.attachPresignedUrls(saree);
  }

  async getBySlug(slug: string): Promise<ISareeDocument> {
    const saree = await this.sareeRepository.findBySlug(slug);
    if (!saree) throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');
    return this.attachPresignedUrls(saree);
  }

  async create(dto: CreateSareeDtoType): Promise<ISareeDocument> {
    await this.assertCategoryExists(dto.category);
    if (dto.subCategory) await this.assertCategoryExists(dto.subCategory);

    const existingSku = await this.sareeRepository.findBySku(dto.sku);
    if (existingSku) throw new ConflictError('SKU already exists', 'SKU_EXISTS');

    const slug = await this.generateUniqueSlug(dto.name);
    const saree = await this.sareeRepository.create({ ...dto, slug });
    return this.attachPresignedUrls(saree);
  }

  async update(id: string, dto: UpdateSareeDtoType): Promise<ISareeDocument> {
    const saree = await this.getById(id);

    if (dto.category) await this.assertCategoryExists(dto.category);
    if (dto.subCategory) await this.assertCategoryExists(dto.subCategory);

    if (dto.sku && dto.sku.toUpperCase() !== saree.sku) {
      const existingSku = await this.sareeRepository.findBySku(dto.sku);
      if (existingSku) throw new ConflictError('SKU already exists', 'SKU_EXISTS');
    }

    const patch: Partial<ISareeDocument> & { slug?: string } = { ...dto };
    if (dto.name && dto.name !== saree.name) {
      patch.slug = await this.generateUniqueSlug(dto.name, id);
    }

    const updated = await this.sareeRepository.updateById(id, patch);
    if (!updated) throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');
    return this.attachPresignedUrls(updated);
  }

  async delete(id: string): Promise<void> {
    await this.getById(id);
    await this.sareeRepository.deleteById(id);
  }

  async adjustStock(id: string, dto: AdjustStockDtoType): Promise<ISareeDocument> {
    const saree = await this.getById(id);
    const nextStock = saree.stock + dto.quantity;
    if (nextStock < 0) {
      throw new BadRequestError('Stock cannot go below zero', 'INVALID_STOCK_ADJUSTMENT');
    }
    const updated = await this.sareeRepository.setStock(id, nextStock);
    if (!updated) throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');
    return this.attachPresignedUrls(updated);
  }

  async listLowStock(threshold: number): Promise<ISareeDocument[]> {
    return this.sareeRepository.findLowStock(threshold);
  }

  private async assertCategoryExists(categoryId: string): Promise<void> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) throw new NotFoundError('Category not found', 'CATEGORY_NOT_FOUND');
  }

  private async generateUniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = slugify(name);
    let candidate = base;
    let suffix = 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existing = await this.sareeRepository.findBySlug(candidate);
      if (!existing || existing.id === excludeId) break;
      candidate = `${base}-${suffix++}`;
    }
    return candidate;
  }
}
