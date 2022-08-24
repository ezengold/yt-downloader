import { SizeUnit } from './SizeUnit';

export class ItemSize {
  value: number;

  unit: SizeUnit;

  constructor(value: number, unit: SizeUnit) {
    this.value = value;
    this.unit = unit;
  }
}
