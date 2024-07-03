// build/dev/javascript/prelude.mjs
var CustomType = class {
  withFields(fields) {
    let properties = Object.keys(this).map(
      (label) => label in fields ? fields[label] : this[label]
    );
    return new this.constructor(...properties);
  }
};
var List = class {
  static fromArray(array, tail) {
    let t = tail || new Empty();
    for (let i = array.length - 1; i >= 0; --i) {
      t = new NonEmpty(array[i], t);
    }
    return t;
  }
  [Symbol.iterator]() {
    return new ListIterator(this);
  }
  toArray() {
    return [...this];
  }
  // @internal
  atLeastLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return true;
      desired--;
    }
    return desired <= 0;
  }
  // @internal
  hasLength(desired) {
    for (let _ of this) {
      if (desired <= 0)
        return false;
      desired--;
    }
    return desired === 0;
  }
  countLength() {
    let length2 = 0;
    for (let _ of this)
      length2++;
    return length2;
  }
};
function prepend(element2, tail) {
  return new NonEmpty(element2, tail);
}
function toList(elements, tail) {
  return List.fromArray(elements, tail);
}
var ListIterator = class {
  #current;
  constructor(current) {
    this.#current = current;
  }
  next() {
    if (this.#current instanceof Empty) {
      return { done: true };
    } else {
      let { head, tail } = this.#current;
      this.#current = tail;
      return { value: head, done: false };
    }
  }
};
var Empty = class extends List {
};
var NonEmpty = class extends List {
  constructor(head, tail) {
    super();
    this.head = head;
    this.tail = tail;
  }
};
var BitArray = class _BitArray {
  constructor(buffer) {
    if (!(buffer instanceof Uint8Array)) {
      throw "BitArray can only be constructed from a Uint8Array";
    }
    this.buffer = buffer;
  }
  // @internal
  get length() {
    return this.buffer.length;
  }
  // @internal
  byteAt(index2) {
    return this.buffer[index2];
  }
  // @internal
  floatAt(index2) {
    return byteArrayToFloat(this.buffer.slice(index2, index2 + 8));
  }
  // @internal
  intFromSlice(start2, end) {
    return byteArrayToInt(this.buffer.slice(start2, end));
  }
  // @internal
  binaryFromSlice(start2, end) {
    return new _BitArray(this.buffer.slice(start2, end));
  }
  // @internal
  sliceAfter(index2) {
    return new _BitArray(this.buffer.slice(index2));
  }
};
var UtfCodepoint = class {
  constructor(value2) {
    this.value = value2;
  }
};
function byteArrayToInt(byteArray) {
  byteArray = byteArray.reverse();
  let value2 = 0;
  for (let i = byteArray.length - 1; i >= 0; i--) {
    value2 = value2 * 256 + byteArray[i];
  }
  return value2;
}
function byteArrayToFloat(byteArray) {
  return new Float64Array(byteArray.reverse().buffer)[0];
}
function isEqual(x, y) {
  let values = [x, y];
  while (values.length) {
    let a = values.pop();
    let b = values.pop();
    if (a === b)
      continue;
    if (!isObject(a) || !isObject(b))
      return false;
    let unequal = !structurallyCompatibleObjects(a, b) || unequalDates(a, b) || unequalBuffers(a, b) || unequalArrays(a, b) || unequalMaps(a, b) || unequalSets(a, b) || unequalRegExps(a, b);
    if (unequal)
      return false;
    const proto = Object.getPrototypeOf(a);
    if (proto !== null && typeof proto.equals === "function") {
      try {
        if (a.equals(b))
          continue;
        else
          return false;
      } catch {
      }
    }
    let [keys, get2] = getters(a);
    for (let k of keys(a)) {
      values.push(get2(a, k), get2(b, k));
    }
  }
  return true;
}
function getters(object) {
  if (object instanceof Map) {
    return [(x) => x.keys(), (x, y) => x.get(y)];
  } else {
    let extra = object instanceof globalThis.Error ? ["message"] : [];
    return [(x) => [...extra, ...Object.keys(x)], (x, y) => x[y]];
  }
}
function unequalDates(a, b) {
  return a instanceof Date && (a > b || a < b);
}
function unequalBuffers(a, b) {
  return a.buffer instanceof ArrayBuffer && a.BYTES_PER_ELEMENT && !(a.byteLength === b.byteLength && a.every((n, i) => n === b[i]));
}
function unequalArrays(a, b) {
  return Array.isArray(a) && a.length !== b.length;
}
function unequalMaps(a, b) {
  return a instanceof Map && a.size !== b.size;
}
function unequalSets(a, b) {
  return a instanceof Set && (a.size != b.size || [...a].some((e) => !b.has(e)));
}
function unequalRegExps(a, b) {
  return a instanceof RegExp && (a.source !== b.source || a.flags !== b.flags);
}
function isObject(a) {
  return typeof a === "object" && a !== null;
}
function structurallyCompatibleObjects(a, b) {
  if (typeof a !== "object" && typeof b !== "object" && (!a || !b))
    return false;
  let nonstructural = [Promise, WeakSet, WeakMap, Function];
  if (nonstructural.some((c) => a instanceof c))
    return false;
  return a.constructor === b.constructor;
}
function makeError(variant, module, line, fn, message, extra) {
  let error = new globalThis.Error(message);
  error.gleam_error = variant;
  error.module = module;
  error.line = line;
  error.fn = fn;
  for (let k in extra)
    error[k] = extra[k];
  return error;
}

// build/dev/javascript/gleam_stdlib/gleam/option.mjs
var Some = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var None = class extends CustomType {
};

// build/dev/javascript/gleam_stdlib/gleam/list.mjs
function do_reverse(loop$remaining, loop$accumulator) {
  while (true) {
    let remaining = loop$remaining;
    let accumulator = loop$accumulator;
    if (remaining.hasLength(0)) {
      return accumulator;
    } else {
      let item = remaining.head;
      let rest$1 = remaining.tail;
      loop$remaining = rest$1;
      loop$accumulator = prepend(item, accumulator);
    }
  }
}
function reverse(xs) {
  return do_reverse(xs, toList([]));
}
function do_filter(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      let new_acc = (() => {
        let $ = fun(x);
        if ($) {
          return prepend(x, acc);
        } else {
          return acc;
        }
      })();
      loop$list = xs;
      loop$fun = fun;
      loop$acc = new_acc;
    }
  }
}
function filter(list, predicate) {
  return do_filter(list, predicate, toList([]));
}
function do_map(loop$list, loop$fun, loop$acc) {
  while (true) {
    let list = loop$list;
    let fun = loop$fun;
    let acc = loop$acc;
    if (list.hasLength(0)) {
      return reverse(acc);
    } else {
      let x = list.head;
      let xs = list.tail;
      loop$list = xs;
      loop$fun = fun;
      loop$acc = prepend(fun(x), acc);
    }
  }
}
function map(list, fun) {
  return do_map(list, fun, toList([]));
}
function drop(loop$list, loop$n) {
  while (true) {
    let list = loop$list;
    let n = loop$n;
    let $ = n <= 0;
    if ($) {
      return list;
    } else {
      if (list.hasLength(0)) {
        return toList([]);
      } else {
        let xs = list.tail;
        loop$list = xs;
        loop$n = n - 1;
      }
    }
  }
}
function do_take(loop$list, loop$n, loop$acc) {
  while (true) {
    let list = loop$list;
    let n = loop$n;
    let acc = loop$acc;
    let $ = n <= 0;
    if ($) {
      return reverse(acc);
    } else {
      if (list.hasLength(0)) {
        return reverse(acc);
      } else {
        let x = list.head;
        let xs = list.tail;
        loop$list = xs;
        loop$n = n - 1;
        loop$acc = prepend(x, acc);
      }
    }
  }
}
function take(list, n) {
  return do_take(list, n, toList([]));
}
function do_append(loop$first, loop$second) {
  while (true) {
    let first = loop$first;
    let second = loop$second;
    if (first.hasLength(0)) {
      return second;
    } else {
      let item = first.head;
      let rest$1 = first.tail;
      loop$first = rest$1;
      loop$second = prepend(item, second);
    }
  }
}
function append(first, second) {
  return do_append(reverse(first), second);
}
function reverse_and_prepend(loop$prefix, loop$suffix) {
  while (true) {
    let prefix = loop$prefix;
    let suffix = loop$suffix;
    if (prefix.hasLength(0)) {
      return suffix;
    } else {
      let first$1 = prefix.head;
      let rest$1 = prefix.tail;
      loop$prefix = rest$1;
      loop$suffix = prepend(first$1, suffix);
    }
  }
}
function do_concat(loop$lists, loop$acc) {
  while (true) {
    let lists = loop$lists;
    let acc = loop$acc;
    if (lists.hasLength(0)) {
      return reverse(acc);
    } else {
      let list = lists.head;
      let further_lists = lists.tail;
      loop$lists = further_lists;
      loop$acc = reverse_and_prepend(list, acc);
    }
  }
}
function flatten(lists) {
  return do_concat(lists, toList([]));
}
function fold(loop$list, loop$initial, loop$fun) {
  while (true) {
    let list = loop$list;
    let initial = loop$initial;
    let fun = loop$fun;
    if (list.hasLength(0)) {
      return initial;
    } else {
      let x = list.head;
      let rest$1 = list.tail;
      loop$list = rest$1;
      loop$initial = fun(initial, x);
      loop$fun = fun;
    }
  }
}

// build/dev/javascript/gleam_stdlib/gleam/string_builder.mjs
function to_string(builder) {
  return identity(builder);
}

// build/dev/javascript/gleam_stdlib/dict.mjs
var referenceMap = /* @__PURE__ */ new WeakMap();
var tempDataView = new DataView(new ArrayBuffer(8));
var referenceUID = 0;
function hashByReference(o) {
  const known = referenceMap.get(o);
  if (known !== void 0) {
    return known;
  }
  const hash = referenceUID++;
  if (referenceUID === 2147483647) {
    referenceUID = 0;
  }
  referenceMap.set(o, hash);
  return hash;
}
function hashMerge(a, b) {
  return a ^ b + 2654435769 + (a << 6) + (a >> 2) | 0;
}
function hashString(s) {
  let hash = 0;
  const len = s.length;
  for (let i = 0; i < len; i++) {
    hash = Math.imul(31, hash) + s.charCodeAt(i) | 0;
  }
  return hash;
}
function hashNumber(n) {
  tempDataView.setFloat64(0, n);
  const i = tempDataView.getInt32(0);
  const j = tempDataView.getInt32(4);
  return Math.imul(73244475, i >> 16 ^ i) ^ j;
}
function hashBigInt(n) {
  return hashString(n.toString());
}
function hashObject(o) {
  const proto = Object.getPrototypeOf(o);
  if (proto !== null && typeof proto.hashCode === "function") {
    try {
      const code = o.hashCode(o);
      if (typeof code === "number") {
        return code;
      }
    } catch {
    }
  }
  if (o instanceof Promise || o instanceof WeakSet || o instanceof WeakMap) {
    return hashByReference(o);
  }
  if (o instanceof Date) {
    return hashNumber(o.getTime());
  }
  let h = 0;
  if (o instanceof ArrayBuffer) {
    o = new Uint8Array(o);
  }
  if (Array.isArray(o) || o instanceof Uint8Array) {
    for (let i = 0; i < o.length; i++) {
      h = Math.imul(31, h) + getHash(o[i]) | 0;
    }
  } else if (o instanceof Set) {
    o.forEach((v) => {
      h = h + getHash(v) | 0;
    });
  } else if (o instanceof Map) {
    o.forEach((v, k) => {
      h = h + hashMerge(getHash(v), getHash(k)) | 0;
    });
  } else {
    const keys = Object.keys(o);
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      const v = o[k];
      h = h + hashMerge(getHash(v), hashString(k)) | 0;
    }
  }
  return h;
}
function getHash(u) {
  if (u === null)
    return 1108378658;
  if (u === void 0)
    return 1108378659;
  if (u === true)
    return 1108378657;
  if (u === false)
    return 1108378656;
  switch (typeof u) {
    case "number":
      return hashNumber(u);
    case "string":
      return hashString(u);
    case "bigint":
      return hashBigInt(u);
    case "object":
      return hashObject(u);
    case "symbol":
      return hashByReference(u);
    case "function":
      return hashByReference(u);
    default:
      return 0;
  }
}
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;
var ENTRY = 0;
var ARRAY_NODE = 1;
var INDEX_NODE = 2;
var COLLISION_NODE = 3;
var EMPTY = {
  type: INDEX_NODE,
  bitmap: 0,
  array: []
};
function mask(hash, shift) {
  return hash >>> shift & MASK;
}
function bitpos(hash, shift) {
  return 1 << mask(hash, shift);
}
function bitcount(x) {
  x -= x >> 1 & 1431655765;
  x = (x & 858993459) + (x >> 2 & 858993459);
  x = x + (x >> 4) & 252645135;
  x += x >> 8;
  x += x >> 16;
  return x & 127;
}
function index(bitmap, bit) {
  return bitcount(bitmap & bit - 1);
}
function cloneAndSet(arr, at, val) {
  const len = arr.length;
  const out = new Array(len);
  for (let i = 0; i < len; ++i) {
    out[i] = arr[i];
  }
  out[at] = val;
  return out;
}
function spliceIn(arr, at, val) {
  const len = arr.length;
  const out = new Array(len + 1);
  let i = 0;
  let g = 0;
  while (i < at) {
    out[g++] = arr[i++];
  }
  out[g++] = val;
  while (i < len) {
    out[g++] = arr[i++];
  }
  return out;
}
function spliceOut(arr, at) {
  const len = arr.length;
  const out = new Array(len - 1);
  let i = 0;
  let g = 0;
  while (i < at) {
    out[g++] = arr[i++];
  }
  ++i;
  while (i < len) {
    out[g++] = arr[i++];
  }
  return out;
}
function createNode(shift, key1, val1, key2hash, key2, val2) {
  const key1hash = getHash(key1);
  if (key1hash === key2hash) {
    return {
      type: COLLISION_NODE,
      hash: key1hash,
      array: [
        { type: ENTRY, k: key1, v: val1 },
        { type: ENTRY, k: key2, v: val2 }
      ]
    };
  }
  const addedLeaf = { val: false };
  return assoc(
    assocIndex(EMPTY, shift, key1hash, key1, val1, addedLeaf),
    shift,
    key2hash,
    key2,
    val2,
    addedLeaf
  );
}
function assoc(root, shift, hash, key, val, addedLeaf) {
  switch (root.type) {
    case ARRAY_NODE:
      return assocArray(root, shift, hash, key, val, addedLeaf);
    case INDEX_NODE:
      return assocIndex(root, shift, hash, key, val, addedLeaf);
    case COLLISION_NODE:
      return assocCollision(root, shift, hash, key, val, addedLeaf);
  }
}
function assocArray(root, shift, hash, key, val, addedLeaf) {
  const idx = mask(hash, shift);
  const node = root.array[idx];
  if (node === void 0) {
    addedLeaf.val = true;
    return {
      type: ARRAY_NODE,
      size: root.size + 1,
      array: cloneAndSet(root.array, idx, { type: ENTRY, k: key, v: val })
    };
  }
  if (node.type === ENTRY) {
    if (isEqual(key, node.k)) {
      if (val === node.v) {
        return root;
      }
      return {
        type: ARRAY_NODE,
        size: root.size,
        array: cloneAndSet(root.array, idx, {
          type: ENTRY,
          k: key,
          v: val
        })
      };
    }
    addedLeaf.val = true;
    return {
      type: ARRAY_NODE,
      size: root.size,
      array: cloneAndSet(
        root.array,
        idx,
        createNode(shift + SHIFT, node.k, node.v, hash, key, val)
      )
    };
  }
  const n = assoc(node, shift + SHIFT, hash, key, val, addedLeaf);
  if (n === node) {
    return root;
  }
  return {
    type: ARRAY_NODE,
    size: root.size,
    array: cloneAndSet(root.array, idx, n)
  };
}
function assocIndex(root, shift, hash, key, val, addedLeaf) {
  const bit = bitpos(hash, shift);
  const idx = index(root.bitmap, bit);
  if ((root.bitmap & bit) !== 0) {
    const node = root.array[idx];
    if (node.type !== ENTRY) {
      const n = assoc(node, shift + SHIFT, hash, key, val, addedLeaf);
      if (n === node) {
        return root;
      }
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap,
        array: cloneAndSet(root.array, idx, n)
      };
    }
    const nodeKey = node.k;
    if (isEqual(key, nodeKey)) {
      if (val === node.v) {
        return root;
      }
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap,
        array: cloneAndSet(root.array, idx, {
          type: ENTRY,
          k: key,
          v: val
        })
      };
    }
    addedLeaf.val = true;
    return {
      type: INDEX_NODE,
      bitmap: root.bitmap,
      array: cloneAndSet(
        root.array,
        idx,
        createNode(shift + SHIFT, nodeKey, node.v, hash, key, val)
      )
    };
  } else {
    const n = root.array.length;
    if (n >= MAX_INDEX_NODE) {
      const nodes = new Array(32);
      const jdx = mask(hash, shift);
      nodes[jdx] = assocIndex(EMPTY, shift + SHIFT, hash, key, val, addedLeaf);
      let j = 0;
      let bitmap = root.bitmap;
      for (let i = 0; i < 32; i++) {
        if ((bitmap & 1) !== 0) {
          const node = root.array[j++];
          nodes[i] = node;
        }
        bitmap = bitmap >>> 1;
      }
      return {
        type: ARRAY_NODE,
        size: n + 1,
        array: nodes
      };
    } else {
      const newArray = spliceIn(root.array, idx, {
        type: ENTRY,
        k: key,
        v: val
      });
      addedLeaf.val = true;
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap | bit,
        array: newArray
      };
    }
  }
}
function assocCollision(root, shift, hash, key, val, addedLeaf) {
  if (hash === root.hash) {
    const idx = collisionIndexOf(root, key);
    if (idx !== -1) {
      const entry = root.array[idx];
      if (entry.v === val) {
        return root;
      }
      return {
        type: COLLISION_NODE,
        hash,
        array: cloneAndSet(root.array, idx, { type: ENTRY, k: key, v: val })
      };
    }
    const size = root.array.length;
    addedLeaf.val = true;
    return {
      type: COLLISION_NODE,
      hash,
      array: cloneAndSet(root.array, size, { type: ENTRY, k: key, v: val })
    };
  }
  return assoc(
    {
      type: INDEX_NODE,
      bitmap: bitpos(root.hash, shift),
      array: [root]
    },
    shift,
    hash,
    key,
    val,
    addedLeaf
  );
}
function collisionIndexOf(root, key) {
  const size = root.array.length;
  for (let i = 0; i < size; i++) {
    if (isEqual(key, root.array[i].k)) {
      return i;
    }
  }
  return -1;
}
function find(root, shift, hash, key) {
  switch (root.type) {
    case ARRAY_NODE:
      return findArray(root, shift, hash, key);
    case INDEX_NODE:
      return findIndex(root, shift, hash, key);
    case COLLISION_NODE:
      return findCollision(root, key);
  }
}
function findArray(root, shift, hash, key) {
  const idx = mask(hash, shift);
  const node = root.array[idx];
  if (node === void 0) {
    return void 0;
  }
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash, key);
  }
  if (isEqual(key, node.k)) {
    return node;
  }
  return void 0;
}
function findIndex(root, shift, hash, key) {
  const bit = bitpos(hash, shift);
  if ((root.bitmap & bit) === 0) {
    return void 0;
  }
  const idx = index(root.bitmap, bit);
  const node = root.array[idx];
  if (node.type !== ENTRY) {
    return find(node, shift + SHIFT, hash, key);
  }
  if (isEqual(key, node.k)) {
    return node;
  }
  return void 0;
}
function findCollision(root, key) {
  const idx = collisionIndexOf(root, key);
  if (idx < 0) {
    return void 0;
  }
  return root.array[idx];
}
function without(root, shift, hash, key) {
  switch (root.type) {
    case ARRAY_NODE:
      return withoutArray(root, shift, hash, key);
    case INDEX_NODE:
      return withoutIndex(root, shift, hash, key);
    case COLLISION_NODE:
      return withoutCollision(root, key);
  }
}
function withoutArray(root, shift, hash, key) {
  const idx = mask(hash, shift);
  const node = root.array[idx];
  if (node === void 0) {
    return root;
  }
  let n = void 0;
  if (node.type === ENTRY) {
    if (!isEqual(node.k, key)) {
      return root;
    }
  } else {
    n = without(node, shift + SHIFT, hash, key);
    if (n === node) {
      return root;
    }
  }
  if (n === void 0) {
    if (root.size <= MIN_ARRAY_NODE) {
      const arr = root.array;
      const out = new Array(root.size - 1);
      let i = 0;
      let j = 0;
      let bitmap = 0;
      while (i < idx) {
        const nv = arr[i];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i;
          ++j;
        }
        ++i;
      }
      ++i;
      while (i < arr.length) {
        const nv = arr[i];
        if (nv !== void 0) {
          out[j] = nv;
          bitmap |= 1 << i;
          ++j;
        }
        ++i;
      }
      return {
        type: INDEX_NODE,
        bitmap,
        array: out
      };
    }
    return {
      type: ARRAY_NODE,
      size: root.size - 1,
      array: cloneAndSet(root.array, idx, n)
    };
  }
  return {
    type: ARRAY_NODE,
    size: root.size,
    array: cloneAndSet(root.array, idx, n)
  };
}
function withoutIndex(root, shift, hash, key) {
  const bit = bitpos(hash, shift);
  if ((root.bitmap & bit) === 0) {
    return root;
  }
  const idx = index(root.bitmap, bit);
  const node = root.array[idx];
  if (node.type !== ENTRY) {
    const n = without(node, shift + SHIFT, hash, key);
    if (n === node) {
      return root;
    }
    if (n !== void 0) {
      return {
        type: INDEX_NODE,
        bitmap: root.bitmap,
        array: cloneAndSet(root.array, idx, n)
      };
    }
    if (root.bitmap === bit) {
      return void 0;
    }
    return {
      type: INDEX_NODE,
      bitmap: root.bitmap ^ bit,
      array: spliceOut(root.array, idx)
    };
  }
  if (isEqual(key, node.k)) {
    if (root.bitmap === bit) {
      return void 0;
    }
    return {
      type: INDEX_NODE,
      bitmap: root.bitmap ^ bit,
      array: spliceOut(root.array, idx)
    };
  }
  return root;
}
function withoutCollision(root, key) {
  const idx = collisionIndexOf(root, key);
  if (idx < 0) {
    return root;
  }
  if (root.array.length === 1) {
    return void 0;
  }
  return {
    type: COLLISION_NODE,
    hash: root.hash,
    array: spliceOut(root.array, idx)
  };
}
function forEach(root, fn) {
  if (root === void 0) {
    return;
  }
  const items = root.array;
  const size = items.length;
  for (let i = 0; i < size; i++) {
    const item = items[i];
    if (item === void 0) {
      continue;
    }
    if (item.type === ENTRY) {
      fn(item.v, item.k);
      continue;
    }
    forEach(item, fn);
  }
}
var Dict = class _Dict {
  /**
   * @template V
   * @param {Record<string,V>} o
   * @returns {Dict<string,V>}
   */
  static fromObject(o) {
    const keys = Object.keys(o);
    let m = _Dict.new();
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      m = m.set(k, o[k]);
    }
    return m;
  }
  /**
   * @template K,V
   * @param {Map<K,V>} o
   * @returns {Dict<K,V>}
   */
  static fromMap(o) {
    let m = _Dict.new();
    o.forEach((v, k) => {
      m = m.set(k, v);
    });
    return m;
  }
  static new() {
    return new _Dict(void 0, 0);
  }
  /**
   * @param {undefined | Node<K,V>} root
   * @param {number} size
   */
  constructor(root, size) {
    this.root = root;
    this.size = size;
  }
  /**
   * @template NotFound
   * @param {K} key
   * @param {NotFound} notFound
   * @returns {NotFound | V}
   */
  get(key, notFound) {
    if (this.root === void 0) {
      return notFound;
    }
    const found = find(this.root, 0, getHash(key), key);
    if (found === void 0) {
      return notFound;
    }
    return found.v;
  }
  /**
   * @param {K} key
   * @param {V} val
   * @returns {Dict<K,V>}
   */
  set(key, val) {
    const addedLeaf = { val: false };
    const root = this.root === void 0 ? EMPTY : this.root;
    const newRoot = assoc(root, 0, getHash(key), key, val, addedLeaf);
    if (newRoot === this.root) {
      return this;
    }
    return new _Dict(newRoot, addedLeaf.val ? this.size + 1 : this.size);
  }
  /**
   * @param {K} key
   * @returns {Dict<K,V>}
   */
  delete(key) {
    if (this.root === void 0) {
      return this;
    }
    const newRoot = without(this.root, 0, getHash(key), key);
    if (newRoot === this.root) {
      return this;
    }
    if (newRoot === void 0) {
      return _Dict.new();
    }
    return new _Dict(newRoot, this.size - 1);
  }
  /**
   * @param {K} key
   * @returns {boolean}
   */
  has(key) {
    if (this.root === void 0) {
      return false;
    }
    return find(this.root, 0, getHash(key), key) !== void 0;
  }
  /**
   * @returns {[K,V][]}
   */
  entries() {
    if (this.root === void 0) {
      return [];
    }
    const result = [];
    this.forEach((v, k) => result.push([k, v]));
    return result;
  }
  /**
   *
   * @param {(val:V,key:K)=>void} fn
   */
  forEach(fn) {
    forEach(this.root, fn);
  }
  hashCode() {
    let h = 0;
    this.forEach((v, k) => {
      h = h + hashMerge(getHash(v), getHash(k)) | 0;
    });
    return h;
  }
  /**
   * @param {unknown} o
   * @returns {boolean}
   */
  equals(o) {
    if (!(o instanceof _Dict) || this.size !== o.size) {
      return false;
    }
    let equal = true;
    this.forEach((v, k) => {
      equal = equal && isEqual(o.get(k, !v), v);
    });
    return equal;
  }
};

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
function identity(x) {
  return x;
}
function print_debug(string) {
  if (typeof process === "object" && process.stderr?.write) {
    process.stderr.write(string + "\n");
  } else if (typeof Deno === "object") {
    Deno.stderr.writeSync(new TextEncoder().encode(string + "\n"));
  } else {
    console.log(string);
  }
}
function inspect(v) {
  const t = typeof v;
  if (v === true)
    return "True";
  if (v === false)
    return "False";
  if (v === null)
    return "//js(null)";
  if (v === void 0)
    return "Nil";
  if (t === "string")
    return JSON.stringify(v);
  if (t === "bigint" || t === "number")
    return v.toString();
  if (Array.isArray(v))
    return `#(${v.map(inspect).join(", ")})`;
  if (v instanceof List)
    return inspectList(v);
  if (v instanceof UtfCodepoint)
    return inspectUtfCodepoint(v);
  if (v instanceof BitArray)
    return inspectBitArray(v);
  if (v instanceof CustomType)
    return inspectCustomType(v);
  if (v instanceof Dict)
    return inspectDict(v);
  if (v instanceof Set)
    return `//js(Set(${[...v].map(inspect).join(", ")}))`;
  if (v instanceof RegExp)
    return `//js(${v})`;
  if (v instanceof Date)
    return `//js(Date("${v.toISOString()}"))`;
  if (v instanceof Function) {
    const args = [];
    for (const i of Array(v.length).keys())
      args.push(String.fromCharCode(i + 97));
    return `//fn(${args.join(", ")}) { ... }`;
  }
  return inspectObject(v);
}
function inspectDict(map3) {
  let body = "dict.from_list([";
  let first = true;
  map3.forEach((value2, key) => {
    if (!first)
      body = body + ", ";
    body = body + "#(" + inspect(key) + ", " + inspect(value2) + ")";
    first = false;
  });
  return body + "])";
}
function inspectObject(v) {
  const name = Object.getPrototypeOf(v)?.constructor?.name || "Object";
  const props = [];
  for (const k of Object.keys(v)) {
    props.push(`${inspect(k)}: ${inspect(v[k])}`);
  }
  const body = props.length ? " " + props.join(", ") + " " : "";
  const head = name === "Object" ? "" : name + " ";
  return `//js(${head}{${body}})`;
}
function inspectCustomType(record) {
  const props = Object.keys(record).map((label) => {
    const value2 = inspect(record[label]);
    return isNaN(parseInt(label)) ? `${label}: ${value2}` : value2;
  }).join(", ");
  return props ? `${record.constructor.name}(${props})` : record.constructor.name;
}
function inspectList(list) {
  return `[${list.toArray().map(inspect).join(", ")}]`;
}
function inspectBitArray(bits) {
  return `<<${Array.from(bits.buffer).join(", ")}>>`;
}
function inspectUtfCodepoint(codepoint2) {
  return `//utfcodepoint(${String.fromCodePoint(codepoint2.value)})`;
}

// build/dev/javascript/gleam_stdlib/gleam/string.mjs
function inspect2(term) {
  let _pipe = inspect(term);
  return to_string(_pipe);
}

// build/dev/javascript/gleam_stdlib/gleam/io.mjs
function debug(term) {
  let _pipe = term;
  let _pipe$1 = inspect2(_pipe);
  print_debug(_pipe$1);
  return term;
}

// build/dev/javascript/iui/libs/attribute.mjs
function class$(value2) {
  return ["class", value2];
}
function style(values) {
  let res = fold(
    values,
    "",
    (res2, _use1) => {
      let key = _use1[0];
      let value2 = _use1[1];
      if (value2 === "") {
        return res2 + key + ";";
      } else {
        return res2 + key + ":" + value2 + ";";
      }
    }
  );
  return ["style", res];
}
function hidden() {
  return ["hidden", "hidden"];
}

// build/dev/javascript/iui/libs/listener.mjs
function onclick(callback) {
  return ["click", callback];
}
function onemouseover(callback) {
  return ["mouseover", callback];
}
function onmouseout(callback) {
  return ["mouseout", callback];
}
function onmousedown(callback) {
  return ["mousedown", callback];
}
function onmouseup(callback) {
  return ["mouseup", callback];
}

// build/dev/javascript/iui/document_ffi.mjs
var TEXT = "_TEXT_";
function init() {
  window.state_map = /* @__PURE__ */ new Map();
  window.stateful_component_map = /* @__PURE__ */ new Map();
  window.state_listener = /* @__PURE__ */ new Map();
}
function add_to_viewport(id, elem) {
  const viewport = document.querySelector(id);
  viewport.appendChild(elem);
}
function clear_viewport(id) {
  const viewport = document.querySelector(id);
  viewport.replaceChildren();
}
function create_text_element(id, attributes, value2) {
  const elem = document.createElement(TEXT);
  elem.innerText = value2;
  attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]));
  elem.setAttribute("id", id);
  return elem;
}
function create_element(id, tag, attributes, children, listeners) {
  const existing = document.getElementById(id);
  if (existing)
    return existing;
  const elem = document.createElement(tag);
  elem.setAttribute("id", id);
  attributes.toArray().forEach((attr) => elem.setAttribute(attr[0], attr[1]));
  children.toArray().forEach((child) => elem.appendChild(child));
  listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]));
  return elem;
}
function set_attributes(comp_id, attributes) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("set_attributes: element not found: " + comp_id);
    return false;
  }
  const keys = Object.keys(elem.attributes);
  keys.forEach((key) => {
    if (elem.attributes[key].name !== "id") {
      elem.removeAttribute(elem.attributes[key].name);
    }
  });
  attributes.toArray().forEach((attr) => add_attribute(comp_id, attr));
  return true;
}
function add_attribute(comp_id, attribute) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("add_attribute: element not found: " + comp_id);
    return false;
  }
  return handle_attribute(elem, attribute[0], attribute[1], false);
}
function remove_attribute(comp_id, attribute) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("remove_attribute: element not found: " + comp_id);
    return false;
  }
  return handle_attribute(elem, attribute[0], attribute[1], true);
}
function handle_attribute(elem, key, value2, remove) {
  if (value2 === "" || value2.length === 0) {
    elem.removeAttribute(key);
    return true;
  }
  switch (key) {
    case "class":
      value2.split(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls);
          return;
        }
        elem.classList.add(cls);
      });
      return true;
    case "style":
      value2.split(";").forEach((style2) => {
        if (!style2.includes(":")) {
          elem.style.setProperty(style2, "");
          return;
        }
        const split3 = style2.split(":");
        if (remove) {
          elem.style.removeProperty(split3[0]);
          return;
        }
        elem.style.setProperty(split3[0], split3[1].trim());
      });
      return true;
    case "hidden":
      if (remove) {
        elem.hidden = false;
        return true;
      }
      elem.hidden = true;
      return true;
    default:
      console.error("add_attribute: unknown attribute key / not implemented yet: " + key);
      return false;
  }
}
function add_listeners(comp_id, listeners) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("add_listeners: element not found: " + comp_id);
    return false;
  }
  listeners.toArray().forEach((listener) => elem.addEventListener(listener[0], listener[1]));
  return true;
}
function set_children(comp_id, children) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("set_children: element not found: " + comp_id);
    return false;
  }
  elem.replaceChildren(children.toArray());
  return true;
}
function insert_child_at(comp_id, child, at) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("insert_child_at: element not found: " + comp_id);
    return false;
  }
  if (elem.children.length <= at) {
    elem.appendChild(child);
    return true;
  }
  elem.insertBefore(child, elem.children[at]);
  return true;
}
function remove_child(comp_id, child_id) {
  const elem = document.getElementById(comp_id);
  if (!elem) {
    console.error("remove_child: element not found: " + comp_id);
    return false;
  }
  const child = elem.children[child_id];
  if (!child) {
    console.error("remove_child: child not found: " + child_id);
    return false;
  }
  elem.removeChild(child);
  return true;
}
function update_state(id, value2) {
  ;
  (window.state_listener.get(id) || []).forEach((callback) => callback(value2));
  set_state(id, value2);
}
function set_state(id, value2) {
  window.state_map.set(id, value2);
}
function get_state(id) {
  return window.state_map.get(id);
}
function add_state_listener(id, callback) {
  let current = window.state_listener.get(id) || [];
  window.state_listener.set(id, [callback, ...current]);
}

// build/dev/javascript/iui/utils_ffi.mjs
function create_id() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
}

// build/dev/javascript/iui/libs/component.mjs
var Component = class extends CustomType {
  constructor(id, tag, attributes, children, listeners) {
    super();
    this.id = id;
    this.tag = tag;
    this.attributes = attributes;
    this.children = children;
    this.listeners = listeners;
  }
};
var TextContainer = class extends CustomType {
  constructor(id, attributes, value2) {
    super();
    this.id = id;
    this.attributes = attributes;
    this.value = value2;
  }
};
var StateContainer = class extends CustomType {
  constructor(id, state_id) {
    super();
    this.id = id;
    this.state_id = state_id;
  }
};
var StatefulComponent = class extends CustomType {
  constructor(id, state_id) {
    super();
    this.id = id;
    this.state_id = state_id;
  }
};
function copy(comp) {
  let id = create_id();
  if (comp instanceof Component) {
    let tag = comp.tag;
    let attrs = comp.attributes;
    let children = comp.children;
    let listeners = comp.listeners;
    return new Component(id, tag, attrs, children, listeners);
  } else if (comp instanceof TextContainer) {
    let attrs = comp.attributes;
    let value2 = comp.value;
    return new TextContainer(id, attrs, value2);
  } else if (comp instanceof StateContainer) {
    let state_id = comp.state_id;
    return new StateContainer(id, state_id);
  } else {
    let state_id = comp.state_id;
    return new StatefulComponent(id, state_id);
  }
}
function component(tag) {
  let id = create_id();
  return new Component(id, tag, toList([]), toList([]), toList([]));
}
function set_attributes2(component2, attrs) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let tag = component2.tag;
    let children = component2.children;
    let listener = component2.listeners;
    set_attributes(id, attrs);
    return new Component(id, tag, attrs, children, listener);
  } else {
    throw makeError(
      "panic",
      "libs/component",
      62,
      "set_attributes",
      "Only Component can have attributes",
      {}
    );
  }
}
function add_attribute2(component2, attr) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let tag = component2.tag;
    let current_attrs = component2.attributes;
    let children = component2.children;
    let listener = component2.listeners;
    add_attribute(id, attr);
    return new Component(
      id,
      tag,
      append(current_attrs, toList([attr])),
      children,
      listener
    );
  } else {
    throw makeError(
      "panic",
      "libs/component",
      72,
      "add_attribute",
      "Only Component can have attributes",
      {}
    );
  }
}
function remove_attribute2(component2, attr) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let tag = component2.tag;
    let current_attrs = component2.attributes;
    let children = component2.children;
    let listener = component2.listeners;
    remove_attribute(id, attr);
    return new Component(
      id,
      tag,
      filter(current_attrs, (a) => {
        return !isEqual(a, attr);
      }),
      children,
      listener
    );
  } else {
    throw makeError(
      "panic",
      "libs/component",
      89,
      "remove_attribute",
      "Only Component can have attributes",
      {}
    );
  }
}
function add_listener(component2, listener) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let tag = component2.tag;
    let attributes = component2.attributes;
    let children = component2.children;
    let old_listener = component2.listeners;
    add_listeners(id, toList([listener]));
    return new Component(
      id,
      tag,
      attributes,
      children,
      prepend(listener, old_listener)
    );
  } else {
    throw makeError(
      "panic",
      "libs/component",
      99,
      "add_listener",
      "Only Component can have listeners",
      {}
    );
  }
}
function remove_child2(component2, child) {
  remove_child(component2.id, child.id);
  return void 0;
}
function text(attributes, value2) {
  let id = create_id();
  return new TextContainer(id, attributes, value2);
}
function element(component2) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let el = component2.tag;
    let attributes = component2.attributes;
    let children = component2.children;
    let listener = component2.listeners;
    let children$1 = map(children, element);
    let elem = create_element(id, el, attributes, children$1, listener);
    return elem;
  } else if (component2 instanceof TextContainer) {
    let id = component2.id;
    let attributes = component2.attributes;
    let value2 = component2.value;
    return create_text_element(id, attributes, value2);
  } else if (component2 instanceof StateContainer) {
    let id = component2.id;
    let state_id = component2.state_id;
    throw makeError(
      "panic",
      "libs/component",
      174,
      "element",
      "Do not use this!",
      {}
    );
  } else {
    let id = component2.id;
    let state_id = component2.state_id;
    throw makeError(
      "panic",
      "libs/component",
      178,
      "element",
      "Do not use this!",
      {}
    );
  }
}
function set_children2(component2, children) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let tag = component2.tag;
    let attributes = component2.attributes;
    let listener = component2.listeners;
    set_children(id, map(children, element));
    return new Component(id, tag, attributes, children, listener);
  } else {
    throw makeError(
      "panic",
      "libs/component",
      112,
      "set_children",
      "Only Component can have children",
      {}
    );
  }
}
function insert_child_at2(component2, child, at) {
  if (component2 instanceof Component) {
    let id = component2.id;
    let tag = component2.tag;
    let attributes = component2.attributes;
    let children = component2.children;
    let listener = component2.listeners;
    insert_child_at(id, element(child), at);
    let new$2 = flatten(
      toList([
        take(children, at),
        toList([child]),
        drop(children, at)
      ])
    );
    return new Component(id, tag, attributes, new$2, listener);
  } else {
    throw makeError(
      "panic",
      "libs/component",
      128,
      "insert_child_at",
      "Only Component can have children",
      {}
    );
  }
}
function start(component2) {
  let elem = element(component2);
  return add_to_viewport("#_app_", elem);
}

// build/dev/javascript/iui/libs/container.mjs
var VLeft = class extends CustomType {
};
var VRight = class extends CustomType {
};
var VCenter = class extends CustomType {
};
var HTop = class extends CustomType {
};
var HBottom = class extends CustomType {
};
var HCenter = class extends CustomType {
};
var Gap = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var NoSpacing = class extends CustomType {
};
var EvenSpacing = class extends CustomType {
};
var BetweenSpacing = class extends CustomType {
};
var VerticalDirection = class extends CustomType {
};
var HorizontalDirection = class extends CustomType {
};
var VerticalScroll = class extends CustomType {
};
var HorizontalScroll = class extends CustomType {
};
var Scroll = class extends CustomType {
};
var NoScroll = class extends CustomType {
};
var stack_tag = "_STACK_";
function stack(direction, align, spacing, scrolling, children) {
  let spacing$1 = (() => {
    if (spacing instanceof Gap) {
      let value2 = spacing[0];
      return ["gap", value2];
    } else if (spacing instanceof NoSpacing) {
      return ["gap", "0"];
    } else if (spacing instanceof EvenSpacing) {
      return ["justify-content", "space-evenly"];
    } else if (spacing instanceof BetweenSpacing) {
      return ["justify-content", "space-between"];
    } else {
      return ["justify-content", "space-around"];
    }
  })();
  let direction$1 = (() => {
    if (direction instanceof VerticalDirection) {
      return "column";
    } else {
      return "row";
    }
  })();
  let overflow = (() => {
    if (scrolling instanceof VerticalScroll) {
      return ["overflow-y", "auto"];
    } else if (scrolling instanceof HorizontalScroll) {
      return ["overflow-x", "auto"];
    } else if (scrolling instanceof Scroll) {
      return ["overflow", "auto"];
    } else {
      return ["overflow", "hidden"];
    }
  })();
  let _pipe = component(stack_tag);
  let _pipe$1 = set_attributes2(
    _pipe,
    toList([
      style(
        toList([
          ["height", "100%"],
          ["width", "100%"],
          ["display", "flex"],
          ["flex-direction", direction$1],
          ["align-items", align],
          overflow,
          spacing$1
        ])
      )
    ])
  );
  return ((c) => {
    let _pipe$2 = c;
    return set_children2(_pipe$2, children(c));
  })(_pipe$1);
}
function vstack(alignment, spacing, children) {
  let align = (() => {
    if (alignment instanceof VLeft) {
      return "flex-start";
    } else if (alignment instanceof VRight) {
      return "flex-end";
    } else {
      return "center";
    }
  })();
  return stack(
    new VerticalDirection(),
    align,
    spacing,
    new NoScroll(),
    children
  );
}
function hstack(alignment, spacing, children) {
  let align = (() => {
    if (alignment instanceof HTop) {
      return "flex-start";
    } else if (alignment instanceof HBottom) {
      return "flex-end";
    } else {
      return "center";
    }
  })();
  return stack(
    new HorizontalDirection(),
    align,
    spacing,
    new NoScroll(),
    children
  );
}

// build/dev/javascript/iui/libs/state.mjs
var State = class extends CustomType {
  constructor(id) {
    super();
    this.id = id;
  }
};
function from_id(id) {
  return new State(id);
}
function value(state) {
  return get_state(state.id);
}
function create(init4) {
  let id = create_id();
  set_state(id, init4);
  return new State(id);
}
function create_with_id(id, init4) {
  set_state(id, init4);
  return new State(id);
}
function update2(state, new$2) {
  return update_state(state.id, new$2);
}
function on_change(state, callback) {
  add_state_listener(state.id, callback);
  return state;
}

// build/dev/javascript/iui/motion_ffi.mjs
function add_mouse_up_listener(fn) {
  document.getElementById("_app_").addEventListener("mouseup", fn);
}

// build/dev/javascript/iui/libs/motion.mjs
var DragEvent = class extends CustomType {
  constructor(value2, source, preview, drop2, cancel, droppable) {
    super();
    this.value = value2;
    this.source = source;
    this.preview = preview;
    this.drop = drop2;
    this.cancel = cancel;
    this.droppable = droppable;
  }
};
var drag_event_id = "_DRAGGABLE_";
function ondrag(comp, preview, value2, on_drag, on_cancel, on_drop) {
  let drag_event = from_id(drag_event_id);
  let preview$1 = (() => {
    let _pipe2 = component(drag_event_id);
    let _pipe$1 = add_attribute2(
      _pipe2,
      style(
        toList([
          ["position", "absolute"],
          ["top", "var(--mouse-y)"],
          ["left", "var(--mouse-x)"],
          ["min-width", "20px"],
          ["min-height", "20px"]
        ])
      )
    );
    return set_children2(_pipe$1, toList([preview]));
  })();
  let _pipe = comp;
  return add_listener(
    _pipe,
    onmousedown(
      (_) => {
        let event = new DragEvent(
          value2,
          comp,
          preview$1,
          on_drop,
          on_cancel,
          false
        );
        update2(drag_event, new Some(event));
        add_to_viewport("#_drag_", element(preview$1));
        return on_drag(event);
      }
    )
  );
}
function cleanup() {
  let state = from_id(drag_event_id);
  return () => {
    update2(state, new None());
    return clear_viewport("#_drag_");
  };
}
function init2() {
  let drag_event = create_with_id(drag_event_id, new None());
  return add_mouse_up_listener(
    () => {
      let $ = value(drag_event);
      if ($ instanceof Some && !$[0].droppable) {
        let event = $[0];
        return event.cancel(event, cleanup());
      } else {
        return void 0;
      }
    }
  );
}
function ondrop(comp, on_drag, on_hover, on_drop) {
  let drag_event = from_id(drag_event_id);
  let _pipe = drag_event;
  on_change(
    _pipe,
    (event) => {
      if (event instanceof Some && !event[0].droppable) {
        let event$1 = event[0];
        return on_drag(event$1);
      } else {
        return void 0;
      }
    }
  );
  let _pipe$1 = comp;
  let _pipe$2 = add_listener(
    _pipe$1,
    onemouseover(
      (_) => {
        let $ = value(drag_event);
        if ($ instanceof Some && $[0] instanceof DragEvent) {
          let value2 = $[0].value;
          let source = $[0].source;
          let preview = $[0].preview;
          let cleanup$1 = $[0].drop;
          let cancel = $[0].cancel;
          let droppable = $[0].droppable;
          let event = new DragEvent(
            value2,
            source,
            preview,
            cleanup$1,
            cancel,
            droppable
          );
          return update2(
            drag_event,
            new Some(
              new DragEvent(
                value2,
                source,
                preview,
                cleanup$1,
                cancel,
                on_hover(event)
              )
            )
          );
        } else {
          return void 0;
        }
      }
    )
  );
  let _pipe$3 = add_listener(
    _pipe$2,
    onmouseout(
      (_) => {
        let $ = value(drag_event);
        if ($ instanceof Some) {
          let event = $[0];
          return update2(
            drag_event,
            new Some(
              new DragEvent(
                event.value,
                event.source,
                event.preview,
                event.drop,
                event.cancel,
                false
              )
            )
          );
        } else {
          return void 0;
        }
      }
    )
  );
  return add_listener(
    _pipe$3,
    onmouseup(
      (_) => {
        let $ = value(drag_event);
        if ($ instanceof Some && $[0].droppable) {
          let event = $[0];
          event.drop(event);
          return on_drop(event, cleanup());
        } else {
          return void 0;
        }
      }
    )
  );
}

// build/dev/javascript/iui/libs/framework.mjs
function init3() {
  init();
  return init2();
}

// build/dev/javascript/iui/libs/html.mjs
var div_tag = "div";
function div(attributes, children) {
  let _pipe = component(div_tag);
  let _pipe$1 = set_attributes2(_pipe, attributes);
  return ((c) => {
    let _pipe$2 = c;
    return set_children2(_pipe$2, children(c));
  })(_pipe$1);
}

// build/dev/javascript/iui/iui.mjs
function add_drag(comp, value2, parent) {
  let _pipe = comp;
  return ondrag(
    _pipe,
    (() => {
      let _pipe$1 = comp;
      return copy(_pipe$1);
    })(),
    value2,
    (e) => {
      let _pipe$1 = e.source;
      add_attribute2(_pipe$1, hidden());
      return void 0;
    },
    (e, cleanup2) => {
      let _pipe$1 = e.source;
      remove_attribute2(_pipe$1, hidden());
      return cleanup2();
    },
    (e) => {
      debug("REMOVING CHILD");
      return remove_child2(parent, e.source);
    }
  );
}
function add_drop(comp, parent) {
  let _pipe = comp;
  return ondrop(
    _pipe,
    (_) => {
      return void 0;
    },
    (_) => {
      return true;
    },
    (e, cleanup2) => {
      let new$2 = (() => {
        let _pipe$1 = div(
          toList([class$("p-5 bg-red-100")]),
          (div2) => {
            return toList([text(toList([class$("select-none")]), e.value)]);
          }
        );
        let _pipe$2 = add_drag(_pipe$1, e.value, parent);
        return add_drop(_pipe$2, parent);
      })();
      insert_child_at2(parent, new$2, 0);
      return cleanup2();
    }
  );
}
function panel1(state) {
  let letters = value(state);
  return hstack(
    new HCenter(),
    new EvenSpacing(),
    (hstack2) => {
      return map(
        letters,
        (letter) => {
          let comp = div(
            toList([class$("p-5 bg-blue-100")]),
            (div2) => {
              return toList([text(toList([class$("select-none")]), letter)]);
            }
          );
          let _pipe = comp;
          let _pipe$1 = add_drag(_pipe, letter, hstack2);
          return add_drop(_pipe$1, hstack2);
        }
      );
    }
  );
}
function panel2(state) {
  let letters = value(state);
  return hstack(
    new HCenter(),
    new EvenSpacing(),
    (hstack2) => {
      return map(
        letters,
        (letter) => {
          let _pipe = div(
            toList([class$("p-5 bg-green-100")]),
            (div2) => {
              return toList([text(toList([class$("select-none")]), letter)]);
            }
          );
          let _pipe$1 = add_drag(_pipe, letter, hstack2);
          return add_drop(_pipe$1, hstack2);
        }
      );
    }
  );
}
function main() {
  init3();
  let state1 = create(toList(["A", "B", "C"]));
  let state2 = create(toList(["D", "E"]));
  let component2 = vstack(
    new VCenter(),
    new EvenSpacing(),
    (vstack2) => {
      return toList([
        panel1(state1),
        panel2(state2),
        (() => {
          let _pipe = div(
            toList([class$("p-5 bg-blue-100")]),
            (div2) => {
              return toList([text(toList([class$("select-none")]), "Click")]);
            }
          );
          return add_listener(
            _pipe,
            onclick(
              (_) => {
                let $ = value(state1);
                if ($.atLeastLength(1) && $.head === "A") {
                  update2(state1, toList(["B"]));
                  let _pipe$1 = vstack2;
                  add_attribute2(
                    _pipe$1,
                    style(toList([["background-color", "red"]]))
                  );
                  return void 0;
                } else {
                  update2(state1, toList(["A", "B", "C"]));
                  let _pipe$1 = vstack2;
                  remove_attribute2(
                    _pipe$1,
                    style(toList([["background", ""]]))
                  );
                  return void 0;
                }
              }
            )
          );
        })()
      ]);
    }
  );
  return start(component2);
}

// build/.lustre/entry.mjs
main();
