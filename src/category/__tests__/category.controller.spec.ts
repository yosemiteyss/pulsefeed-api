import { CategoryListRequestDto } from '../dto/category-list-request.dto';
import { CategoryController } from '../category.controller';
import { CategoryService } from '../category.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryDto } from '../dto/category.dto';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoryService: jest.Mocked<CategoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoryController],
      providers: [
        {
          provide: CategoryService,
          useValue: {
            getSupportedCategories: jest.fn(),
          },
        },
      ],
    }).compile();

    categoryController = module.get<CategoryController>(CategoryController);
    categoryService = module.get(CategoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('listCategory', () => {
    it('should return a list of categories', async () => {
      const mockCategories: CategoryDto[] = [
        { key: 'tech', name: 'Tech' },
        { key: 'health', name: 'Health' },
      ];

      categoryService.getSupportedCategories.mockResolvedValue(mockCategories);

      const request: CategoryListRequestDto = { language: 'en' };
      const result = await categoryController.listCategory(request);

      expect(result).toEqual(mockCategories);
      expect(categoryService.getSupportedCategories).toHaveBeenCalledTimes(1);
    });
  });
});
