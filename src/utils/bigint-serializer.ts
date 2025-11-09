/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// Extend BigInt to support toJSON serialization
declare global {
  interface BigInt {
    toJSON(): number;
  }
}

export function enableBigIntJsonSerialization(): void {
  const hasToJson: boolean = Object.prototype.hasOwnProperty.call(
    BigInt.prototype,
    'toJSON',
  );

  if (!hasToJson) {
    const descriptor: PropertyDescriptor & ThisType<bigint> = {
      value(this: bigint): number {
        const value = Number(this);

        if (!Number.isSafeInteger(value)) {
          throw new Error(
            `BigInt value ${this.toString()} is too large to be represented as a safe number.`,
          );
        }

        return value;
      },
      writable: false,
      enumerable: false,
    };

    Object.defineProperty(BigInt.prototype, 'toJSON', descriptor);
  }
}

export {};
