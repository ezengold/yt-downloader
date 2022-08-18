import { ValueUnit } from './ValueInit';

export class SizeUnit extends ValueUnit {
  static BYTES = new SizeUnit('B', 1);

  static KILOBYTES = new SizeUnit('Kb', 1e3);

  static MEGABYTES = new SizeUnit('Mb', 1e6);

  static GIGABYTES = new SizeUnit('Gb', 1e9);

  static TERABYTES = new SizeUnit('Tb', 1e12);
}
