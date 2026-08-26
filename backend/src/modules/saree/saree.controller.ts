import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import {
  AdjustStockDtoType,
  CreateSareeDtoType,
  SareeQueryDtoType,
  UpdateSareeDtoType,
} from './saree.dto';
import { SareeService } from './saree.service';

export class SareeController {
  constructor(private readonly sareeService: SareeService = new SareeService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as unknown as SareeQueryDtoType;
    const result = await this.sareeService.list(query);
    ApiResponse.success(res, 'Sarees fetched successfully', result);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const saree = await this.sareeService.getById(req.params.id);
    ApiResponse.success(res, 'Saree fetched successfully', saree);
  };

  getBySlug = async (req: Request, res: Response): Promise<void> => {
    const saree = await this.sareeService.getBySlug(req.params.slug);
    ApiResponse.success(res, 'Saree fetched successfully', saree);
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as CreateSareeDtoType;
    const saree = await this.sareeService.create(dto);
    ApiResponse.success(res, 'Saree created successfully', saree, 201);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateSareeDtoType;
    const saree = await this.sareeService.update(req.params.id, dto);
    ApiResponse.success(res, 'Saree updated successfully', saree);
  };

  remove = async (req: Request, res: Response): Promise<void> => {
    await this.sareeService.delete(req.params.id);
    ApiResponse.success(res, 'Saree deleted successfully');
  };

  adjustStock = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as AdjustStockDtoType;
    const saree = await this.sareeService.adjustStock(req.params.id, dto);
    ApiResponse.success(res, 'Stock updated successfully', saree);
  };
}
