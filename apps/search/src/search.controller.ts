import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { LatLng } from "geolocation-utils";
import { Roles } from "../../shared/decorators/role.decorator";
import AbstractController from "../../shared/helpers/extract-username-token";
import { AuthorizationGuard } from "../../shared/security/authorization.guard";
import Role from "../../shared/security/role.model";
import { SearchService } from "./search.service";

@Controller()
export class SearchController extends AbstractController {
  constructor(private readonly searchService: SearchService) {
    super();
  }

  @Get("categories")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async categories(@Query("q") q: string) {
    return this.searchService.categories(q);
  }

  @Get("products")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER, Role.USER)
  async products(@Query("q") q: string) {
    return this.searchService.products(q);
  }

  @Get("partners")
  @UseGuards(AuthorizationGuard)
  @Roles(Role.USER)
  async partners(@Query() query: any) {
    const { q, categories, lat, lng } = query;
    let userLatLng: LatLng;
    if (lat && lng) userLatLng = { lat: Number(lat), lng: Number(lng) };
    return this.searchService.partners(q, categories, userLatLng);
  }
}
