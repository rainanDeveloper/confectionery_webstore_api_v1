import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorDto {
  @ApiProperty({ example: 400 })
  statusCode: 400;

  @ApiProperty({
    example: ['field must be longer than or equal to 8 characters'],
  })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: 'Bad Request';
}
