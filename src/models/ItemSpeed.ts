import { SpeedUnit } from './SpeedUnit';

export class ItemSpeed {
  value: number;

  unit: SpeedUnit;

  constructor(value: number, unit: SpeedUnit) {
    this.value = value;
    this.unit = unit;
  }
}
