export class OrderSummary {
  static id = 0;

  /**
   * Order Summary
   * @param {Object} param
   * @param {number} param.number
   * @param {string} param.label
   * @param { { foreground: { base: string, shade: string }, background: string } } param.color
   */
  constructor({ number, label, color }) {
    this.id = OrderSummary.id;
    this.number = number;
    this.label = label;
    this.color = color;
    OrderSummary.id++;
  }
}
