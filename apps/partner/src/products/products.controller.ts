import { Controller, Post, Body, Delete, Param, Put, Get, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Products } from '../../../shared/interfaces/products.interface';
import { DocumentModelType } from '../../../shared/@types';
import { AuthorizationGuard } from '../../../shared/security/authorization.guard';
import { Roles } from '../../../shared/decorators/role.decorator';
import Role from '../../../shared/security/role.model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post()
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async createProducts(@Body() products: Products): Promise<DocumentModelType<Products>> {
    return await this.productsService.createProducts(products);
  }

  @Delete(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async deleteProducts(@Param('id') id: string): Promise<Products> {
    return await this.productsService.deleteProducts(id);
  }

  @Put(':id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async updateProducts(@Param('id') id: string, @Body() products: Products): Promise<Products> {
    return await this.productsService.updateProduct(id, products);
  }

  @Put('update-status/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async updateStatusProducts(@Param('id') id: string, @Body('visible') visible: boolean): Promise<Products> {
    return await this.productsService.updateStatusProduct(id, visible);
  }

  @Get('show-status/:id')
  @UseGuards(AuthorizationGuard)
  @Roles(Role.PARTNER)
  async showStatus(@Param('id') id: string): Promise<any> {
    return await this.productsService.showProduct(id);

  }
}
