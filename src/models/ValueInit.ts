export class ValueUnit {
  title: string;

  /**
   * ratio * item size gives equivalent in default ValueUnit.
   * The default ValueUnit has a ratio of 1
   */
  ratio: number;

  constructor(title: string, ratio: number) {
    this.title = title;
    this.ratio = ratio;
  }
}
