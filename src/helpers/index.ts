import { ItemSize, ItemSpeed, SizeUnit, SpeedUnit } from 'models';

export const prefeeredSizeOf = (size: ItemSize | undefined): ItemSize => {
  // back to basic unit value
  const basicSize = new ItemSize(
    (size?.value || 0) * (size?.unit.ratio || 1),
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
};

export const prefeeredSpeedOf = (speed: ItemSpeed | undefined): ItemSpeed => {
  // back to basic unit value
  const basicSpeed = new ItemSpeed(
    (speed?.value || 0) * (speed?.unit.ratio || 1),
    SpeedUnit.BS
  );

  if (basicSpeed.value / SpeedUnit.KBS.ratio <= 1) {
    return basicSpeed;
  } else if (basicSpeed.value / SpeedUnit.MBS.ratio <= 1) {
    return new ItemSpeed(basicSpeed.value / SpeedUnit.KBS.ratio, SpeedUnit.KBS);
  } else if (basicSpeed.value / SpeedUnit.GBS.ratio <= 1) {
    return new ItemSpeed(basicSpeed.value / SpeedUnit.MBS.ratio, SpeedUnit.MBS);
  } else if (basicSpeed.value / SpeedUnit.TBS.ratio <= 1) {
    return new ItemSpeed(basicSpeed.value / SpeedUnit.GBS.ratio, SpeedUnit.GBS);
  } else {
    return new ItemSpeed(basicSpeed.value / SpeedUnit.TBS.ratio, SpeedUnit.TBS);
  }
};
