import { SizeUnit } from './SizeUnit';

export class ItemSize {
  value: number;

  unit: SizeUnit;

  constructor(value: number, unit: SizeUnit) {
    this.value = value;
    this.unit = unit;
  }

  toPreferredSize(): ItemSize {
    // back to basic unit value
    const basicSize = new ItemSize(
      this.value * this.unit.ratio,
      SizeUnit.BYTES
    );
    if (basicSize.value / SizeUnit.KILOBYTES.ratio <= 1) {
      return basicSize;
    } else if (basicSize.value / SizeUnit.MEGABYTES.ratio <= 1) {
      return new ItemSize(
        basicSize.value / SizeUnit.KILOBYTES.ratio,
        SizeUnit.KILOBYTES
      );
    } else if (basicSize.value / SizeUnit.GIGABYTES.ratio <= 1) {
      return new ItemSize(
        basicSize.value / SizeUnit.MEGABYTES.ratio,
        SizeUnit.MEGABYTES
      );
    } else if (basicSize.value / SizeUnit.TERABYTES.ratio <= 1) {
      return new ItemSize(
        basicSize.value / SizeUnit.GIGABYTES.ratio,
        SizeUnit.GIGABYTES
      );
    } else {
      return new ItemSize(
        basicSize.value / SizeUnit.TERABYTES.ratio,
        SizeUnit.TERABYTES
      );
    }
  }
}
