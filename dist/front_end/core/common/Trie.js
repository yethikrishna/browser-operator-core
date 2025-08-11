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
var _Trie_size, _Trie_root, _Trie_edges, _Trie_isWord, _Trie_wordsInSubtree, _Trie_freeNodes, _Trie_traitImpl;
export class Trie {
    constructor(traitImpl) {
        _Trie_size.set(this, void 0);
        _Trie_root.set(this, void 0);
        _Trie_edges.set(this, void 0);
        _Trie_isWord.set(this, void 0);
        _Trie_wordsInSubtree.set(this, void 0);
        _Trie_freeNodes.set(this, void 0);
        _Trie_traitImpl.set(this, void 0);
        __classPrivateFieldSet(this, _Trie_root, 0, "f");
        __classPrivateFieldSet(this, _Trie_traitImpl, traitImpl, "f");
        this.clear();
    }
    static newStringTrie() {
        return new Trie({
            empty: () => '',
            append: (base, appendage) => base + appendage,
            slice: (base, start, end) => base.slice(start, end),
        });
    }
    static newArrayTrie() {
        return new Trie({
            empty: () => [],
            append: (base, appendage) => base.concat([appendage]),
            slice: (base, start, end) => base.slice(start, end),
        });
    }
    add(word) {
        var _a, _b;
        let node = __classPrivateFieldGet(this, _Trie_root, "f");
        ++__classPrivateFieldGet(this, _Trie_wordsInSubtree, "f")[__classPrivateFieldGet(this, _Trie_root, "f")];
        for (let i = 0; i < word.length; ++i) {
            const edge = word[i];
            let next = __classPrivateFieldGet(this, _Trie_edges, "f")[node].get(edge);
            if (!next) {
                if (__classPrivateFieldGet(this, _Trie_freeNodes, "f").length) {
                    next = __classPrivateFieldGet(this, _Trie_freeNodes, "f").pop();
                }
                else {
                    next = (__classPrivateFieldSet(this, _Trie_size, (_b = __classPrivateFieldGet(this, _Trie_size, "f"), _a = _b++, _b), "f"), _a);
                    __classPrivateFieldGet(this, _Trie_isWord, "f").push(false);
                    __classPrivateFieldGet(this, _Trie_wordsInSubtree, "f").push(0);
                    __classPrivateFieldGet(this, _Trie_edges, "f").push(new Map());
                }
                __classPrivateFieldGet(this, _Trie_edges, "f")[node].set(edge, next);
            }
            ++__classPrivateFieldGet(this, _Trie_wordsInSubtree, "f")[next];
            node = next;
        }
        __classPrivateFieldGet(this, _Trie_isWord, "f")[node] = true;
    }
    remove(word) {
        if (!this.has(word)) {
            return false;
        }
        let node = __classPrivateFieldGet(this, _Trie_root, "f");
        --__classPrivateFieldGet(this, _Trie_wordsInSubtree, "f")[__classPrivateFieldGet(this, _Trie_root, "f")];
        for (let i = 0; i < word.length; ++i) {
            const edge = word[i];
            const next = __classPrivateFieldGet(this, _Trie_edges, "f")[node].get(edge);
            if (!--__classPrivateFieldGet(this, _Trie_wordsInSubtree, "f")[next]) {
                __classPrivateFieldGet(this, _Trie_edges, "f")[node].delete(edge);
                __classPrivateFieldGet(this, _Trie_freeNodes, "f").push(next);
            }
            node = next;
        }
        __classPrivateFieldGet(this, _Trie_isWord, "f")[node] = false;
        return true;
    }
    has(word) {
        let node = __classPrivateFieldGet(this, _Trie_root, "f");
        for (let i = 0; i < word.length; ++i) {
            node = __classPrivateFieldGet(this, _Trie_edges, "f")[node].get(word[i]);
            if (!node) {
                return false;
            }
        }
        return __classPrivateFieldGet(this, _Trie_isWord, "f")[node];
    }
    words(prefix) {
        prefix = prefix ?? __classPrivateFieldGet(this, _Trie_traitImpl, "f").empty();
        let node = __classPrivateFieldGet(this, _Trie_root, "f");
        for (let i = 0; i < prefix.length; ++i) {
            node = __classPrivateFieldGet(this, _Trie_edges, "f")[node].get(prefix[i]);
            if (!node) {
                return [];
            }
        }
        const results = [];
        this.dfs(node, prefix, results);
        return results;
    }
    dfs(node, prefix, results) {
        if (__classPrivateFieldGet(this, _Trie_isWord, "f")[node]) {
            results.push(prefix);
        }
        const edges = __classPrivateFieldGet(this, _Trie_edges, "f")[node];
        for (const [edge, node] of edges) {
            const newPrefix = __classPrivateFieldGet(this, _Trie_traitImpl, "f").append(prefix, edge);
            this.dfs(node, newPrefix, results);
        }
    }
    longestPrefix(word, fullWordOnly) {
        let node = __classPrivateFieldGet(this, _Trie_root, "f");
        let wordIndex = 0;
        for (let i = 0; i < word.length; ++i) {
            node = __classPrivateFieldGet(this, _Trie_edges, "f")[node].get(word[i]);
            if (!node) {
                break;
            }
            if (!fullWordOnly || __classPrivateFieldGet(this, _Trie_isWord, "f")[node]) {
                wordIndex = i + 1;
            }
        }
        return __classPrivateFieldGet(this, _Trie_traitImpl, "f").slice(word, 0, wordIndex);
    }
    clear() {
        __classPrivateFieldSet(this, _Trie_size, 1, "f");
        __classPrivateFieldSet(this, _Trie_root, 0, "f");
        __classPrivateFieldSet(this, _Trie_edges, [new Map()], "f");
        __classPrivateFieldSet(this, _Trie_isWord, [false], "f");
        __classPrivateFieldSet(this, _Trie_wordsInSubtree, [0], "f");
        __classPrivateFieldSet(this, _Trie_freeNodes, [], "f");
    }
}
_Trie_size = new WeakMap(), _Trie_root = new WeakMap(), _Trie_edges = new WeakMap(), _Trie_isWord = new WeakMap(), _Trie_wordsInSubtree = new WeakMap(), _Trie_freeNodes = new WeakMap(), _Trie_traitImpl = new WeakMap();
//# sourceMappingURL=Trie.js.map