import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@Controller('recipetypes')
export class RecipeController {
  @Get()
  @UseGuards(AuthGuard)
  getRecipeTypes() {
    return [
      { id: '1', name: 'Breakfast' },
      { id: '2', name: 'Lunch' },
      { id: '3', name: 'Dinner' },
      { id: '4', name: 'Dessert' },
      { id: '5', name: 'Snack' },
    ];
  }
}
