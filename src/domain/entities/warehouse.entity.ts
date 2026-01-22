export class Warehouse {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly code: string,
    public readonly address: string | null,
    public readonly city: string | null,
    public readonly country: string,
    public isActive: boolean,
    public isPrimary: boolean,
    public readonly createdAt: Date,
    public updatedAt: Date,
  ) {}

  static create(
    id: string,
    name: string,
    code: string,
    country: string = 'Morocco',
  ): Warehouse {
    return new Warehouse(
      id,
      name,
      code,
      null,
      null,
      country,
      true,
      false,
      new Date(),
      new Date(),
    );
  }

  deactivate(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }

  activate(): void {
    this.isActive = true;
    this.updatedAt = new Date();
  }

  setPrimary(): void {
    this.isPrimary = true;
    this.updatedAt = new Date();
  }
}
