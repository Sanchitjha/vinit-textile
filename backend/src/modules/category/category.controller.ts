import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { CategoryQueryDtoType, CreateCategoryDtoType, UpdateCategoryDtoType } from './category.dto';
import { CategoryService } from './category.service';

export class CategoryController {
  constructor(private readonly categoryService: CategoryService = new CategoryService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as CategoryQueryDtoType;
    const categories = await this.categoryService.list({
      parentCategory: query.parentCategory,
      isActive: query.isActive,
    });
    ApiResponse.success(res, 'Categories fetched successfully', categories);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const category = await this.categoryService.getById(req.params.id);
    ApiResponse.success(res, 'Category fetched successfully', category);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateCategoryDtoType;
    const category = await this.categoryService.create(dto);
    ApiResponse.success(res, 'Category created successfully', category, 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateCategoryDtoType;
    const category = await this.categoryService.update(req.params.id, dto);
    ApiResponse.success(res, 'Category updated successfully', category);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.categoryService.delete(req.params.id);
    ApiResponse.success(res, 'Category deleted successfully');
  };
}
