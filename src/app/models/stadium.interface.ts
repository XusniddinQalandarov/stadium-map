export interface Stadium {
  district: District;
  coordinates: [number, number];
  address: string;
  landmark?: string;
  fieldCount: number;
  // Optional array of image URLs (served from /assets/...)
  images?: string[];
}

export enum District {
  MIRABADSKY = 'Мирабадский',
  BEKTEMIR = 'Бектемир',
  YASHNABAD = 'Яшнабад',
  CHILANZAR = 'Чиланзар',
  OLMAZOR = 'Олмазор',
  SHAYKHANTAKHUR = 'Шайхантахур'
}
