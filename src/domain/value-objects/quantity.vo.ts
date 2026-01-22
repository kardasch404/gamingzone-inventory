export class Quantity {
  private constructor(private readonly value: number) {
    this.validate(value);
  }

  static create(value: number): Quantity {
    return new Quantity(value);
  }

  private validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new Error('Quantity must be an integer');
    }
    if (value < 0) {
      throw new Error('Quantity cannot be negative');
    }
  }

  getValue(): number {
    return this.value;
  }

  add(other: Quantity): Quantity {
    return new Quantity(this.value + other.value);
  }

  subtract(other: Quantity): Quantity {
    const result = this.value - other.value;
    if (result < 0) {
      throw new Error('Resulting quantity cannot be negative');
    }
    return new Quantity(result);
  }

  isGreaterThan(other: Quantity): boolean {
    return this.value > other.value;
  }

  isGreaterThanOrEqual(other: Quantity): boolean {
    return this.value >= other.value;
  }

  equals(other: Quantity): boolean {
    return this.value === other.value;
  }
}
