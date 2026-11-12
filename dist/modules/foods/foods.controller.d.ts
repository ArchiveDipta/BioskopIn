import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
export declare class FoodsController {
    private readonly foodsService;
    constructor(foodsService: FoodsService);
    create(createFoodDto: CreateFoodDto): Promise<{
        description: string | null;
        category: string;
        id: number;
        name: string;
        price: number;
        createdAt: Date;
        imageUrl: string | null;
        isAvailable: boolean;
    }>;
    findAll(category?: string): Promise<{
        description: string | null;
        category: string;
        id: number;
        name: string;
        price: number;
        createdAt: Date;
        imageUrl: string | null;
        isAvailable: boolean;
    }[]>;
    findOne(id: number): Promise<{
        description: string | null;
        category: string;
        id: number;
        name: string;
        price: number;
        createdAt: Date;
        imageUrl: string | null;
        isAvailable: boolean;
    }>;
    update(id: number, updateFoodDto: UpdateFoodDto): Promise<{
        description: string | null;
        category: string;
        id: number;
        name: string;
        price: number;
        createdAt: Date;
        imageUrl: string | null;
        isAvailable: boolean;
    }>;
    remove(id: number): Promise<{
        description: string | null;
        category: string;
        id: number;
        name: string;
        price: number;
        createdAt: Date;
        imageUrl: string | null;
        isAvailable: boolean;
    }>;
}
