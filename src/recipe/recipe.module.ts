import { Module } from '@nestjs/common';
import { RecipeController } from './recipe.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [RecipeController],
})
export class RecipeModule {}
