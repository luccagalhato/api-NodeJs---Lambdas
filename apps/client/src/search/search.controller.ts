import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { CategorizedPartners } from "apps/shared/dto/categorized-partners.dto";
import { Category, Partners, Products } from "apps/shared/interfaces";
import { ScanResponse } from "dynamoose/dist/DocumentRetriever";
import { Roles } from "../../../shared/decorators/role.decorator";
import { AuthorizationGuard } from "../../../shared/security/authorization.guard";
import Role from "../../../shared/security/role.model";
import { SearchService } from "./search.service";

@Controller("search")
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get("tracked")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async trackedSearch(@Query() query: any = {}): Promise<any> {
    return await this.searchService.trackedSearch(query);
  }

  @Get("products")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async getProducts(@Query() query: any = {}): Promise<ScanResponse<Products>> {
    return await this.searchService.getProducts(query);
  }

  @Get("categories")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async getCategories(
    @Query() query: any = {}
  ): Promise<ScanResponse<Category>> {
    return await this.searchService.getCategories(query);
  }

  @Get("partners")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async getPartners(@Query() query: any = {}): Promise<ScanResponse<Partners>> {
    return await this.searchService.getPartners(query);
  }

  @Get("categorized-partners")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async getCategorizedPartners(): Promise<CategorizedPartners> {
    return this.searchService.getCategorizedPartners();
  }
}
