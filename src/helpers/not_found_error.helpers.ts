import { ApiProperty } from '@nestjs/swagger';

export class NotFoundErrorDto {
  @ApiProperty({ example: 404 })
  statusCode: 404;

  @ApiProperty({
    example: "Resource wasn't found",
  })
  message: string;

  @ApiProperty({ example: 'Not Found' })
  error: 'Bad Request';
}
