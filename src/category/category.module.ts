import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryService } from './category.service';
import { CategoryEntity } from './entities/category.entity';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([CategoryEntity])],
  providers: [CategoryService],
})
export class CategoryModule {}
