import { Person } from './person.model';

export interface Car {
  id?: number;
  marca: string;
  model: string;
  an_fabricatie: number;
  capacitate_cilindrica: number;
  taxa_impozit: number;
  persons?: Person[];
  createdAt?: Date;
  updatedAt?: Date;
} 