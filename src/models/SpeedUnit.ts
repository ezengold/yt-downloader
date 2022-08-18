import { ValueUnit } from './ValueInit';

export class SpeedUnit extends ValueUnit {
  static BS = new SpeedUnit('B/s', 1);

  static KBS = new SpeedUnit('Kb/s', 1e3);

  static MBS = new SpeedUnit('Mb/s', 1e6);

  static GBS = new SpeedUnit('Gb/s', 1e9);

  static TBS = new SpeedUnit('Tb/s', 1e12);
}
