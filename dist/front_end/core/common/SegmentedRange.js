// Copyright 2016 The Chromium Authors. All rights reserved.
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
var _SegmentedRange_segmentsInternal, _SegmentedRange_mergeCallback;
import * as Platform from '../platform/platform.js';
export class Segment {
    constructor(begin, end, data) {
        if (begin > end) {
            throw new Error('Invalid segment');
        }
        this.begin = begin;
        this.end = end;
        this.data = data;
    }
    intersects(that) {
        return this.begin < that.end && that.begin < this.end;
    }
}
export class SegmentedRange {
    constructor(mergeCallback) {
        _SegmentedRange_segmentsInternal.set(this, void 0);
        _SegmentedRange_mergeCallback.set(this, void 0);
        __classPrivateFieldSet(this, _SegmentedRange_segmentsInternal, [], "f");
        __classPrivateFieldSet(this, _SegmentedRange_mergeCallback, mergeCallback, "f");
    }
    append(newSegment) {
        // 1. Find the proper insertion point for new segment
        let startIndex = Platform.ArrayUtilities.lowerBound(__classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f"), newSegment, (a, b) => a.begin - b.begin);
        let endIndex = startIndex;
        let merged = null;
        if (startIndex > 0) {
            // 2. Try mering the preceding segment
            const precedingSegment = __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f")[startIndex - 1];
            merged = this.tryMerge(precedingSegment, newSegment);
            if (merged) {
                --startIndex;
                newSegment = merged;
            }
            else if (__classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f")[startIndex - 1].end >= newSegment.begin) {
                // 2a. If merge failed and segments overlap, adjust preceding segment.
                // If an old segment entirely contains new one, split it in two.
                if (newSegment.end < precedingSegment.end) {
                    __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f").splice(startIndex, 0, new Segment(newSegment.end, precedingSegment.end, precedingSegment.data));
                }
                precedingSegment.end = newSegment.begin;
            }
        }
        // 3. Consume all segments that are entirely covered by the new one.
        while (endIndex < __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f").length && __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f")[endIndex].end <= newSegment.end) {
            ++endIndex;
        }
        // 4. Merge or adjust the succeeding segment if it overlaps.
        if (endIndex < __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f").length) {
            merged = this.tryMerge(newSegment, __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f")[endIndex]);
            if (merged) {
                endIndex++;
                newSegment = merged;
            }
            else if (newSegment.intersects(__classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f")[endIndex])) {
                __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f")[endIndex].begin = newSegment.end;
            }
        }
        __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f").splice(startIndex, endIndex - startIndex, newSegment);
    }
    segments() {
        return __classPrivateFieldGet(this, _SegmentedRange_segmentsInternal, "f");
    }
    tryMerge(first, second) {
        const merged = __classPrivateFieldGet(this, _SegmentedRange_mergeCallback, "f") && __classPrivateFieldGet(this, _SegmentedRange_mergeCallback, "f").call(this, first, second);
        if (!merged) {
            return null;
        }
        merged.begin = first.begin;
        merged.end = Math.max(first.end, second.end);
        return merged;
    }
}
_SegmentedRange_segmentsInternal = new WeakMap(), _SegmentedRange_mergeCallback = new WeakMap();
//# sourceMappingURL=SegmentedRange.js.map