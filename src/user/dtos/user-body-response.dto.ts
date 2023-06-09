import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../entities/user.entity';

export class UserBodyResponseDto extends UserEntity {
  @ApiProperty({ example: 'john_doe' })
  login: string;

  @ApiProperty({ example: 'john.doe@email.com' })
  email: string;

  @ApiProperty({ example: '6waKSyOn3R' })
  password: string;
}
