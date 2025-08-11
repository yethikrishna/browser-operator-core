// Copyright 2024 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SplitBigUint32ArrayImpl_data, _SplitBigUint32ArrayImpl_partLength;
/**
 * @returns A BigUint32Array implementation which is based on Array.
 * This means that its length automatically expands to include the highest index
 * used, and asArrayOrFail will succeed.
 */
export function createExpandableBigUint32Array() {
    return new ExpandableBigUint32ArrayImpl();
}
/**
 * @returns A BigUint32Array implementation which is based on Uint32Array.
 * If the length is small enough to fit in a single Uint32Array, then
 * asUint32ArrayOrFail will succeed. Otherwise, it will throw an exception.
 */
export function createFixedBigUint32Array(length, maxLengthForTesting) {
    try {
        if (maxLengthForTesting !== undefined && length > maxLengthForTesting) {
            // Simulate allocation failure.
            throw new RangeError();
        }
        return new BasicBigUint32ArrayImpl(length);
    }
    catch {
        // We couldn't allocate a big enough ArrayBuffer.
        return new SplitBigUint32ArrayImpl(length, maxLengthForTesting);
    }
}
class BasicBigUint32ArrayImpl extends Uint32Array {
    getValue(index) {
        return this[index];
    }
    setValue(index, value) {
        this[index] = value;
    }
    asUint32ArrayOrFail() {
        return this;
    }
    asArrayOrFail() {
        throw new Error('Not an array');
    }
}
class SplitBigUint32ArrayImpl {
    constructor(length, maxLengthForTesting) {
        _SplitBigUint32ArrayImpl_data.set(this, void 0);
        _SplitBigUint32ArrayImpl_partLength.set(this, void 0);
        __classPrivateFieldSet(this, _SplitBigUint32ArrayImpl_data, [], "f");
        this.length = length;
        let partCount = 1;
        while (true) {
            partCount *= 2;
            __classPrivateFieldSet(this, _SplitBigUint32ArrayImpl_partLength, Math.ceil(length / partCount), "f");
            try {
                if (maxLengthForTesting !== undefined && __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_partLength, "f") > maxLengthForTesting) {
                    // Simulate allocation failure.
                    throw new RangeError();
                }
                for (let i = 0; i < partCount; ++i) {
                    __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_data, "f")[i] = new Uint32Array(__classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_partLength, "f"));
                }
                return;
            }
            catch (e) {
                if (__classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_partLength, "f") < 1e6) {
                    // The length per part is already small, so continuing to subdivide it
                    // will probably not help.
                    throw e;
                }
            }
        }
    }
    getValue(index) {
        if (index >= 0 && index < this.length) {
            const partLength = __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_partLength, "f");
            return __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_data, "f")[Math.floor(index / partLength)][index % partLength];
        }
        // On out-of-bounds accesses, match the behavior of Uint32Array: return an
        // undefined value that's incorrectly typed as number.
        return __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_data, "f")[0][-1];
    }
    setValue(index, value) {
        if (index >= 0 && index < this.length) {
            const partLength = __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_partLength, "f");
            __classPrivateFieldGet(this, _SplitBigUint32ArrayImpl_data, "f")[Math.floor(index / partLength)][index % partLength] = value;
        }
        // Attempting to set a value out of bounds does nothing, like Uint32Array.
    }
    asUint32ArrayOrFail() {
        throw new Error('Not a Uint32Array');
    }
    asArrayOrFail() {
        throw new Error('Not an array');
    }
}
_SplitBigUint32ArrayImpl_data = new WeakMap(), _SplitBigUint32ArrayImpl_partLength = new WeakMap();
class ExpandableBigUint32ArrayImpl extends Array {
    getValue(index) {
        return this[index];
    }
    setValue(index, value) {
        this[index] = value;
    }
    asUint32ArrayOrFail() {
        throw new Error('Not a Uint32Array');
    }
    asArrayOrFail() {
        return this;
    }
}
export function createBitVector(lengthOrBuffer) {
    return new BitVectorImpl(lengthOrBuffer);
}
class BitVectorImpl extends Uint8Array {
    constructor(lengthOrBuffer) {
        if (typeof lengthOrBuffer === 'number') {
            super(Math.ceil(lengthOrBuffer / 8));
        }
        else {
            super(lengthOrBuffer);
        }
    }
    getBit(index) {
        const value = this[index >> 3] & (1 << (index & 7));
        return value !== 0;
    }
    setBit(index) {
        this[index >> 3] |= (1 << (index & 7));
    }
    clearBit(index) {
        this[index >> 3] &= ~(1 << (index & 7));
    }
    previous(index) {
        // First, check for more bits in the current byte.
        while (index !== ((index >> 3) << 3)) {
            --index;
            if (this.getBit(index)) {
                return index;
            }
        }
        // Next, iterate by bytes to skip over ranges of zeros.
        let byteIndex = (index >> 3) - 1;
        while (byteIndex >= 0 && this[byteIndex] === 0) {
            --byteIndex;
        }
        if (byteIndex < 0) {
            return -1;
        }
        // Finally, iterate the nonzero byte to find the highest bit.
        for (index = (byteIndex << 3) + 7; index >= (byteIndex << 3); --index) {
            if (this.getBit(index)) {
                return index;
            }
        }
        throw new Error('Unreachable');
    }
}
//# sourceMappingURL=TypedArrayUtilities.js.map