import { Car } from './car.model';

export interface Person {
  id?: number;
  nume: string;
  prenume: string;
  cnp: string;
  varsta: number;
  cars?: Car[];
  createdAt?: Date;
  updatedAt?: Date;
} 