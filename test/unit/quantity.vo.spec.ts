import { Quantity } from '../../src/domain/value-objects/quantity.vo';

describe('Quantity Value Object', () => {
  describe('create', () => {
    it('should create valid quantity', () => {
      const qty = Quantity.create(10);
      expect(qty.getValue()).toBe(10);
    });

    it('should throw error for negative value', () => {
      expect(() => Quantity.create(-5)).toThrow('Quantity cannot be negative');
    });

    it('should throw error for non-integer', () => {
      expect(() => Quantity.create(5.5)).toThrow('Quantity must be an integer');
    });
  });

  describe('operations', () => {
    it('should add quantities', () => {
      const qty1 = Quantity.create(10);
      const qty2 = Quantity.create(5);
      const result = qty1.add(qty2);

      expect(result.getValue()).toBe(15);
    });

    it('should subtract quantities', () => {
      const qty1 = Quantity.create(10);
      const qty2 = Quantity.create(5);
      const result = qty1.subtract(qty2);

      expect(result.getValue()).toBe(5);
    });

    it('should throw error when subtraction results in negative', () => {
      const qty1 = Quantity.create(5);
      const qty2 = Quantity.create(10);

      expect(() => qty1.subtract(qty2)).toThrow(
        'Resulting quantity cannot be negative',
      );
    });

    it('should compare quantities', () => {
      const qty1 = Quantity.create(10);
      const qty2 = Quantity.create(5);

      expect(qty1.isGreaterThan(qty2)).toBe(true);
      expect(qty2.isGreaterThan(qty1)).toBe(false);
      expect(qty1.equals(Quantity.create(10))).toBe(true);
    });
  });
});
