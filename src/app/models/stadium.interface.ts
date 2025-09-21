export interface Stadium {
  district: District;
  coordinates: [number, number];
  address: string;
  landmark?: string;
  fieldCount: number;
}

export enum District {
  MIRABADSKY = 'Мирабадский',
  BEKTEMIR = 'Бектемир',
  YASHNABAD = 'Яшнабад',
  CHILANZAR = 'Чиланзар',
  OLMAZOR = 'Олмазор',
  SHAYKHANTAKHUR = 'Шайхантахур'
}
