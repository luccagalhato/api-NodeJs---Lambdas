import {
  Controller,
  Body,
  Param,
  Get,
  Post,
  Delete,
  Put,
  UseGuards,
} from "@nestjs/common";
import { CatalogsService } from "./catalogs.service";
import { Catalog, Products } from "../../../shared/interfaces/";
import { DocumentModelType } from "../../../shared/@types";
import Role from "../../../shared/security/role.model";
import { Roles } from "../../../shared/decorators/role.decorator";
import { AuthorizationGuard } from "../../../shared/security/authorization.guard";

@Controller("catalogs")
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async createCategory(
    @Body() catalog: Catalog
  ): Promise<DocumentModelType<Catalog>> {
    return await this.catalogsService.createCatalog(catalog);
  }

  @Delete(":id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async deleteCategory(@Param("id") id: string): Promise<Catalog> {
    return await this.catalogsService.deleteCatalog(id);
  }

  @Put(":id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async updateCategory(
    @Param("id") id: string,
    @Body() catalog: Catalog
  ): Promise<DocumentModelType<Catalog>> {
    return this.catalogsService.updateCatalog(id, catalog);
  }

  @Get("")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async getAll(): Promise<DocumentModelType<Catalog>> {
    return await this.catalogsService.getAll();
  }

  @Get("show-status/:id")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async getCategoriesById(@Param("id") id: string): Promise<Catalog> {
    return await this.catalogsService.getCatalogById(id);
  }

  @Get("partner/:partner_id")
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async getCatalogByPartner(
    @Param("partner_id") partner_id: string
  ): Promise<any> {
    return this.catalogsService.getCatalogByPartern(partner_id);
  }

  @Get(":id/products")
  @Roles(Role.PARTNER, Role.COLLABORATOR, Role.USER)
  async getCatalogProducts(@Param("id") id: string): Promise<Products[]> {
    return this.catalogsService.getCatalogProducts(id);
  }
}
