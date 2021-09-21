import {
  Controller,
  Body,
  Param,
  Get,
  Delete,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CategoriesService } from "./categories.service";
import { Category } from "../../../shared/interfaces/";
import { DocumentModelType } from "../../../shared/@types";
import { AuthorizationGuard } from "../../../shared/security/authorization.guard";
import Role from "../../../shared/security/role.model";
import { Roles } from "../../../shared/decorators/role.decorator";

@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async createCategories(
    @Body() category: Category
  ): Promise<DocumentModelType<Category>> {
    return await this.categoriesService.createCategory(category);
  }

  @Delete(":id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async deleteCategory(@Param("id") id: string): Promise<Category> {
    return await this.categoriesService.deleteCategory(id);
  }

  @Put(":id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async updateCategory(
    @Param("id") id: string,
    @Body() category: Category
  ): Promise<DocumentModelType<Category>> {
    return await this.categoriesService.updateCategory(id, category);
  }

  @Get("all")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async getAll(): Promise<DocumentModelType<Category>> {
    return await this.categoriesService.getAll();
  }

  @Get("show-status/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async getCategoriesById(
    @Param("id") id: string
  ): Promise<DocumentModelType<Category>> {
    return await this.categoriesService.getCategoriesById(id);
  }
}
