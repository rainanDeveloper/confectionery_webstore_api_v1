import { OmitType } from "@nestjs/swagger";
import { CreateCartServiceDto } from "./create-cart-service.dto";

export class CreateCartControllerDto extends OmitType(CreateCartServiceDto, ['customer']) {}