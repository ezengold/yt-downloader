import { SpeedUnit } from './SpeedUnit';

export class ItemSpeed {
  value: number;

  unit: SpeedUnit;

  constructor(value: number, unit: SpeedUnit) {
    this.value = value;
    this.unit = unit;
  }

  toPreferredSpeed(): ItemSpeed {
    // back to basic unit value
    const basicSpeed = new ItemSpeed(
      this.value * this.unit.ratio,
      SpeedUnit.BS
    );
    if (basicSpeed.value / SpeedUnit.KBS.ratio <= 1) {
      return basicSpeed;
    } else if (basicSpeed.value / SpeedUnit.MBS.ratio <= 1) {
      return new ItemSpeed(
        basicSpeed.value / SpeedUnit.KBS.ratio,
        SpeedUnit.KBS
      );
    } else if (basicSpeed.value / SpeedUnit.GBS.ratio <= 1) {
      return new ItemSpeed(
        basicSpeed.value / SpeedUnit.MBS.ratio,
        SpeedUnit.MBS
      );
    } else if (basicSpeed.value / SpeedUnit.TBS.ratio <= 1) {
      return new ItemSpeed(
        basicSpeed.value / SpeedUnit.GBS.ratio,
        SpeedUnit.GBS
      );
    } else {
      return new ItemSpeed(
        basicSpeed.value / SpeedUnit.TBS.ratio,
        SpeedUnit.TBS
      );
    }
  }
}
