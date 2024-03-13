type Item = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
};

export class CreatePreferenceDto {
  external_reference?: string;
  items: Array<Item>;
}
