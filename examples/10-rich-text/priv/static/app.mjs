var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../../node_modules/fast-diff/diff.js
var require_diff = __commonJS({
  "../../node_modules/fast-diff/diff.js"(exports2, module2) {
    var DIFF_DELETE = -1;
    var DIFF_INSERT = 1;
    var DIFF_EQUAL = 0;
    function diff_main(text1, text2, cursor_pos, cleanup2, _fix_unicode) {
      if (text1 === text2) {
        if (text1) {
          return [[DIFF_EQUAL, text1]];
        }
        return [];
      }
      if (cursor_pos != null) {
        var editdiff = find_cursor_edit_diff(text1, text2, cursor_pos);
        if (editdiff) {
          return editdiff;
        }
      }
      var commonlength = diff_commonPrefix(text1, text2);
      var commonprefix = text1.substring(0, commonlength);
      text1 = text1.substring(commonlength);
      text2 = text2.substring(commonlength);
      commonlength = diff_commonSuffix(text1, text2);
      var commonsuffix = text1.substring(text1.length - commonlength);
      text1 = text1.substring(0, text1.length - commonlength);
      text2 = text2.substring(0, text2.length - commonlength);
      var diffs = diff_compute_(text1, text2);
      if (commonprefix) {
        diffs.unshift([DIFF_EQUAL, commonprefix]);
      }
      if (commonsuffix) {
        diffs.push([DIFF_EQUAL, commonsuffix]);
      }
      diff_cleanupMerge(diffs, _fix_unicode);
      if (cleanup2) {
        diff_cleanupSemantic(diffs);
      }
      return diffs;
    }
    function diff_compute_(text1, text2) {
      var diffs;
      if (!text1) {
        return [[DIFF_INSERT, text2]];
      }
      if (!text2) {
        return [[DIFF_DELETE, text1]];
      }
      var longtext = text1.length > text2.length ? text1 : text2;
      var shorttext = text1.length > text2.length ? text2 : text1;
      var i = longtext.indexOf(shorttext);
      if (i !== -1) {
        diffs = [
          [DIFF_INSERT, longtext.substring(0, i)],
          [DIFF_EQUAL, shorttext],
          [DIFF_INSERT, longtext.substring(i + shorttext.length)]
        ];
        if (text1.length > text2.length) {
          diffs[0][0] = diffs[2][0] = DIFF_DELETE;
        }
        return diffs;
      }
      if (shorttext.length === 1) {
        return [
          [DIFF_DELETE, text1],
          [DIFF_INSERT, text2]
        ];
      }
      var hm = diff_halfMatch_(text1, text2);
      if (hm) {
        var text1_a = hm[0];
        var text1_b = hm[1];
        var text2_a = hm[2];
        var text2_b = hm[3];
        var mid_common = hm[4];
        var diffs_a = diff_main(text1_a, text2_a);
        var diffs_b = diff_main(text1_b, text2_b);
        return diffs_a.concat([[DIFF_EQUAL, mid_common]], diffs_b);
      }
      return diff_bisect_(text1, text2);
    }
    function diff_bisect_(text1, text2) {
      var text1_length = text1.length;
      var text2_length = text2.length;
      var max_d = Math.ceil((text1_length + text2_length) / 2);
      var v_offset = max_d;
      var v_length = 2 * max_d;
      var v1 = new Array(v_length);
      var v2 = new Array(v_length);
      for (var x = 0; x < v_length; x++) {
        v1[x] = -1;
        v2[x] = -1;
      }
      v1[v_offset + 1] = 0;
      v2[v_offset + 1] = 0;
      var delta = text1_length - text2_length;
      var front = delta % 2 !== 0;
      var k1start = 0;
      var k1end = 0;
      var k2start = 0;
      var k2end = 0;
      for (var d = 0; d < max_d; d++) {
        for (var k1 = -d + k1start; k1 <= d - k1end; k1 += 2) {
          var k1_offset = v_offset + k1;
          var x1;
          if (k1 === -d || k1 !== d && v1[k1_offset - 1] < v1[k1_offset + 1]) {
            x1 = v1[k1_offset + 1];
          } else {
            x1 = v1[k1_offset - 1] + 1;
          }
          var y1 = x1 - k1;
          while (x1 < text1_length && y1 < text2_length && text1.charAt(x1) === text2.charAt(y1)) {
            x1++;
            y1++;
          }
          v1[k1_offset] = x1;
          if (x1 > text1_length) {
            k1end += 2;
          } else if (y1 > text2_length) {
            k1start += 2;
          } else if (front) {
            var k2_offset = v_offset + delta - k1;
            if (k2_offset >= 0 && k2_offset < v_length && v2[k2_offset] !== -1) {
              var x2 = text1_length - v2[k2_offset];
              if (x1 >= x2) {
                return diff_bisectSplit_(text1, text2, x1, y1);
              }
            }
          }
        }
        for (var k2 = -d + k2start; k2 <= d - k2end; k2 += 2) {
          var k2_offset = v_offset + k2;
          var x2;
          if (k2 === -d || k2 !== d && v2[k2_offset - 1] < v2[k2_offset + 1]) {
            x2 = v2[k2_offset + 1];
          } else {
            x2 = v2[k2_offset - 1] + 1;
          }
          var y2 = x2 - k2;
          while (x2 < text1_length && y2 < text2_length && text1.charAt(text1_length - x2 - 1) === text2.charAt(text2_length - y2 - 1)) {
            x2++;
            y2++;
          }
          v2[k2_offset] = x2;
          if (x2 > text1_length) {
            k2end += 2;
          } else if (y2 > text2_length) {
            k2start += 2;
          } else if (!front) {
            var k1_offset = v_offset + delta - k2;
            if (k1_offset >= 0 && k1_offset < v_length && v1[k1_offset] !== -1) {
              var x1 = v1[k1_offset];
              var y1 = v_offset + x1 - k1_offset;
              x2 = text1_length - x2;
              if (x1 >= x2) {
                return diff_bisectSplit_(text1, text2, x1, y1);
              }
            }
          }
        }
      }
      return [
        [DIFF_DELETE, text1],
        [DIFF_INSERT, text2]
      ];
    }
    function diff_bisectSplit_(text1, text2, x, y) {
      var text1a = text1.substring(0, x);
      var text2a = text2.substring(0, y);
      var text1b = text1.substring(x);
      var text2b = text2.substring(y);
      var diffs = diff_main(text1a, text2a);
      var diffsb = diff_main(text1b, text2b);
      return diffs.concat(diffsb);
    }
    function diff_commonPrefix(text1, text2) {
      if (!text1 || !text2 || text1.charAt(0) !== text2.charAt(0)) {
        return 0;
      }
      var pointermin = 0;
      var pointermax = Math.min(text1.length, text2.length);
      var pointermid = pointermax;
      var pointerstart = 0;
      while (pointermin < pointermid) {
        if (text1.substring(pointerstart, pointermid) == text2.substring(pointerstart, pointermid)) {
          pointermin = pointermid;
          pointerstart = pointermin;
        } else {
          pointermax = pointermid;
        }
        pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
      }
      if (is_surrogate_pair_start(text1.charCodeAt(pointermid - 1))) {
        pointermid--;
      }
      return pointermid;
    }
    function diff_commonOverlap_(text1, text2) {
      var text1_length = text1.length;
      var text2_length = text2.length;
      if (text1_length == 0 || text2_length == 0) {
        return 0;
      }
      if (text1_length > text2_length) {
        text1 = text1.substring(text1_length - text2_length);
      } else if (text1_length < text2_length) {
        text2 = text2.substring(0, text1_length);
      }
      var text_length = Math.min(text1_length, text2_length);
      if (text1 == text2) {
        return text_length;
      }
      var best = 0;
      var length2 = 1;
      while (true) {
        var pattern = text1.substring(text_length - length2);
        var found = text2.indexOf(pattern);
        if (found == -1) {
          return best;
        }
        length2 += found;
        if (found == 0 || text1.substring(text_length - length2) == text2.substring(0, length2)) {
          best = length2;
          length2++;
        }
      }
    }
    function diff_commonSuffix(text1, text2) {
      if (!text1 || !text2 || text1.slice(-1) !== text2.slice(-1)) {
        return 0;
      }
      var pointermin = 0;
      var pointermax = Math.min(text1.length, text2.length);
      var pointermid = pointermax;
      var pointerend = 0;
      while (pointermin < pointermid) {
        if (text1.substring(text1.length - pointermid, text1.length - pointerend) == text2.substring(text2.length - pointermid, text2.length - pointerend)) {
          pointermin = pointermid;
          pointerend = pointermin;
        } else {
          pointermax = pointermid;
        }
        pointermid = Math.floor((pointermax - pointermin) / 2 + pointermin);
      }
      if (is_surrogate_pair_end(text1.charCodeAt(text1.length - pointermid))) {
        pointermid--;
      }
      return pointermid;
    }
    function diff_halfMatch_(text1, text2) {
      var longtext = text1.length > text2.length ? text1 : text2;
      var shorttext = text1.length > text2.length ? text2 : text1;
      if (longtext.length < 4 || shorttext.length * 2 < longtext.length) {
        return null;
      }
      function diff_halfMatchI_(longtext2, shorttext2, i) {
        var seed = longtext2.substring(i, i + Math.floor(longtext2.length / 4));
        var j = -1;
        var best_common = "";
        var best_longtext_a, best_longtext_b, best_shorttext_a, best_shorttext_b;
        while ((j = shorttext2.indexOf(seed, j + 1)) !== -1) {
          var prefixLength = diff_commonPrefix(
            longtext2.substring(i),
            shorttext2.substring(j)
          );
          var suffixLength = diff_commonSuffix(
            longtext2.substring(0, i),
            shorttext2.substring(0, j)
          );
          if (best_common.length < suffixLength + prefixLength) {
            best_common = shorttext2.substring(j - suffixLength, j) + shorttext2.substring(j, j + prefixLength);
            best_longtext_a = longtext2.substring(0, i - suffixLength);
            best_longtext_b = longtext2.substring(i + prefixLength);
            best_shorttext_a = shorttext2.substring(0, j - suffixLength);
            best_shorttext_b = shorttext2.substring(j + prefixLength);
          }
        }
        if (best_common.length * 2 >= longtext2.length) {
          return [
            best_longtext_a,
            best_longtext_b,
            best_shorttext_a,
            best_shorttext_b,
            best_common
          ];
        } else {
          return null;
        }
      }
      var hm1 = diff_halfMatchI_(
        longtext,
        shorttext,
        Math.ceil(longtext.length / 4)
      );
      var hm2 = diff_halfMatchI_(
        longtext,
        shorttext,
        Math.ceil(longtext.length / 2)
      );
      var hm;
      if (!hm1 && !hm2) {
        return null;
      } else if (!hm2) {
        hm = hm1;
      } else if (!hm1) {
        hm = hm2;
      } else {
        hm = hm1[4].length > hm2[4].length ? hm1 : hm2;
      }
      var text1_a, text1_b, text2_a, text2_b;
      if (text1.length > text2.length) {
        text1_a = hm[0];
        text1_b = hm[1];
        text2_a = hm[2];
        text2_b = hm[3];
      } else {
        text2_a = hm[0];
        text2_b = hm[1];
        text1_a = hm[2];
        text1_b = hm[3];
      }
      var mid_common = hm[4];
      return [text1_a, text1_b, text2_a, text2_b, mid_common];
    }
    function diff_cleanupSemantic(diffs) {
      var changes = false;
      var equalities = [];
      var equalitiesLength = 0;
      var lastequality = null;
      var pointer = 0;
      var length_insertions1 = 0;
      var length_deletions1 = 0;
      var length_insertions2 = 0;
      var length_deletions2 = 0;
      while (pointer < diffs.length) {
        if (diffs[pointer][0] == DIFF_EQUAL) {
          equalities[equalitiesLength++] = pointer;
          length_insertions1 = length_insertions2;
          length_deletions1 = length_deletions2;
          length_insertions2 = 0;
          length_deletions2 = 0;
          lastequality = diffs[pointer][1];
        } else {
          if (diffs[pointer][0] == DIFF_INSERT) {
            length_insertions2 += diffs[pointer][1].length;
          } else {
            length_deletions2 += diffs[pointer][1].length;
          }
          if (lastequality && lastequality.length <= Math.max(length_insertions1, length_deletions1) && lastequality.length <= Math.max(length_insertions2, length_deletions2)) {
            diffs.splice(equalities[equalitiesLength - 1], 0, [
              DIFF_DELETE,
              lastequality
            ]);
            diffs[equalities[equalitiesLength - 1] + 1][0] = DIFF_INSERT;
            equalitiesLength--;
            equalitiesLength--;
            pointer = equalitiesLength > 0 ? equalities[equalitiesLength - 1] : -1;
            length_insertions1 = 0;
            length_deletions1 = 0;
            length_insertions2 = 0;
            length_deletions2 = 0;
            lastequality = null;
            changes = true;
          }
        }
        pointer++;
      }
      if (changes) {
        diff_cleanupMerge(diffs);
      }
      diff_cleanupSemanticLossless(diffs);
      pointer = 1;
      while (pointer < diffs.length) {
        if (diffs[pointer - 1][0] == DIFF_DELETE && diffs[pointer][0] == DIFF_INSERT) {
          var deletion = diffs[pointer - 1][1];
          var insertion = diffs[pointer][1];
          var overlap_length1 = diff_commonOverlap_(deletion, insertion);
          var overlap_length2 = diff_commonOverlap_(insertion, deletion);
          if (overlap_length1 >= overlap_length2) {
            if (overlap_length1 >= deletion.length / 2 || overlap_length1 >= insertion.length / 2) {
              diffs.splice(pointer, 0, [
                DIFF_EQUAL,
                insertion.substring(0, overlap_length1)
              ]);
              diffs[pointer - 1][1] = deletion.substring(
                0,
                deletion.length - overlap_length1
              );
              diffs[pointer + 1][1] = insertion.substring(overlap_length1);
              pointer++;
            }
          } else {
            if (overlap_length2 >= deletion.length / 2 || overlap_length2 >= insertion.length / 2) {
              diffs.splice(pointer, 0, [
                DIFF_EQUAL,
                deletion.substring(0, overlap_length2)
              ]);
              diffs[pointer - 1][0] = DIFF_INSERT;
              diffs[pointer - 1][1] = insertion.substring(
                0,
                insertion.length - overlap_length2
              );
              diffs[pointer + 1][0] = DIFF_DELETE;
              diffs[pointer + 1][1] = deletion.substring(overlap_length2);
              pointer++;
            }
          }
          pointer++;
        }
        pointer++;
      }
    }
    var nonAlphaNumericRegex_ = /[^a-zA-Z0-9]/;
    var whitespaceRegex_ = /\s/;
    var linebreakRegex_ = /[\r\n]/;
    var blanklineEndRegex_ = /\n\r?\n$/;
    var blanklineStartRegex_ = /^\r?\n\r?\n/;
    function diff_cleanupSemanticLossless(diffs) {
      function diff_cleanupSemanticScore_(one, two) {
        if (!one || !two) {
          return 6;
        }
        var char1 = one.charAt(one.length - 1);
        var char2 = two.charAt(0);
        var nonAlphaNumeric1 = char1.match(nonAlphaNumericRegex_);
        var nonAlphaNumeric2 = char2.match(nonAlphaNumericRegex_);
        var whitespace1 = nonAlphaNumeric1 && char1.match(whitespaceRegex_);
        var whitespace2 = nonAlphaNumeric2 && char2.match(whitespaceRegex_);
        var lineBreak1 = whitespace1 && char1.match(linebreakRegex_);
        var lineBreak2 = whitespace2 && char2.match(linebreakRegex_);
        var blankLine1 = lineBreak1 && one.match(blanklineEndRegex_);
        var blankLine2 = lineBreak2 && two.match(blanklineStartRegex_);
        if (blankLine1 || blankLine2) {
          return 5;
        } else if (lineBreak1 || lineBreak2) {
          return 4;
        } else if (nonAlphaNumeric1 && !whitespace1 && whitespace2) {
          return 3;
        } else if (whitespace1 || whitespace2) {
          return 2;
        } else if (nonAlphaNumeric1 || nonAlphaNumeric2) {
          return 1;
        }
        return 0;
      }
      var pointer = 1;
      while (pointer < diffs.length - 1) {
        if (diffs[pointer - 1][0] == DIFF_EQUAL && diffs[pointer + 1][0] == DIFF_EQUAL) {
          var equality1 = diffs[pointer - 1][1];
          var edit = diffs[pointer][1];
          var equality2 = diffs[pointer + 1][1];
          var commonOffset = diff_commonSuffix(equality1, edit);
          if (commonOffset) {
            var commonString = edit.substring(edit.length - commonOffset);
            equality1 = equality1.substring(0, equality1.length - commonOffset);
            edit = commonString + edit.substring(0, edit.length - commonOffset);
            equality2 = commonString + equality2;
          }
          var bestEquality1 = equality1;
          var bestEdit = edit;
          var bestEquality2 = equality2;
          var bestScore = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
          while (edit.charAt(0) === equality2.charAt(0)) {
            equality1 += edit.charAt(0);
            edit = edit.substring(1) + equality2.charAt(0);
            equality2 = equality2.substring(1);
            var score = diff_cleanupSemanticScore_(equality1, edit) + diff_cleanupSemanticScore_(edit, equality2);
            if (score >= bestScore) {
              bestScore = score;
              bestEquality1 = equality1;
              bestEdit = edit;
              bestEquality2 = equality2;
            }
          }
          if (diffs[pointer - 1][1] != bestEquality1) {
            if (bestEquality1) {
              diffs[pointer - 1][1] = bestEquality1;
            } else {
              diffs.splice(pointer - 1, 1);
              pointer--;
            }
            diffs[pointer][1] = bestEdit;
            if (bestEquality2) {
              diffs[pointer + 1][1] = bestEquality2;
            } else {
              diffs.splice(pointer + 1, 1);
              pointer--;
            }
          }
        }
        pointer++;
      }
    }
    function diff_cleanupMerge(diffs, fix_unicode) {
      diffs.push([DIFF_EQUAL, ""]);
      var pointer = 0;
      var count_delete = 0;
      var count_insert = 0;
      var text_delete = "";
      var text_insert = "";
      var commonlength;
      while (pointer < diffs.length) {
        if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
          diffs.splice(pointer, 1);
          continue;
        }
        switch (diffs[pointer][0]) {
          case DIFF_INSERT:
            count_insert++;
            text_insert += diffs[pointer][1];
            pointer++;
            break;
          case DIFF_DELETE:
            count_delete++;
            text_delete += diffs[pointer][1];
            pointer++;
            break;
          case DIFF_EQUAL:
            var previous_equality = pointer - count_insert - count_delete - 1;
            if (fix_unicode) {
              if (previous_equality >= 0 && ends_with_pair_start(diffs[previous_equality][1])) {
                var stray = diffs[previous_equality][1].slice(-1);
                diffs[previous_equality][1] = diffs[previous_equality][1].slice(
                  0,
                  -1
                );
                text_delete = stray + text_delete;
                text_insert = stray + text_insert;
                if (!diffs[previous_equality][1]) {
                  diffs.splice(previous_equality, 1);
                  pointer--;
                  var k = previous_equality - 1;
                  if (diffs[k] && diffs[k][0] === DIFF_INSERT) {
                    count_insert++;
                    text_insert = diffs[k][1] + text_insert;
                    k--;
                  }
                  if (diffs[k] && diffs[k][0] === DIFF_DELETE) {
                    count_delete++;
                    text_delete = diffs[k][1] + text_delete;
                    k--;
                  }
                  previous_equality = k;
                }
              }
              if (starts_with_pair_end(diffs[pointer][1])) {
                var stray = diffs[pointer][1].charAt(0);
                diffs[pointer][1] = diffs[pointer][1].slice(1);
                text_delete += stray;
                text_insert += stray;
              }
            }
            if (pointer < diffs.length - 1 && !diffs[pointer][1]) {
              diffs.splice(pointer, 1);
              break;
            }
            if (text_delete.length > 0 || text_insert.length > 0) {
              if (text_delete.length > 0 && text_insert.length > 0) {
                commonlength = diff_commonPrefix(text_insert, text_delete);
                if (commonlength !== 0) {
                  if (previous_equality >= 0) {
                    diffs[previous_equality][1] += text_insert.substring(
                      0,
                      commonlength
                    );
                  } else {
                    diffs.splice(0, 0, [
                      DIFF_EQUAL,
                      text_insert.substring(0, commonlength)
                    ]);
                    pointer++;
                  }
                  text_insert = text_insert.substring(commonlength);
                  text_delete = text_delete.substring(commonlength);
                }
                commonlength = diff_commonSuffix(text_insert, text_delete);
                if (commonlength !== 0) {
                  diffs[pointer][1] = text_insert.substring(text_insert.length - commonlength) + diffs[pointer][1];
                  text_insert = text_insert.substring(
                    0,
                    text_insert.length - commonlength
                  );
                  text_delete = text_delete.substring(
                    0,
                    text_delete.length - commonlength
                  );
                }
              }
              var n = count_insert + count_delete;
              if (text_delete.length === 0 && text_insert.length === 0) {
                diffs.splice(pointer - n, n);
                pointer = pointer - n;
              } else if (text_delete.length === 0) {
                diffs.splice(pointer - n, n, [DIFF_INSERT, text_insert]);
                pointer = pointer - n + 1;
              } else if (text_insert.length === 0) {
                diffs.splice(pointer - n, n, [DIFF_DELETE, text_delete]);
                pointer = pointer - n + 1;
              } else {
                diffs.splice(
                  pointer - n,
                  n,
                  [DIFF_DELETE, text_delete],
                  [DIFF_INSERT, text_insert]
                );
                pointer = pointer - n + 2;
              }
            }
            if (pointer !== 0 && diffs[pointer - 1][0] === DIFF_EQUAL) {
              diffs[pointer - 1][1] += diffs[pointer][1];
              diffs.splice(pointer, 1);
            } else {
              pointer++;
            }
            count_insert = 0;
            count_delete = 0;
            text_delete = "";
            text_insert = "";
            break;
        }
      }
      if (diffs[diffs.length - 1][1] === "") {
        diffs.pop();
      }
      var changes = false;
      pointer = 1;
      while (pointer < diffs.length - 1) {
        if (diffs[pointer - 1][0] === DIFF_EQUAL && diffs[pointer + 1][0] === DIFF_EQUAL) {
          if (diffs[pointer][1].substring(
            diffs[pointer][1].length - diffs[pointer - 1][1].length
          ) === diffs[pointer - 1][1]) {
            diffs[pointer][1] = diffs[pointer - 1][1] + diffs[pointer][1].substring(
              0,
              diffs[pointer][1].length - diffs[pointer - 1][1].length
            );
            diffs[pointer + 1][1] = diffs[pointer - 1][1] + diffs[pointer + 1][1];
            diffs.splice(pointer - 1, 1);
            changes = true;
          } else if (diffs[pointer][1].substring(0, diffs[pointer + 1][1].length) == diffs[pointer + 1][1]) {
            diffs[pointer - 1][1] += diffs[pointer + 1][1];
            diffs[pointer][1] = diffs[pointer][1].substring(diffs[pointer + 1][1].length) + diffs[pointer + 1][1];
            diffs.splice(pointer + 1, 1);
            changes = true;
          }
        }
        pointer++;
      }
      if (changes) {
        diff_cleanupMerge(diffs, fix_unicode);
      }
    }
    function is_surrogate_pair_start(charCode) {
      return charCode >= 55296 && charCode <= 56319;
    }
    function is_surrogate_pair_end(charCode) {
      return charCode >= 56320 && charCode <= 57343;
    }
    function starts_with_pair_end(str) {
      return is_surrogate_pair_end(str.charCodeAt(0));
    }
    function ends_with_pair_start(str) {
      return is_surrogate_pair_start(str.charCodeAt(str.length - 1));
    }
    function remove_empty_tuples(tuples) {
      var ret = [];
      for (var i = 0; i < tuples.length; i++) {
        if (tuples[i][1].length > 0) {
          ret.push(tuples[i]);
        }
      }
      return ret;
    }
    function make_edit_splice(before, oldMiddle, newMiddle, after) {
      if (ends_with_pair_start(before) || starts_with_pair_end(after)) {
        return null;
      }
      return remove_empty_tuples([
        [DIFF_EQUAL, before],
        [DIFF_DELETE, oldMiddle],
        [DIFF_INSERT, newMiddle],
        [DIFF_EQUAL, after]
      ]);
    }
    function find_cursor_edit_diff(oldText, newText, cursor_pos) {
      var oldRange = typeof cursor_pos === "number" ? { index: cursor_pos, length: 0 } : cursor_pos.oldRange;
      var newRange = typeof cursor_pos === "number" ? null : cursor_pos.newRange;
      var oldLength = oldText.length;
      var newLength = newText.length;
      if (oldRange.length === 0 && (newRange === null || newRange.length === 0)) {
        var oldCursor = oldRange.index;
        var oldBefore = oldText.slice(0, oldCursor);
        var oldAfter = oldText.slice(oldCursor);
        var maybeNewCursor = newRange ? newRange.index : null;
        editBefore: {
          var newCursor = oldCursor + newLength - oldLength;
          if (maybeNewCursor !== null && maybeNewCursor !== newCursor) {
            break editBefore;
          }
          if (newCursor < 0 || newCursor > newLength) {
            break editBefore;
          }
          var newBefore = newText.slice(0, newCursor);
          var newAfter = newText.slice(newCursor);
          if (newAfter !== oldAfter) {
            break editBefore;
          }
          var prefixLength = Math.min(oldCursor, newCursor);
          var oldPrefix = oldBefore.slice(0, prefixLength);
          var newPrefix = newBefore.slice(0, prefixLength);
          if (oldPrefix !== newPrefix) {
            break editBefore;
          }
          var oldMiddle = oldBefore.slice(prefixLength);
          var newMiddle = newBefore.slice(prefixLength);
          return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldAfter);
        }
        editAfter: {
          if (maybeNewCursor !== null && maybeNewCursor !== oldCursor) {
            break editAfter;
          }
          var cursor = oldCursor;
          var newBefore = newText.slice(0, cursor);
          var newAfter = newText.slice(cursor);
          if (newBefore !== oldBefore) {
            break editAfter;
          }
          var suffixLength = Math.min(oldLength - cursor, newLength - cursor);
          var oldSuffix = oldAfter.slice(oldAfter.length - suffixLength);
          var newSuffix = newAfter.slice(newAfter.length - suffixLength);
          if (oldSuffix !== newSuffix) {
            break editAfter;
          }
          var oldMiddle = oldAfter.slice(0, oldAfter.length - suffixLength);
          var newMiddle = newAfter.slice(0, newAfter.length - suffixLength);
          return make_edit_splice(oldBefore, oldMiddle, newMiddle, oldSuffix);
        }
      }
      if (oldRange.length > 0 && newRange && newRange.length === 0) {
        replaceRange: {
          var oldPrefix = oldText.slice(0, oldRange.index);
          var oldSuffix = oldText.slice(oldRange.index + oldRange.length);
          var prefixLength = oldPrefix.length;
          var suffixLength = oldSuffix.length;
          if (newLength < prefixLength + suffixLength) {
            break replaceRange;
          }
          var newPrefix = newText.slice(0, prefixLength);
          var newSuffix = newText.slice(newLength - suffixLength);
          if (oldPrefix !== newPrefix || oldSuffix !== newSuffix) {
            break replaceRange;
          }
          var oldMiddle = oldText.slice(prefixLength, oldLength - suffixLength);
          var newMiddle = newText.slice(prefixLength, newLength - suffixLength);
          return make_edit_splice(oldPrefix, oldMiddle, newMiddle, oldSuffix);
        }
      }
      return null;
    }
    function diff(text1, text2, cursor_pos, cleanup2) {
      return diff_main(text1, text2, cursor_pos, cleanup2, true);
    }
    diff.INSERT = DIFF_INSERT;
    diff.DELETE = DIFF_DELETE;
    diff.EQUAL = DIFF_EQUAL;
    module2.exports = diff;
  }
});

// ../../node_modules/lodash.clonedeep/index.js
var require_lodash = __commonJS({
  "../../node_modules/lodash.clonedeep/index.js"(exports2, module2) {
    var LARGE_ARRAY_SIZE2 = 200;
    var HASH_UNDEFINED4 = "__lodash_hash_undefined__";
    var MAX_SAFE_INTEGER3 = 9007199254740991;
    var argsTag5 = "[object Arguments]";
    var arrayTag4 = "[object Array]";
    var boolTag5 = "[object Boolean]";
    var dateTag5 = "[object Date]";
    var errorTag4 = "[object Error]";
    var funcTag4 = "[object Function]";
    var genTag3 = "[object GeneratorFunction]";
    var mapTag7 = "[object Map]";
    var numberTag5 = "[object Number]";
    var objectTag6 = "[object Object]";
    var promiseTag2 = "[object Promise]";
    var regexpTag5 = "[object RegExp]";
    var setTag7 = "[object Set]";
    var stringTag5 = "[object String]";
    var symbolTag4 = "[object Symbol]";
    var weakMapTag4 = "[object WeakMap]";
    var arrayBufferTag5 = "[object ArrayBuffer]";
    var dataViewTag6 = "[object DataView]";
    var float32Tag4 = "[object Float32Array]";
    var float64Tag4 = "[object Float64Array]";
    var int8Tag4 = "[object Int8Array]";
    var int16Tag4 = "[object Int16Array]";
    var int32Tag4 = "[object Int32Array]";
    var uint8Tag4 = "[object Uint8Array]";
    var uint8ClampedTag4 = "[object Uint8ClampedArray]";
    var uint16Tag4 = "[object Uint16Array]";
    var uint32Tag4 = "[object Uint32Array]";
    var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
    var reFlags2 = /\w*$/;
    var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
    var reIsUint2 = /^(?:0|[1-9]\d*)$/;
    var cloneableTags2 = {};
    cloneableTags2[argsTag5] = cloneableTags2[arrayTag4] = cloneableTags2[arrayBufferTag5] = cloneableTags2[dataViewTag6] = cloneableTags2[boolTag5] = cloneableTags2[dateTag5] = cloneableTags2[float32Tag4] = cloneableTags2[float64Tag4] = cloneableTags2[int8Tag4] = cloneableTags2[int16Tag4] = cloneableTags2[int32Tag4] = cloneableTags2[mapTag7] = cloneableTags2[numberTag5] = cloneableTags2[objectTag6] = cloneableTags2[regexpTag5] = cloneableTags2[setTag7] = cloneableTags2[stringTag5] = cloneableTags2[symbolTag4] = cloneableTags2[uint8Tag4] = cloneableTags2[uint8ClampedTag4] = cloneableTags2[uint16Tag4] = cloneableTags2[uint32Tag4] = true;
    cloneableTags2[errorTag4] = cloneableTags2[funcTag4] = cloneableTags2[weakMapTag4] = false;
    var freeGlobal2 = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
    var freeExports4 = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule4 = freeExports4 && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports4 = freeModule4 && freeModule4.exports === freeExports4;
    function addMapEntry(map3, pair) {
      map3.set(pair[0], pair[1]);
      return map3;
    }
    function addSetEntry(set, value2) {
      set.add(value2);
      return set;
    }
    function arrayEach2(array, iteratee) {
      var index = -1, length2 = array ? array.length : 0;
      while (++index < length2) {
        if (iteratee(array[index], index, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayPush2(array, values) {
      var index = -1, length2 = values.length, offset = array.length;
      while (++index < length2) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length2 = array ? array.length : 0;
      if (initAccum && length2) {
        accumulator = array[++index];
      }
      while (++index < length2) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    function baseTimes2(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function getValue2(object, key) {
      return object == null ? void 0 : object[key];
    }
    function isHostObject(value2) {
      var result = false;
      if (value2 != null && typeof value2.toString != "function") {
        try {
          result = !!(value2 + "");
        } catch (e) {
        }
      }
      return result;
    }
    function mapToArray2(map3) {
      var index = -1, result = Array(map3.size);
      map3.forEach(function(value2, key) {
        result[++index] = [key, value2];
      });
      return result;
    }
    function overArg2(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray2(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value2) {
        result[++index] = value2;
      });
      return result;
    }
    var arrayProto2 = Array.prototype;
    var funcProto4 = Function.prototype;
    var objectProto17 = Object.prototype;
    var coreJsData2 = root2["__core-js_shared__"];
    var maskSrcKey2 = function() {
      var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var funcToString4 = funcProto4.toString;
    var hasOwnProperty14 = objectProto17.hasOwnProperty;
    var objectToString2 = objectProto17.toString;
    var reIsNative2 = RegExp(
      "^" + funcToString4.call(hasOwnProperty14).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer4 = moduleExports4 ? root2.Buffer : void 0;
    var Symbol3 = root2.Symbol;
    var Uint8Array3 = root2.Uint8Array;
    var getPrototype2 = overArg2(Object.getPrototypeOf, Object);
    var objectCreate2 = Object.create;
    var propertyIsEnumerable3 = objectProto17.propertyIsEnumerable;
    var splice2 = arrayProto2.splice;
    var nativeGetSymbols3 = Object.getOwnPropertySymbols;
    var nativeIsBuffer2 = Buffer4 ? Buffer4.isBuffer : void 0;
    var nativeKeys2 = overArg2(Object.keys, Object);
    var DataView3 = getNative2(root2, "DataView");
    var Map3 = getNative2(root2, "Map");
    var Promise3 = getNative2(root2, "Promise");
    var Set3 = getNative2(root2, "Set");
    var WeakMap3 = getNative2(root2, "WeakMap");
    var nativeCreate2 = getNative2(Object, "create");
    var dataViewCtorString2 = toSource2(DataView3);
    var mapCtorString2 = toSource2(Map3);
    var promiseCtorString2 = toSource2(Promise3);
    var setCtorString2 = toSource2(Set3);
    var weakMapCtorString2 = toSource2(WeakMap3);
    var symbolProto3 = Symbol3 ? Symbol3.prototype : void 0;
    var symbolValueOf3 = symbolProto3 ? symbolProto3.valueOf : void 0;
    function Hash2(entries) {
      var index = -1, length2 = entries ? entries.length : 0;
      this.clear();
      while (++index < length2) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear2() {
      this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
    }
    function hashDelete2(key) {
      return this.has(key) && delete this.__data__[key];
    }
    function hashGet2(key) {
      var data = this.__data__;
      if (nativeCreate2) {
        var result = data[key];
        return result === HASH_UNDEFINED4 ? void 0 : result;
      }
      return hasOwnProperty14.call(data, key) ? data[key] : void 0;
    }
    function hashHas2(key) {
      var data = this.__data__;
      return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty14.call(data, key);
    }
    function hashSet2(key, value2) {
      var data = this.__data__;
      data[key] = nativeCreate2 && value2 === void 0 ? HASH_UNDEFINED4 : value2;
      return this;
    }
    Hash2.prototype.clear = hashClear2;
    Hash2.prototype["delete"] = hashDelete2;
    Hash2.prototype.get = hashGet2;
    Hash2.prototype.has = hashHas2;
    Hash2.prototype.set = hashSet2;
    function ListCache2(entries) {
      var index = -1, length2 = entries ? entries.length : 0;
      this.clear();
      while (++index < length2) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear2() {
      this.__data__ = [];
    }
    function listCacheDelete2(key) {
      var data = this.__data__, index = assocIndexOf2(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice2.call(data, index, 1);
      }
      return true;
    }
    function listCacheGet2(key) {
      var data = this.__data__, index = assocIndexOf2(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas2(key) {
      return assocIndexOf2(this.__data__, key) > -1;
    }
    function listCacheSet2(key, value2) {
      var data = this.__data__, index = assocIndexOf2(data, key);
      if (index < 0) {
        data.push([key, value2]);
      } else {
        data[index][1] = value2;
      }
      return this;
    }
    ListCache2.prototype.clear = listCacheClear2;
    ListCache2.prototype["delete"] = listCacheDelete2;
    ListCache2.prototype.get = listCacheGet2;
    ListCache2.prototype.has = listCacheHas2;
    ListCache2.prototype.set = listCacheSet2;
    function MapCache2(entries) {
      var index = -1, length2 = entries ? entries.length : 0;
      this.clear();
      while (++index < length2) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear2() {
      this.__data__ = {
        "hash": new Hash2(),
        "map": new (Map3 || ListCache2)(),
        "string": new Hash2()
      };
    }
    function mapCacheDelete2(key) {
      return getMapData2(this, key)["delete"](key);
    }
    function mapCacheGet2(key) {
      return getMapData2(this, key).get(key);
    }
    function mapCacheHas2(key) {
      return getMapData2(this, key).has(key);
    }
    function mapCacheSet2(key, value2) {
      getMapData2(this, key).set(key, value2);
      return this;
    }
    MapCache2.prototype.clear = mapCacheClear2;
    MapCache2.prototype["delete"] = mapCacheDelete2;
    MapCache2.prototype.get = mapCacheGet2;
    MapCache2.prototype.has = mapCacheHas2;
    MapCache2.prototype.set = mapCacheSet2;
    function Stack2(entries) {
      this.__data__ = new ListCache2(entries);
    }
    function stackClear2() {
      this.__data__ = new ListCache2();
    }
    function stackDelete2(key) {
      return this.__data__["delete"](key);
    }
    function stackGet2(key) {
      return this.__data__.get(key);
    }
    function stackHas2(key) {
      return this.__data__.has(key);
    }
    function stackSet2(key, value2) {
      var cache = this.__data__;
      if (cache instanceof ListCache2) {
        var pairs = cache.__data__;
        if (!Map3 || pairs.length < LARGE_ARRAY_SIZE2 - 1) {
          pairs.push([key, value2]);
          return this;
        }
        cache = this.__data__ = new MapCache2(pairs);
      }
      cache.set(key, value2);
      return this;
    }
    Stack2.prototype.clear = stackClear2;
    Stack2.prototype["delete"] = stackDelete2;
    Stack2.prototype.get = stackGet2;
    Stack2.prototype.has = stackHas2;
    Stack2.prototype.set = stackSet2;
    function arrayLikeKeys2(value2, inherited) {
      var result = isArray2(value2) || isArguments2(value2) ? baseTimes2(value2.length, String) : [];
      var length2 = result.length, skipIndexes = !!length2;
      for (var key in value2) {
        if ((inherited || hasOwnProperty14.call(value2, key)) && !(skipIndexes && (key == "length" || isIndex2(key, length2)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignValue2(object, key, value2) {
      var objValue = object[key];
      if (!(hasOwnProperty14.call(object, key) && eq2(objValue, value2)) || value2 === void 0 && !(key in object)) {
        object[key] = value2;
      }
    }
    function assocIndexOf2(array, key) {
      var length2 = array.length;
      while (length2--) {
        if (eq2(array[length2][0], key)) {
          return length2;
        }
      }
      return -1;
    }
    function baseAssign2(object, source) {
      return object && copyObject2(source, keys2(source), object);
    }
    function baseClone2(value2, isDeep, isFull, customizer, key, object, stack) {
      var result;
      if (customizer) {
        result = object ? customizer(value2, key, object, stack) : customizer(value2);
      }
      if (result !== void 0) {
        return result;
      }
      if (!isObject2(value2)) {
        return value2;
      }
      var isArr = isArray2(value2);
      if (isArr) {
        result = initCloneArray2(value2);
        if (!isDeep) {
          return copyArray2(value2, result);
        }
      } else {
        var tag = getTag2(value2), isFunc = tag == funcTag4 || tag == genTag3;
        if (isBuffer2(value2)) {
          return cloneBuffer2(value2, isDeep);
        }
        if (tag == objectTag6 || tag == argsTag5 || isFunc && !object) {
          if (isHostObject(value2)) {
            return object ? value2 : {};
          }
          result = initCloneObject2(isFunc ? {} : value2);
          if (!isDeep) {
            return copySymbols2(value2, baseAssign2(result, value2));
          }
        } else {
          if (!cloneableTags2[tag]) {
            return object ? value2 : {};
          }
          result = initCloneByTag2(value2, tag, baseClone2, isDeep);
        }
      }
      stack || (stack = new Stack2());
      var stacked = stack.get(value2);
      if (stacked) {
        return stacked;
      }
      stack.set(value2, result);
      if (!isArr) {
        var props = isFull ? getAllKeys2(value2) : keys2(value2);
      }
      arrayEach2(props || value2, function(subValue, key2) {
        if (props) {
          key2 = subValue;
          subValue = value2[key2];
        }
        assignValue2(result, key2, baseClone2(subValue, isDeep, isFull, customizer, key2, value2, stack));
      });
      return result;
    }
    function baseCreate2(proto) {
      return isObject2(proto) ? objectCreate2(proto) : {};
    }
    function baseGetAllKeys2(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray2(object) ? result : arrayPush2(result, symbolsFunc(object));
    }
    function baseGetTag2(value2) {
      return objectToString2.call(value2);
    }
    function baseIsNative2(value2) {
      if (!isObject2(value2) || isMasked2(value2)) {
        return false;
      }
      var pattern = isFunction2(value2) || isHostObject(value2) ? reIsNative2 : reIsHostCtor2;
      return pattern.test(toSource2(value2));
    }
    function baseKeys2(object) {
      if (!isPrototype2(object)) {
        return nativeKeys2(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty14.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function cloneBuffer2(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var result = new buffer.constructor(buffer.length);
      buffer.copy(result);
      return result;
    }
    function cloneArrayBuffer2(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array3(result).set(new Uint8Array3(arrayBuffer));
      return result;
    }
    function cloneDataView2(dataView, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer2(dataView.buffer) : dataView.buffer;
      return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
    }
    function cloneMap(map3, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(mapToArray2(map3), true) : mapToArray2(map3);
      return arrayReduce(array, addMapEntry, new map3.constructor());
    }
    function cloneRegExp2(regexp) {
      var result = new regexp.constructor(regexp.source, reFlags2.exec(regexp));
      result.lastIndex = regexp.lastIndex;
      return result;
    }
    function cloneSet(set, isDeep, cloneFunc) {
      var array = isDeep ? cloneFunc(setToArray2(set), true) : setToArray2(set);
      return arrayReduce(array, addSetEntry, new set.constructor());
    }
    function cloneSymbol2(symbol) {
      return symbolValueOf3 ? Object(symbolValueOf3.call(symbol)) : {};
    }
    function cloneTypedArray2(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer2(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    function copyArray2(source, array) {
      var index = -1, length2 = source.length;
      array || (array = Array(length2));
      while (++index < length2) {
        array[index] = source[index];
      }
      return array;
    }
    function copyObject2(source, props, object, customizer) {
      object || (object = {});
      var index = -1, length2 = props.length;
      while (++index < length2) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        assignValue2(object, key, newValue === void 0 ? source[key] : newValue);
      }
      return object;
    }
    function copySymbols2(source, object) {
      return copyObject2(source, getSymbols2(source), object);
    }
    function getAllKeys2(object) {
      return baseGetAllKeys2(object, keys2, getSymbols2);
    }
    function getMapData2(map3, key) {
      var data = map3.__data__;
      return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative2(object, key) {
      var value2 = getValue2(object, key);
      return baseIsNative2(value2) ? value2 : void 0;
    }
    var getSymbols2 = nativeGetSymbols3 ? overArg2(nativeGetSymbols3, Object) : stubArray2;
    var getTag2 = baseGetTag2;
    if (DataView3 && getTag2(new DataView3(new ArrayBuffer(1))) != dataViewTag6 || Map3 && getTag2(new Map3()) != mapTag7 || Promise3 && getTag2(Promise3.resolve()) != promiseTag2 || Set3 && getTag2(new Set3()) != setTag7 || WeakMap3 && getTag2(new WeakMap3()) != weakMapTag4) {
      getTag2 = function(value2) {
        var result = objectToString2.call(value2), Ctor = result == objectTag6 ? value2.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : void 0;
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString2:
              return dataViewTag6;
            case mapCtorString2:
              return mapTag7;
            case promiseCtorString2:
              return promiseTag2;
            case setCtorString2:
              return setTag7;
            case weakMapCtorString2:
              return weakMapTag4;
          }
        }
        return result;
      };
    }
    function initCloneArray2(array) {
      var length2 = array.length, result = array.constructor(length2);
      if (length2 && typeof array[0] == "string" && hasOwnProperty14.call(array, "index")) {
        result.index = array.index;
        result.input = array.input;
      }
      return result;
    }
    function initCloneObject2(object) {
      return typeof object.constructor == "function" && !isPrototype2(object) ? baseCreate2(getPrototype2(object)) : {};
    }
    function initCloneByTag2(object, tag, cloneFunc, isDeep) {
      var Ctor = object.constructor;
      switch (tag) {
        case arrayBufferTag5:
          return cloneArrayBuffer2(object);
        case boolTag5:
        case dateTag5:
          return new Ctor(+object);
        case dataViewTag6:
          return cloneDataView2(object, isDeep);
        case float32Tag4:
        case float64Tag4:
        case int8Tag4:
        case int16Tag4:
        case int32Tag4:
        case uint8Tag4:
        case uint8ClampedTag4:
        case uint16Tag4:
        case uint32Tag4:
          return cloneTypedArray2(object, isDeep);
        case mapTag7:
          return cloneMap(object, isDeep, cloneFunc);
        case numberTag5:
        case stringTag5:
          return new Ctor(object);
        case regexpTag5:
          return cloneRegExp2(object);
        case setTag7:
          return cloneSet(object, isDeep, cloneFunc);
        case symbolTag4:
          return cloneSymbol2(object);
      }
    }
    function isIndex2(value2, length2) {
      length2 = length2 == null ? MAX_SAFE_INTEGER3 : length2;
      return !!length2 && (typeof value2 == "number" || reIsUint2.test(value2)) && (value2 > -1 && value2 % 1 == 0 && value2 < length2);
    }
    function isKeyable2(value2) {
      var type = typeof value2;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value2 !== "__proto__" : value2 === null;
    }
    function isMasked2(func) {
      return !!maskSrcKey2 && maskSrcKey2 in func;
    }
    function isPrototype2(value2) {
      var Ctor = value2 && value2.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto17;
      return value2 === proto;
    }
    function toSource2(func) {
      if (func != null) {
        try {
          return funcToString4.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function cloneDeep2(value2) {
      return baseClone2(value2, true, true);
    }
    function eq2(value2, other) {
      return value2 === other || value2 !== value2 && other !== other;
    }
    function isArguments2(value2) {
      return isArrayLikeObject2(value2) && hasOwnProperty14.call(value2, "callee") && (!propertyIsEnumerable3.call(value2, "callee") || objectToString2.call(value2) == argsTag5);
    }
    var isArray2 = Array.isArray;
    function isArrayLike2(value2) {
      return value2 != null && isLength2(value2.length) && !isFunction2(value2);
    }
    function isArrayLikeObject2(value2) {
      return isObjectLike2(value2) && isArrayLike2(value2);
    }
    var isBuffer2 = nativeIsBuffer2 || stubFalse2;
    function isFunction2(value2) {
      var tag = isObject2(value2) ? objectToString2.call(value2) : "";
      return tag == funcTag4 || tag == genTag3;
    }
    function isLength2(value2) {
      return typeof value2 == "number" && value2 > -1 && value2 % 1 == 0 && value2 <= MAX_SAFE_INTEGER3;
    }
    function isObject2(value2) {
      var type = typeof value2;
      return !!value2 && (type == "object" || type == "function");
    }
    function isObjectLike2(value2) {
      return !!value2 && typeof value2 == "object";
    }
    function keys2(object) {
      return isArrayLike2(object) ? arrayLikeKeys2(object) : baseKeys2(object);
    }
    function stubArray2() {
      return [];
    }
    function stubFalse2() {
      return false;
    }
    module2.exports = cloneDeep2;
  }
});

// ../../node_modules/lodash.isequal/index.js
var require_lodash2 = __commonJS({
  "../../node_modules/lodash.isequal/index.js"(exports2, module2) {
    var LARGE_ARRAY_SIZE2 = 200;
    var HASH_UNDEFINED4 = "__lodash_hash_undefined__";
    var COMPARE_PARTIAL_FLAG5 = 1;
    var COMPARE_UNORDERED_FLAG3 = 2;
    var MAX_SAFE_INTEGER3 = 9007199254740991;
    var argsTag5 = "[object Arguments]";
    var arrayTag4 = "[object Array]";
    var asyncTag2 = "[object AsyncFunction]";
    var boolTag5 = "[object Boolean]";
    var dateTag5 = "[object Date]";
    var errorTag4 = "[object Error]";
    var funcTag4 = "[object Function]";
    var genTag3 = "[object GeneratorFunction]";
    var mapTag7 = "[object Map]";
    var numberTag5 = "[object Number]";
    var nullTag2 = "[object Null]";
    var objectTag6 = "[object Object]";
    var promiseTag2 = "[object Promise]";
    var proxyTag2 = "[object Proxy]";
    var regexpTag5 = "[object RegExp]";
    var setTag7 = "[object Set]";
    var stringTag5 = "[object String]";
    var symbolTag4 = "[object Symbol]";
    var undefinedTag2 = "[object Undefined]";
    var weakMapTag4 = "[object WeakMap]";
    var arrayBufferTag5 = "[object ArrayBuffer]";
    var dataViewTag6 = "[object DataView]";
    var float32Tag4 = "[object Float32Array]";
    var float64Tag4 = "[object Float64Array]";
    var int8Tag4 = "[object Int8Array]";
    var int16Tag4 = "[object Int16Array]";
    var int32Tag4 = "[object Int32Array]";
    var uint8Tag4 = "[object Uint8Array]";
    var uint8ClampedTag4 = "[object Uint8ClampedArray]";
    var uint16Tag4 = "[object Uint16Array]";
    var uint32Tag4 = "[object Uint32Array]";
    var reRegExpChar2 = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor2 = /^\[object .+?Constructor\]$/;
    var reIsUint2 = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags2 = {};
    typedArrayTags2[float32Tag4] = typedArrayTags2[float64Tag4] = typedArrayTags2[int8Tag4] = typedArrayTags2[int16Tag4] = typedArrayTags2[int32Tag4] = typedArrayTags2[uint8Tag4] = typedArrayTags2[uint8ClampedTag4] = typedArrayTags2[uint16Tag4] = typedArrayTags2[uint32Tag4] = true;
    typedArrayTags2[argsTag5] = typedArrayTags2[arrayTag4] = typedArrayTags2[arrayBufferTag5] = typedArrayTags2[boolTag5] = typedArrayTags2[dataViewTag6] = typedArrayTags2[dateTag5] = typedArrayTags2[errorTag4] = typedArrayTags2[funcTag4] = typedArrayTags2[mapTag7] = typedArrayTags2[numberTag5] = typedArrayTags2[objectTag6] = typedArrayTags2[regexpTag5] = typedArrayTags2[setTag7] = typedArrayTags2[stringTag5] = typedArrayTags2[weakMapTag4] = false;
    var freeGlobal2 = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
    var freeExports4 = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule4 = freeExports4 && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports4 = freeModule4 && freeModule4.exports === freeExports4;
    var freeProcess2 = moduleExports4 && freeGlobal2.process;
    var nodeUtil2 = function() {
      try {
        return freeProcess2 && freeProcess2.binding && freeProcess2.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsTypedArray2 = nodeUtil2 && nodeUtil2.isTypedArray;
    function arrayFilter2(array, predicate) {
      var index = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length2) {
        var value2 = array[index];
        if (predicate(value2, index, array)) {
          result[resIndex++] = value2;
        }
      }
      return result;
    }
    function arrayPush2(array, values) {
      var index = -1, length2 = values.length, offset = array.length;
      while (++index < length2) {
        array[offset + index] = values[index];
      }
      return array;
    }
    function arraySome2(array, predicate) {
      var index = -1, length2 = array == null ? 0 : array.length;
      while (++index < length2) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    function baseTimes2(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary2(func) {
      return function(value2) {
        return func(value2);
      };
    }
    function cacheHas2(cache, key) {
      return cache.has(key);
    }
    function getValue2(object, key) {
      return object == null ? void 0 : object[key];
    }
    function mapToArray2(map3) {
      var index = -1, result = Array(map3.size);
      map3.forEach(function(value2, key) {
        result[++index] = [key, value2];
      });
      return result;
    }
    function overArg2(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function setToArray2(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value2) {
        result[++index] = value2;
      });
      return result;
    }
    var arrayProto2 = Array.prototype;
    var funcProto4 = Function.prototype;
    var objectProto17 = Object.prototype;
    var coreJsData2 = root2["__core-js_shared__"];
    var funcToString4 = funcProto4.toString;
    var hasOwnProperty14 = objectProto17.hasOwnProperty;
    var maskSrcKey2 = function() {
      var uid = /[^.]+$/.exec(coreJsData2 && coreJsData2.keys && coreJsData2.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    }();
    var nativeObjectToString3 = objectProto17.toString;
    var reIsNative2 = RegExp(
      "^" + funcToString4.call(hasOwnProperty14).replace(reRegExpChar2, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer4 = moduleExports4 ? root2.Buffer : void 0;
    var Symbol3 = root2.Symbol;
    var Uint8Array3 = root2.Uint8Array;
    var propertyIsEnumerable3 = objectProto17.propertyIsEnumerable;
    var splice2 = arrayProto2.splice;
    var symToStringTag3 = Symbol3 ? Symbol3.toStringTag : void 0;
    var nativeGetSymbols3 = Object.getOwnPropertySymbols;
    var nativeIsBuffer2 = Buffer4 ? Buffer4.isBuffer : void 0;
    var nativeKeys2 = overArg2(Object.keys, Object);
    var DataView3 = getNative2(root2, "DataView");
    var Map3 = getNative2(root2, "Map");
    var Promise3 = getNative2(root2, "Promise");
    var Set3 = getNative2(root2, "Set");
    var WeakMap3 = getNative2(root2, "WeakMap");
    var nativeCreate2 = getNative2(Object, "create");
    var dataViewCtorString2 = toSource2(DataView3);
    var mapCtorString2 = toSource2(Map3);
    var promiseCtorString2 = toSource2(Promise3);
    var setCtorString2 = toSource2(Set3);
    var weakMapCtorString2 = toSource2(WeakMap3);
    var symbolProto3 = Symbol3 ? Symbol3.prototype : void 0;
    var symbolValueOf3 = symbolProto3 ? symbolProto3.valueOf : void 0;
    function Hash2(entries) {
      var index = -1, length2 = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length2) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear2() {
      this.__data__ = nativeCreate2 ? nativeCreate2(null) : {};
      this.size = 0;
    }
    function hashDelete2(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet2(key) {
      var data = this.__data__;
      if (nativeCreate2) {
        var result = data[key];
        return result === HASH_UNDEFINED4 ? void 0 : result;
      }
      return hasOwnProperty14.call(data, key) ? data[key] : void 0;
    }
    function hashHas2(key) {
      var data = this.__data__;
      return nativeCreate2 ? data[key] !== void 0 : hasOwnProperty14.call(data, key);
    }
    function hashSet2(key, value2) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate2 && value2 === void 0 ? HASH_UNDEFINED4 : value2;
      return this;
    }
    Hash2.prototype.clear = hashClear2;
    Hash2.prototype["delete"] = hashDelete2;
    Hash2.prototype.get = hashGet2;
    Hash2.prototype.has = hashHas2;
    Hash2.prototype.set = hashSet2;
    function ListCache2(entries) {
      var index = -1, length2 = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length2) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear2() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete2(key) {
      var data = this.__data__, index = assocIndexOf2(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice2.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet2(key) {
      var data = this.__data__, index = assocIndexOf2(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas2(key) {
      return assocIndexOf2(this.__data__, key) > -1;
    }
    function listCacheSet2(key, value2) {
      var data = this.__data__, index = assocIndexOf2(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value2]);
      } else {
        data[index][1] = value2;
      }
      return this;
    }
    ListCache2.prototype.clear = listCacheClear2;
    ListCache2.prototype["delete"] = listCacheDelete2;
    ListCache2.prototype.get = listCacheGet2;
    ListCache2.prototype.has = listCacheHas2;
    ListCache2.prototype.set = listCacheSet2;
    function MapCache2(entries) {
      var index = -1, length2 = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length2) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear2() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash2(),
        "map": new (Map3 || ListCache2)(),
        "string": new Hash2()
      };
    }
    function mapCacheDelete2(key) {
      var result = getMapData2(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet2(key) {
      return getMapData2(this, key).get(key);
    }
    function mapCacheHas2(key) {
      return getMapData2(this, key).has(key);
    }
    function mapCacheSet2(key, value2) {
      var data = getMapData2(this, key), size = data.size;
      data.set(key, value2);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache2.prototype.clear = mapCacheClear2;
    MapCache2.prototype["delete"] = mapCacheDelete2;
    MapCache2.prototype.get = mapCacheGet2;
    MapCache2.prototype.has = mapCacheHas2;
    MapCache2.prototype.set = mapCacheSet2;
    function SetCache2(values) {
      var index = -1, length2 = values == null ? 0 : values.length;
      this.__data__ = new MapCache2();
      while (++index < length2) {
        this.add(values[index]);
      }
    }
    function setCacheAdd2(value2) {
      this.__data__.set(value2, HASH_UNDEFINED4);
      return this;
    }
    function setCacheHas2(value2) {
      return this.__data__.has(value2);
    }
    SetCache2.prototype.add = SetCache2.prototype.push = setCacheAdd2;
    SetCache2.prototype.has = setCacheHas2;
    function Stack2(entries) {
      var data = this.__data__ = new ListCache2(entries);
      this.size = data.size;
    }
    function stackClear2() {
      this.__data__ = new ListCache2();
      this.size = 0;
    }
    function stackDelete2(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet2(key) {
      return this.__data__.get(key);
    }
    function stackHas2(key) {
      return this.__data__.has(key);
    }
    function stackSet2(key, value2) {
      var data = this.__data__;
      if (data instanceof ListCache2) {
        var pairs = data.__data__;
        if (!Map3 || pairs.length < LARGE_ARRAY_SIZE2 - 1) {
          pairs.push([key, value2]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache2(pairs);
      }
      data.set(key, value2);
      this.size = data.size;
      return this;
    }
    Stack2.prototype.clear = stackClear2;
    Stack2.prototype["delete"] = stackDelete2;
    Stack2.prototype.get = stackGet2;
    Stack2.prototype.has = stackHas2;
    Stack2.prototype.set = stackSet2;
    function arrayLikeKeys2(value2, inherited) {
      var isArr = isArray2(value2), isArg = !isArr && isArguments2(value2), isBuff = !isArr && !isArg && isBuffer2(value2), isType = !isArr && !isArg && !isBuff && isTypedArray2(value2), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes2(value2.length, String) : [], length2 = result.length;
      for (var key in value2) {
        if ((inherited || hasOwnProperty14.call(value2, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex2(key, length2)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assocIndexOf2(array, key) {
      var length2 = array.length;
      while (length2--) {
        if (eq2(array[length2][0], key)) {
          return length2;
        }
      }
      return -1;
    }
    function baseGetAllKeys2(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray2(object) ? result : arrayPush2(result, symbolsFunc(object));
    }
    function baseGetTag2(value2) {
      if (value2 == null) {
        return value2 === void 0 ? undefinedTag2 : nullTag2;
      }
      return symToStringTag3 && symToStringTag3 in Object(value2) ? getRawTag2(value2) : objectToString2(value2);
    }
    function baseIsArguments2(value2) {
      return isObjectLike2(value2) && baseGetTag2(value2) == argsTag5;
    }
    function baseIsEqual2(value2, other, bitmask, customizer, stack) {
      if (value2 === other) {
        return true;
      }
      if (value2 == null || other == null || !isObjectLike2(value2) && !isObjectLike2(other)) {
        return value2 !== value2 && other !== other;
      }
      return baseIsEqualDeep2(value2, other, bitmask, customizer, baseIsEqual2, stack);
    }
    function baseIsEqualDeep2(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag4 : getTag2(object), othTag = othIsArr ? arrayTag4 : getTag2(other);
      objTag = objTag == argsTag5 ? objectTag6 : objTag;
      othTag = othTag == argsTag5 ? objectTag6 : othTag;
      var objIsObj = objTag == objectTag6, othIsObj = othTag == objectTag6, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer2(object)) {
        if (!isBuffer2(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack2());
        return objIsArr || isTypedArray2(object) ? equalArrays2(object, other, bitmask, customizer, equalFunc, stack) : equalByTag2(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG5)) {
        var objIsWrapped = objIsObj && hasOwnProperty14.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty14.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack2());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack2());
      return equalObjects2(object, other, bitmask, customizer, equalFunc, stack);
    }
    function baseIsNative2(value2) {
      if (!isObject2(value2) || isMasked2(value2)) {
        return false;
      }
      var pattern = isFunction2(value2) ? reIsNative2 : reIsHostCtor2;
      return pattern.test(toSource2(value2));
    }
    function baseIsTypedArray2(value2) {
      return isObjectLike2(value2) && isLength2(value2.length) && !!typedArrayTags2[baseGetTag2(value2)];
    }
    function baseKeys2(object) {
      if (!isPrototype2(object)) {
        return nativeKeys2(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty14.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    function equalArrays2(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG5, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var stacked = stack.get(array);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG3 ? new SetCache2() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome2(other, function(othValue2, othIndex) {
            if (!cacheHas2(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    function equalByTag2(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag6:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag5:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array3(object), new Uint8Array3(other))) {
            return false;
          }
          return true;
        case boolTag5:
        case dateTag5:
        case numberTag5:
          return eq2(+object, +other);
        case errorTag4:
          return object.name == other.name && object.message == other.message;
        case regexpTag5:
        case stringTag5:
          return object == other + "";
        case mapTag7:
          var convert = mapToArray2;
        case setTag7:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG5;
          convert || (convert = setToArray2);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG3;
          stack.set(object, other);
          var result = equalArrays2(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag4:
          if (symbolValueOf3) {
            return symbolValueOf3.call(object) == symbolValueOf3.call(other);
          }
      }
      return false;
    }
    function equalObjects2(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG5, objProps = getAllKeys2(object), objLength = objProps.length, othProps = getAllKeys2(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty14.call(other, key))) {
          return false;
        }
      }
      var stacked = stack.get(object);
      if (stacked && stack.get(other)) {
        return stacked == other;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    function getAllKeys2(object) {
      return baseGetAllKeys2(object, keys2, getSymbols2);
    }
    function getMapData2(map3, key) {
      var data = map3.__data__;
      return isKeyable2(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative2(object, key) {
      var value2 = getValue2(object, key);
      return baseIsNative2(value2) ? value2 : void 0;
    }
    function getRawTag2(value2) {
      var isOwn = hasOwnProperty14.call(value2, symToStringTag3), tag = value2[symToStringTag3];
      try {
        value2[symToStringTag3] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString3.call(value2);
      if (unmasked) {
        if (isOwn) {
          value2[symToStringTag3] = tag;
        } else {
          delete value2[symToStringTag3];
        }
      }
      return result;
    }
    var getSymbols2 = !nativeGetSymbols3 ? stubArray2 : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter2(nativeGetSymbols3(object), function(symbol) {
        return propertyIsEnumerable3.call(object, symbol);
      });
    };
    var getTag2 = baseGetTag2;
    if (DataView3 && getTag2(new DataView3(new ArrayBuffer(1))) != dataViewTag6 || Map3 && getTag2(new Map3()) != mapTag7 || Promise3 && getTag2(Promise3.resolve()) != promiseTag2 || Set3 && getTag2(new Set3()) != setTag7 || WeakMap3 && getTag2(new WeakMap3()) != weakMapTag4) {
      getTag2 = function(value2) {
        var result = baseGetTag2(value2), Ctor = result == objectTag6 ? value2.constructor : void 0, ctorString = Ctor ? toSource2(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString2:
              return dataViewTag6;
            case mapCtorString2:
              return mapTag7;
            case promiseCtorString2:
              return promiseTag2;
            case setCtorString2:
              return setTag7;
            case weakMapCtorString2:
              return weakMapTag4;
          }
        }
        return result;
      };
    }
    function isIndex2(value2, length2) {
      length2 = length2 == null ? MAX_SAFE_INTEGER3 : length2;
      return !!length2 && (typeof value2 == "number" || reIsUint2.test(value2)) && (value2 > -1 && value2 % 1 == 0 && value2 < length2);
    }
    function isKeyable2(value2) {
      var type = typeof value2;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value2 !== "__proto__" : value2 === null;
    }
    function isMasked2(func) {
      return !!maskSrcKey2 && maskSrcKey2 in func;
    }
    function isPrototype2(value2) {
      var Ctor = value2 && value2.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto17;
      return value2 === proto;
    }
    function objectToString2(value2) {
      return nativeObjectToString3.call(value2);
    }
    function toSource2(func) {
      if (func != null) {
        try {
          return funcToString4.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function eq2(value2, other) {
      return value2 === other || value2 !== value2 && other !== other;
    }
    var isArguments2 = baseIsArguments2(/* @__PURE__ */ function() {
      return arguments;
    }()) ? baseIsArguments2 : function(value2) {
      return isObjectLike2(value2) && hasOwnProperty14.call(value2, "callee") && !propertyIsEnumerable3.call(value2, "callee");
    };
    var isArray2 = Array.isArray;
    function isArrayLike2(value2) {
      return value2 != null && isLength2(value2.length) && !isFunction2(value2);
    }
    var isBuffer2 = nativeIsBuffer2 || stubFalse2;
    function isEqual4(value2, other) {
      return baseIsEqual2(value2, other);
    }
    function isFunction2(value2) {
      if (!isObject2(value2)) {
        return false;
      }
      var tag = baseGetTag2(value2);
      return tag == funcTag4 || tag == genTag3 || tag == asyncTag2 || tag == proxyTag2;
    }
    function isLength2(value2) {
      return typeof value2 == "number" && value2 > -1 && value2 % 1 == 0 && value2 <= MAX_SAFE_INTEGER3;
    }
    function isObject2(value2) {
      var type = typeof value2;
      return value2 != null && (type == "object" || type == "function");
    }
    function isObjectLike2(value2) {
      return value2 != null && typeof value2 == "object";
    }
    var isTypedArray2 = nodeIsTypedArray2 ? baseUnary2(nodeIsTypedArray2) : baseIsTypedArray2;
    function keys2(object) {
      return isArrayLike2(object) ? arrayLikeKeys2(object) : baseKeys2(object);
    }
    function stubArray2() {
      return [];
    }
    function stubFalse2() {
      return false;
    }
    module2.exports = isEqual4;
  }
});

// ../../node_modules/quill-delta/dist/AttributeMap.js
var require_AttributeMap = __commonJS({
  "../../node_modules/quill-delta/dist/AttributeMap.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var cloneDeep2 = require_lodash();
    var isEqual4 = require_lodash2();
    var AttributeMap5;
    (function(AttributeMap6) {
      function compose(a = {}, b = {}, keepNull = false) {
        if (typeof a !== "object") {
          a = {};
        }
        if (typeof b !== "object") {
          b = {};
        }
        let attributes = cloneDeep2(b);
        if (!keepNull) {
          attributes = Object.keys(attributes).reduce((copy2, key) => {
            if (attributes[key] != null) {
              copy2[key] = attributes[key];
            }
            return copy2;
          }, {});
        }
        for (const key in a) {
          if (a[key] !== void 0 && b[key] === void 0) {
            attributes[key] = a[key];
          }
        }
        return Object.keys(attributes).length > 0 ? attributes : void 0;
      }
      AttributeMap6.compose = compose;
      function diff(a = {}, b = {}) {
        if (typeof a !== "object") {
          a = {};
        }
        if (typeof b !== "object") {
          b = {};
        }
        const attributes = Object.keys(a).concat(Object.keys(b)).reduce((attrs, key) => {
          if (!isEqual4(a[key], b[key])) {
            attrs[key] = b[key] === void 0 ? null : b[key];
          }
          return attrs;
        }, {});
        return Object.keys(attributes).length > 0 ? attributes : void 0;
      }
      AttributeMap6.diff = diff;
      function invert(attr = {}, base = {}) {
        attr = attr || {};
        const baseInverted = Object.keys(base).reduce((memo, key) => {
          if (base[key] !== attr[key] && attr[key] !== void 0) {
            memo[key] = base[key];
          }
          return memo;
        }, {});
        return Object.keys(attr).reduce((memo, key) => {
          if (attr[key] !== base[key] && base[key] === void 0) {
            memo[key] = null;
          }
          return memo;
        }, baseInverted);
      }
      AttributeMap6.invert = invert;
      function transform(a, b, priority = false) {
        if (typeof a !== "object") {
          return b;
        }
        if (typeof b !== "object") {
          return void 0;
        }
        if (!priority) {
          return b;
        }
        const attributes = Object.keys(b).reduce((attrs, key) => {
          if (a[key] === void 0) {
            attrs[key] = b[key];
          }
          return attrs;
        }, {});
        return Object.keys(attributes).length > 0 ? attributes : void 0;
      }
      AttributeMap6.transform = transform;
    })(AttributeMap5 || (AttributeMap5 = {}));
    exports2.default = AttributeMap5;
  }
});

// ../../node_modules/quill-delta/dist/Op.js
var require_Op = __commonJS({
  "../../node_modules/quill-delta/dist/Op.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Op4;
    (function(Op5) {
      function length2(op) {
        if (typeof op.delete === "number") {
          return op.delete;
        } else if (typeof op.retain === "number") {
          return op.retain;
        } else if (typeof op.retain === "object" && op.retain !== null) {
          return 1;
        } else {
          return typeof op.insert === "string" ? op.insert.length : 1;
        }
      }
      Op5.length = length2;
    })(Op4 || (Op4 = {}));
    exports2.default = Op4;
  }
});

// ../../node_modules/quill-delta/dist/OpIterator.js
var require_OpIterator = __commonJS({
  "../../node_modules/quill-delta/dist/OpIterator.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    var Op_1 = require_Op();
    var Iterator = class {
      constructor(ops) {
        this.ops = ops;
        this.index = 0;
        this.offset = 0;
      }
      hasNext() {
        return this.peekLength() < Infinity;
      }
      next(length2) {
        if (!length2) {
          length2 = Infinity;
        }
        const nextOp = this.ops[this.index];
        if (nextOp) {
          const offset = this.offset;
          const opLength = Op_1.default.length(nextOp);
          if (length2 >= opLength - offset) {
            length2 = opLength - offset;
            this.index += 1;
            this.offset = 0;
          } else {
            this.offset += length2;
          }
          if (typeof nextOp.delete === "number") {
            return { delete: length2 };
          } else {
            const retOp = {};
            if (nextOp.attributes) {
              retOp.attributes = nextOp.attributes;
            }
            if (typeof nextOp.retain === "number") {
              retOp.retain = length2;
            } else if (typeof nextOp.retain === "object" && nextOp.retain !== null) {
              retOp.retain = nextOp.retain;
            } else if (typeof nextOp.insert === "string") {
              retOp.insert = nextOp.insert.substr(offset, length2);
            } else {
              retOp.insert = nextOp.insert;
            }
            return retOp;
          }
        } else {
          return { retain: Infinity };
        }
      }
      peek() {
        return this.ops[this.index];
      }
      peekLength() {
        if (this.ops[this.index]) {
          return Op_1.default.length(this.ops[this.index]) - this.offset;
        } else {
          return Infinity;
        }
      }
      peekType() {
        const op = this.ops[this.index];
        if (op) {
          if (typeof op.delete === "number") {
            return "delete";
          } else if (typeof op.retain === "number" || typeof op.retain === "object" && op.retain !== null) {
            return "retain";
          } else {
            return "insert";
          }
        }
        return "retain";
      }
      rest() {
        if (!this.hasNext()) {
          return [];
        } else if (this.offset === 0) {
          return this.ops.slice(this.index);
        } else {
          const offset = this.offset;
          const index = this.index;
          const next = this.next();
          const rest = this.ops.slice(this.index);
          this.offset = offset;
          this.index = index;
          return [next].concat(rest);
        }
      }
    };
    exports2.default = Iterator;
  }
});

// ../../node_modules/quill-delta/dist/Delta.js
var require_Delta = __commonJS({
  "../../node_modules/quill-delta/dist/Delta.js"(exports2, module2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AttributeMap = exports2.OpIterator = exports2.Op = void 0;
    var diff = require_diff();
    var cloneDeep2 = require_lodash();
    var isEqual4 = require_lodash2();
    var AttributeMap_1 = require_AttributeMap();
    exports2.AttributeMap = AttributeMap_1.default;
    var Op_1 = require_Op();
    exports2.Op = Op_1.default;
    var OpIterator_1 = require_OpIterator();
    exports2.OpIterator = OpIterator_1.default;
    var NULL_CHARACTER = String.fromCharCode(0);
    var getEmbedTypeAndData = (a, b) => {
      if (typeof a !== "object" || a === null) {
        throw new Error(`cannot retain a ${typeof a}`);
      }
      if (typeof b !== "object" || b === null) {
        throw new Error(`cannot retain a ${typeof b}`);
      }
      const embedType = Object.keys(a)[0];
      if (!embedType || embedType !== Object.keys(b)[0]) {
        throw new Error(`embed types not matched: ${embedType} != ${Object.keys(b)[0]}`);
      }
      return [embedType, a[embedType], b[embedType]];
    };
    var Delta10 = class _Delta {
      constructor(ops) {
        if (Array.isArray(ops)) {
          this.ops = ops;
        } else if (ops != null && Array.isArray(ops.ops)) {
          this.ops = ops.ops;
        } else {
          this.ops = [];
        }
      }
      static registerEmbed(embedType, handler) {
        this.handlers[embedType] = handler;
      }
      static unregisterEmbed(embedType) {
        delete this.handlers[embedType];
      }
      static getHandler(embedType) {
        const handler = this.handlers[embedType];
        if (!handler) {
          throw new Error(`no handlers for embed type "${embedType}"`);
        }
        return handler;
      }
      insert(arg, attributes) {
        const newOp = {};
        if (typeof arg === "string" && arg.length === 0) {
          return this;
        }
        newOp.insert = arg;
        if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
          newOp.attributes = attributes;
        }
        return this.push(newOp);
      }
      delete(length2) {
        if (length2 <= 0) {
          return this;
        }
        return this.push({ delete: length2 });
      }
      retain(length2, attributes) {
        if (typeof length2 === "number" && length2 <= 0) {
          return this;
        }
        const newOp = { retain: length2 };
        if (attributes != null && typeof attributes === "object" && Object.keys(attributes).length > 0) {
          newOp.attributes = attributes;
        }
        return this.push(newOp);
      }
      push(newOp) {
        let index = this.ops.length;
        let lastOp = this.ops[index - 1];
        newOp = cloneDeep2(newOp);
        if (typeof lastOp === "object") {
          if (typeof newOp.delete === "number" && typeof lastOp.delete === "number") {
            this.ops[index - 1] = { delete: lastOp.delete + newOp.delete };
            return this;
          }
          if (typeof lastOp.delete === "number" && newOp.insert != null) {
            index -= 1;
            lastOp = this.ops[index - 1];
            if (typeof lastOp !== "object") {
              this.ops.unshift(newOp);
              return this;
            }
          }
          if (isEqual4(newOp.attributes, lastOp.attributes)) {
            if (typeof newOp.insert === "string" && typeof lastOp.insert === "string") {
              this.ops[index - 1] = { insert: lastOp.insert + newOp.insert };
              if (typeof newOp.attributes === "object") {
                this.ops[index - 1].attributes = newOp.attributes;
              }
              return this;
            } else if (typeof newOp.retain === "number" && typeof lastOp.retain === "number") {
              this.ops[index - 1] = { retain: lastOp.retain + newOp.retain };
              if (typeof newOp.attributes === "object") {
                this.ops[index - 1].attributes = newOp.attributes;
              }
              return this;
            }
          }
        }
        if (index === this.ops.length) {
          this.ops.push(newOp);
        } else {
          this.ops.splice(index, 0, newOp);
        }
        return this;
      }
      chop() {
        const lastOp = this.ops[this.ops.length - 1];
        if (lastOp && typeof lastOp.retain === "number" && !lastOp.attributes) {
          this.ops.pop();
        }
        return this;
      }
      filter(predicate) {
        return this.ops.filter(predicate);
      }
      forEach(predicate) {
        this.ops.forEach(predicate);
      }
      map(predicate) {
        return this.ops.map(predicate);
      }
      partition(predicate) {
        const passed = [];
        const failed = [];
        this.forEach((op) => {
          const target = predicate(op) ? passed : failed;
          target.push(op);
        });
        return [passed, failed];
      }
      reduce(predicate, initialValue) {
        return this.ops.reduce(predicate, initialValue);
      }
      changeLength() {
        return this.reduce((length2, elem) => {
          if (elem.insert) {
            return length2 + Op_1.default.length(elem);
          } else if (elem.delete) {
            return length2 - elem.delete;
          }
          return length2;
        }, 0);
      }
      length() {
        return this.reduce((length2, elem) => {
          return length2 + Op_1.default.length(elem);
        }, 0);
      }
      slice(start2 = 0, end = Infinity) {
        const ops = [];
        const iter = new OpIterator_1.default(this.ops);
        let index = 0;
        while (index < end && iter.hasNext()) {
          let nextOp;
          if (index < start2) {
            nextOp = iter.next(start2 - index);
          } else {
            nextOp = iter.next(end - index);
            ops.push(nextOp);
          }
          index += Op_1.default.length(nextOp);
        }
        return new _Delta(ops);
      }
      compose(other) {
        const thisIter = new OpIterator_1.default(this.ops);
        const otherIter = new OpIterator_1.default(other.ops);
        const ops = [];
        const firstOther = otherIter.peek();
        if (firstOther != null && typeof firstOther.retain === "number" && firstOther.attributes == null) {
          let firstLeft = firstOther.retain;
          while (thisIter.peekType() === "insert" && thisIter.peekLength() <= firstLeft) {
            firstLeft -= thisIter.peekLength();
            ops.push(thisIter.next());
          }
          if (firstOther.retain - firstLeft > 0) {
            otherIter.next(firstOther.retain - firstLeft);
          }
        }
        const delta = new _Delta(ops);
        while (thisIter.hasNext() || otherIter.hasNext()) {
          if (otherIter.peekType() === "insert") {
            delta.push(otherIter.next());
          } else if (thisIter.peekType() === "delete") {
            delta.push(thisIter.next());
          } else {
            const length2 = Math.min(thisIter.peekLength(), otherIter.peekLength());
            const thisOp = thisIter.next(length2);
            const otherOp = otherIter.next(length2);
            if (otherOp.retain) {
              const newOp = {};
              if (typeof thisOp.retain === "number") {
                newOp.retain = typeof otherOp.retain === "number" ? length2 : otherOp.retain;
              } else {
                if (typeof otherOp.retain === "number") {
                  if (thisOp.retain == null) {
                    newOp.insert = thisOp.insert;
                  } else {
                    newOp.retain = thisOp.retain;
                  }
                } else {
                  const action = thisOp.retain == null ? "insert" : "retain";
                  const [embedType, thisData, otherData] = getEmbedTypeAndData(thisOp[action], otherOp.retain);
                  const handler = _Delta.getHandler(embedType);
                  newOp[action] = {
                    [embedType]: handler.compose(thisData, otherData, action === "retain")
                  };
                }
              }
              const attributes = AttributeMap_1.default.compose(thisOp.attributes, otherOp.attributes, typeof thisOp.retain === "number");
              if (attributes) {
                newOp.attributes = attributes;
              }
              delta.push(newOp);
              if (!otherIter.hasNext() && isEqual4(delta.ops[delta.ops.length - 1], newOp)) {
                const rest = new _Delta(thisIter.rest());
                return delta.concat(rest).chop();
              }
            } else if (typeof otherOp.delete === "number" && (typeof thisOp.retain === "number" || typeof thisOp.retain === "object" && thisOp.retain !== null)) {
              delta.push(otherOp);
            }
          }
        }
        return delta.chop();
      }
      concat(other) {
        const delta = new _Delta(this.ops.slice());
        if (other.ops.length > 0) {
          delta.push(other.ops[0]);
          delta.ops = delta.ops.concat(other.ops.slice(1));
        }
        return delta;
      }
      diff(other, cursor) {
        if (this.ops === other.ops) {
          return new _Delta();
        }
        const strings = [this, other].map((delta) => {
          return delta.map((op) => {
            if (op.insert != null) {
              return typeof op.insert === "string" ? op.insert : NULL_CHARACTER;
            }
            const prep = delta === other ? "on" : "with";
            throw new Error("diff() called " + prep + " non-document");
          }).join("");
        });
        const retDelta = new _Delta();
        const diffResult = diff(strings[0], strings[1], cursor, true);
        const thisIter = new OpIterator_1.default(this.ops);
        const otherIter = new OpIterator_1.default(other.ops);
        diffResult.forEach((component2) => {
          let length2 = component2[1].length;
          while (length2 > 0) {
            let opLength = 0;
            switch (component2[0]) {
              case diff.INSERT:
                opLength = Math.min(otherIter.peekLength(), length2);
                retDelta.push(otherIter.next(opLength));
                break;
              case diff.DELETE:
                opLength = Math.min(length2, thisIter.peekLength());
                thisIter.next(opLength);
                retDelta.delete(opLength);
                break;
              case diff.EQUAL:
                opLength = Math.min(thisIter.peekLength(), otherIter.peekLength(), length2);
                const thisOp = thisIter.next(opLength);
                const otherOp = otherIter.next(opLength);
                if (isEqual4(thisOp.insert, otherOp.insert)) {
                  retDelta.retain(opLength, AttributeMap_1.default.diff(thisOp.attributes, otherOp.attributes));
                } else {
                  retDelta.push(otherOp).delete(opLength);
                }
                break;
            }
            length2 -= opLength;
          }
        });
        return retDelta.chop();
      }
      eachLine(predicate, newline = "\n") {
        const iter = new OpIterator_1.default(this.ops);
        let line = new _Delta();
        let i = 0;
        while (iter.hasNext()) {
          if (iter.peekType() !== "insert") {
            return;
          }
          const thisOp = iter.peek();
          const start2 = Op_1.default.length(thisOp) - iter.peekLength();
          const index = typeof thisOp.insert === "string" ? thisOp.insert.indexOf(newline, start2) - start2 : -1;
          if (index < 0) {
            line.push(iter.next());
          } else if (index > 0) {
            line.push(iter.next(index));
          } else {
            if (predicate(line, iter.next(1).attributes || {}, i) === false) {
              return;
            }
            i += 1;
            line = new _Delta();
          }
        }
        if (line.length() > 0) {
          predicate(line, {}, i);
        }
      }
      invert(base) {
        const inverted = new _Delta();
        this.reduce((baseIndex, op) => {
          if (op.insert) {
            inverted.delete(Op_1.default.length(op));
          } else if (typeof op.retain === "number" && op.attributes == null) {
            inverted.retain(op.retain);
            return baseIndex + op.retain;
          } else if (op.delete || typeof op.retain === "number") {
            const length2 = op.delete || op.retain;
            const slice = base.slice(baseIndex, baseIndex + length2);
            slice.forEach((baseOp) => {
              if (op.delete) {
                inverted.push(baseOp);
              } else if (op.retain && op.attributes) {
                inverted.retain(Op_1.default.length(baseOp), AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
              }
            });
            return baseIndex + length2;
          } else if (typeof op.retain === "object" && op.retain !== null) {
            const slice = base.slice(baseIndex, baseIndex + 1);
            const baseOp = new OpIterator_1.default(slice.ops).next();
            const [embedType, opData, baseOpData] = getEmbedTypeAndData(op.retain, baseOp.insert);
            const handler = _Delta.getHandler(embedType);
            inverted.retain({ [embedType]: handler.invert(opData, baseOpData) }, AttributeMap_1.default.invert(op.attributes, baseOp.attributes));
            return baseIndex + 1;
          }
          return baseIndex;
        }, 0);
        return inverted.chop();
      }
      transform(arg, priority = false) {
        priority = !!priority;
        if (typeof arg === "number") {
          return this.transformPosition(arg, priority);
        }
        const other = arg;
        const thisIter = new OpIterator_1.default(this.ops);
        const otherIter = new OpIterator_1.default(other.ops);
        const delta = new _Delta();
        while (thisIter.hasNext() || otherIter.hasNext()) {
          if (thisIter.peekType() === "insert" && (priority || otherIter.peekType() !== "insert")) {
            delta.retain(Op_1.default.length(thisIter.next()));
          } else if (otherIter.peekType() === "insert") {
            delta.push(otherIter.next());
          } else {
            const length2 = Math.min(thisIter.peekLength(), otherIter.peekLength());
            const thisOp = thisIter.next(length2);
            const otherOp = otherIter.next(length2);
            if (thisOp.delete) {
              continue;
            } else if (otherOp.delete) {
              delta.push(otherOp);
            } else {
              const thisData = thisOp.retain;
              const otherData = otherOp.retain;
              let transformedData = typeof otherData === "object" && otherData !== null ? otherData : length2;
              if (typeof thisData === "object" && thisData !== null && typeof otherData === "object" && otherData !== null) {
                const embedType = Object.keys(thisData)[0];
                if (embedType === Object.keys(otherData)[0]) {
                  const handler = _Delta.getHandler(embedType);
                  if (handler) {
                    transformedData = {
                      [embedType]: handler.transform(thisData[embedType], otherData[embedType], priority)
                    };
                  }
                }
              }
              delta.retain(transformedData, AttributeMap_1.default.transform(thisOp.attributes, otherOp.attributes, priority));
            }
          }
        }
        return delta.chop();
      }
      transformPosition(index, priority = false) {
        priority = !!priority;
        const thisIter = new OpIterator_1.default(this.ops);
        let offset = 0;
        while (thisIter.hasNext() && offset <= index) {
          const length2 = thisIter.peekLength();
          const nextType = thisIter.peekType();
          thisIter.next();
          if (nextType === "delete") {
            index -= Math.min(length2, index - offset);
            continue;
          } else if (nextType === "insert" && (offset < index || !priority)) {
            index += length2;
          }
          offset += length2;
        }
        return index;
      }
    };
    Delta10.Op = Op_1.default;
    Delta10.OpIterator = OpIterator_1.default;
    Delta10.AttributeMap = AttributeMap_1.default;
    Delta10.handlers = {};
    exports2.default = Delta10;
    if (typeof module2 === "object") {
      module2.exports = Delta10;
      module2.exports.default = Delta10;
    }
  }
});

// ../../node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "../../node_modules/eventemitter3/index.js"(exports2, module2) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__)
        prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt])
        emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn)
        emitter._events[evt].push(listener);
      else
        emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0)
        emitter._events = new Events();
      else
        delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0)
        return names;
      for (name in events = this._events) {
        if (has.call(events, name))
          names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers)
        return [];
      if (handlers.fn)
        return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners)
        return 0;
      if (listeners.fn)
        return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once)
          this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length2 = listeners.length, j;
        for (i = 0; i < length2; i++) {
          if (listeners[i].once)
            this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args)
                for (j = 1, args = new Array(len - 1); j < len; j++) {
                  args[j - 1] = arguments[j];
                }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt])
        return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length2 = listeners.length; i < length2; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length)
          this._events[evt] = events.length === 1 ? events[0] : events;
        else
          clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt])
          clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module2) {
      module2.exports = EventEmitter2;
    }
  }
});

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
function makeError(variant, module2, line, fn, message, extra) {
  let error = new globalThis.Error(message);
  error.gleam_error = variant;
  error.module = module2;
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
function each(loop$list, loop$f) {
  while (true) {
    let list = loop$list;
    let f = loop$f;
    if (list.hasLength(0)) {
      return void 0;
    } else {
      let x = list.head;
      let xs = list.tail;
      f(x);
      loop$list = xs;
      loop$f = f;
    }
  }
}

// build/dev/javascript/gleam_stdlib/dict.mjs
var tempDataView = new DataView(new ArrayBuffer(8));
var SHIFT = 5;
var BUCKET_SIZE = Math.pow(2, SHIFT);
var MASK = BUCKET_SIZE - 1;
var MAX_INDEX_NODE = BUCKET_SIZE / 2;
var MIN_ARRAY_NODE = BUCKET_SIZE / 4;

// build/dev/javascript/gleam_stdlib/gleam_stdlib.mjs
function console_log(term) {
  console.log(term);
}

// build/dev/javascript/gleam_stdlib/gleam/io.mjs
function println(string) {
  return console_log(string);
}

// build/dev/javascript/gleam_stdlib/gleam/function.mjs
function tap(arg, effect) {
  effect(arg);
  return arg;
}

// build/dev/javascript/novdom/utils_ffi.mjs
function create_id() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 12).padStart(12, 0);
}

// build/dev/javascript/novdom/novdom/component.mjs
var Component = class extends CustomType {
  constructor(id, tag) {
    super();
    this.id = id;
    this.tag = tag;
  }
};
function document2() {
  return new Component("document", "");
}
function drag_component() {
  return new Component("_drag_", "");
}
function component(tag, children) {
  let _pipe = create_id();
  let _pipe$1 = new Component(_pipe, tag);
  return tap(
    _pipe$1,
    (_capture) => {
      return get_element(_capture, children);
    }
  );
}
var text_tag = "_TEXT_";
function text(value2) {
  let _pipe = create_id();
  let _pipe$1 = new Component(_pipe, text_tag);
  return tap(
    _pipe$1,
    (_capture) => {
      return get_element(_capture, value2);
    }
  );
}

// build/dev/javascript/novdom/novdom/listener.mjs
function onclick(callback) {
  return new Listener("click", callback);
}
function onmousemove(callback) {
  return new Listener("mousemove", callback);
}
function onmouseup(callback) {
  return new Listener("mouseup", callback);
}
function onkeydown(callback) {
  return new Listener("keydown", callback);
}

// build/dev/javascript/novdom/novdom/hotkey.mjs
var Shift = class extends CustomType {
};
var Alt = class extends CustomType {
};
var Short = class extends CustomType {
};
var Hotkey = class extends CustomType {
  constructor(code, modifiers) {
    super();
    this.code = code;
    this.modifiers = modifiers;
  }
};
var Key = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
var Id = class extends CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
};
function configure_ids(config4) {
  return each(
    config4,
    (_use0) => {
      let id = _use0[0];
      let keys2 = _use0[1];
      return each(keys2, (key) => {
        return add_hotkey(id, key);
      });
    }
  );
}
function init() {
  let _pipe = document2();
  set_parameters(_pipe, toList([onkeydown(keypress_callback)]));
  return void 0;
}
function with_hotkey(option, callback) {
  let id = (() => {
    if (option instanceof Key) {
      let hotkey = option[0];
      let id2 = create_id();
      add_hotkey(id2, hotkey);
      return id2;
    } else {
      let id2 = option[0];
      return id2;
    }
  })();
  set_hotkey_listener(id, callback);
  return callback;
}

// build/dev/javascript/novdom/document_ffi.mjs
var HTML = "_HTML_";
function init2() {
  window.state_map = /* @__PURE__ */ new Map();
  window.parameter_component_map = /* @__PURE__ */ new Map();
  window.state_parameter_last_value_map = /* @__PURE__ */ new Map();
  window.state_listener = /* @__PURE__ */ new Map();
  window.reference_map = /* @__PURE__ */ new Map();
  window.hotkey_key_map = /* @__PURE__ */ new Map();
  window.hotkey_id_map = /* @__PURE__ */ new Map();
  window.hotkey_listener = /* @__PURE__ */ new Map();
}
function add_to_unrendered(elem) {
  document.getElementById("_unrendered_").appendChild(elem);
}
function add_to_viewport(comp, id) {
  const elem = get_element(comp);
  const viewport = document.getElementById(id);
  viewport.appendChild(elem);
}
function get_element(comp, children_comp) {
  if (comp.id === "document") {
    return document;
  }
  if (comp.id === HTML) {
    const html = document.createElement(HTML);
    html.insertAdjacentHTML("beforeend", comp.tag);
    return html;
  }
  const existing = document.getElementById(comp.id);
  if (existing) {
    return existing;
  }
  const elem = document.createElement(comp.tag);
  elem.setAttribute("id", comp.id);
  try {
    const children = children_comp.toArray().map(get_element);
    elem.replaceChildren(...children);
  } catch (_) {
    elem.textContent = children_comp;
  }
  add_to_unrendered(elem);
  return elem;
}
function add_parameter(comp, param_id) {
  window.parameter_component_map.set(param_id, comp.id);
  return comp;
}
function add_attribute(comp, name, value2) {
  const elem = get_element(comp);
  handle_attribute(elem, name, value2, false);
  return comp;
}
function handle_attribute(elem, name, value2, remove) {
  if (value2 === "" || value2.length === 0) {
    elem.removeAttribute(name);
    return;
  }
  switch (name) {
    case "class":
      value2.split(" ").forEach((cls) => {
        if (remove) {
          elem.classList.remove(cls);
          return;
        }
        elem.classList.add(cls);
      });
      return;
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
      return;
    default:
      if (remove) {
        elem.removeAttribute(name);
        return;
      }
      elem.setAttribute(name, value2);
      return;
  }
}
function add_listener(comp, name, callback) {
  const elem = get_element(comp);
  elem.addEventListener(name, callback);
  return comp;
}
function set_children(comp, children_comp) {
  const elem = get_element(comp);
  const children = children_comp.toArray().map(get_element);
  elem.replaceChildren(...children);
  return comp;
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
function add_hotkey(id, key) {
  const current = window.hotkey_id_map.get(id) || [];
  const key_string = encode_key(key);
  window.hotkey_id_map.set(id, [key_string, ...current]);
  update_hotkey_map_add([key_string], id);
}
function update_hotkey_map_add(hotkeys, id) {
  hotkeys.forEach((k) => {
    const current = window.hotkey_key_map.get(k) || [];
    window.hotkey_key_map.set(k, [id, ...current]);
  });
}
function encode_key(key) {
  let is_short = key.ctrlKey || key.metaKey;
  let is_shift = key.shiftKey;
  let is_alt = key.altKey;
  if (key.modifiers) {
    const modifier_names = key.modifiers.toArray().map((m) => m.constructor.name);
    is_short = modifier_names.includes("Short");
    is_shift = modifier_names.includes("Shift");
    is_alt = modifier_names.includes("Alt");
  }
  return (key.code + ";" + (is_shift ? "Shift," : "") + (is_alt ? "Alt," : "") + (is_short ? "Short," : "")).slice(0, -1);
}
function keypress_callback(event) {
  const pressed_key = encode_key(event);
  const ids = window.hotkey_key_map.get(pressed_key) || [];
  if (ids.length === 0) {
    return;
  }
  event.preventDefault();
  ids.forEach((id) => window.hotkey_listener.get(id)(event));
}
function set_hotkey_listener(id, listener) {
  window.hotkey_listener.set(id, listener);
}
function store_mouse_position(e) {
  const drag = document.getElementById("_drag_");
  drag.style.setProperty("--mouse-x", e.clientX + "px");
  drag.style.setProperty("--mouse-y", e.clientY + "px");
}

// build/dev/javascript/novdom/novdom/internals/parameter.mjs
var Attribute = class extends CustomType {
  constructor(name, value2) {
    super();
    this.name = name;
    this.value = value2;
  }
};
var Listener = class extends CustomType {
  constructor(name, callback) {
    super();
    this.name = name;
    this.callback = callback;
  }
};
var Modifier = class extends CustomType {
  constructor(name, callback) {
    super();
    this.name = name;
    this.callback = callback;
  }
};
function set_parameters(component2, params) {
  each(
    params,
    (param) => {
      if (param instanceof Attribute) {
        let key = param.name;
        let value2 = param.value;
        return add_attribute(component2, key, value2);
      } else if (param instanceof Listener) {
        let name = param.name;
        let callback = param.callback;
        return add_listener(component2, name, callback);
      } else if (param instanceof Modifier) {
        let name = param.name;
        let callback = param.callback;
        throw makeError(
          "todo",
          "novdom/internals/parameter",
          26,
          "",
          "Implement add_modifier",
          {}
        );
      } else {
        let id = param.id;
        let params$1 = param[1];
        let _pipe = component2;
        let _pipe$1 = add_parameter(_pipe, id);
        return set_parameters(_pipe$1, params$1);
      }
    }
  );
  return component2;
}

// build/dev/javascript/novdom/novdom/attribute.mjs
function class$(value2) {
  return new Attribute("class", value2);
}

// build/dev/javascript/novdom/novdom/state.mjs
var State = class extends CustomType {
  constructor(state_id) {
    super();
    this.state_id = state_id;
  }
};
function from_id(id) {
  return new State(id);
}
function value(state) {
  return get_state(state.state_id);
}
function create_with_id(id, init5) {
  set_state(id, init5);
  return new State(id);
}
function update2(state, new$2) {
  return update_state(state.state_id, new$2);
}
function listen(state, callback) {
  return add_state_listener(state.state_id, callback);
}

// build/dev/javascript/novdom/novdom/state_component.mjs
var state_component_tag = "_STATE_COMPONENT_";
function utilize(state, do$) {
  let children = do$(value(state));
  let comp = component(state_component_tag, children);
  let callback = (a) => {
    let _pipe = comp;
    set_children(_pipe, do$(a));
    return void 0;
  };
  listen(state, callback);
  return comp;
}

// build/dev/javascript/novdom/novdom/motion.mjs
var drag_event_id = "_DRAGGABLE_";
function cleanup() {
  let state = from_id(drag_event_id);
  return () => {
    return update2(state, new None());
  };
}
function init3() {
  let drag_event = create_with_id(drag_event_id, new None());
  let _pipe = document2();
  set_parameters(
    _pipe,
    toList([
      onmouseup(
        (_) => {
          let $ = value(drag_event);
          if ($ instanceof Some && !$[0].droppable) {
            let event = $[0];
            return event.cancel(event, cleanup());
          } else {
            return void 0;
          }
        }
      ),
      onmousemove((e) => {
        return store_mouse_position(e);
      })
    ])
  );
  let _pipe$1 = drag_component();
  return set_children(
    _pipe$1,
    toList([
      utilize(
        drag_event,
        (event) => {
          if (event instanceof Some) {
            let event$1 = event[0];
            return toList([event$1.preview]);
          } else {
            return toList([]);
          }
        }
      )
    ])
  );
}

// build/dev/javascript/novdom/novdom/framework.mjs
function start(component2) {
  init2();
  init3();
  init();
  let _pipe = component2();
  return add_to_viewport(_pipe, "_app_");
}

// build/dev/javascript/novdom/novdom/html.mjs
var div_tag = "div";
function div(parameters, children) {
  let _pipe = component(div_tag, children);
  return set_parameters(_pipe, parameters);
}

// ../../node_modules/lodash-es/_freeGlobal.js
var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
var freeGlobal_default = freeGlobal;

// ../../node_modules/lodash-es/_root.js
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal_default || freeSelf || Function("return this")();
var root_default = root;

// ../../node_modules/lodash-es/_Symbol.js
var Symbol2 = root_default.Symbol;
var Symbol_default = Symbol2;

// ../../node_modules/lodash-es/_getRawTag.js
var objectProto = Object.prototype;
var hasOwnProperty = objectProto.hasOwnProperty;
var nativeObjectToString = objectProto.toString;
var symToStringTag = Symbol_default ? Symbol_default.toStringTag : void 0;
function getRawTag(value2) {
  var isOwn = hasOwnProperty.call(value2, symToStringTag), tag = value2[symToStringTag];
  try {
    value2[symToStringTag] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString.call(value2);
  if (unmasked) {
    if (isOwn) {
      value2[symToStringTag] = tag;
    } else {
      delete value2[symToStringTag];
    }
  }
  return result;
}
var getRawTag_default = getRawTag;

// ../../node_modules/lodash-es/_objectToString.js
var objectProto2 = Object.prototype;
var nativeObjectToString2 = objectProto2.toString;
function objectToString(value2) {
  return nativeObjectToString2.call(value2);
}
var objectToString_default = objectToString;

// ../../node_modules/lodash-es/_baseGetTag.js
var nullTag = "[object Null]";
var undefinedTag = "[object Undefined]";
var symToStringTag2 = Symbol_default ? Symbol_default.toStringTag : void 0;
function baseGetTag(value2) {
  if (value2 == null) {
    return value2 === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag2 && symToStringTag2 in Object(value2) ? getRawTag_default(value2) : objectToString_default(value2);
}
var baseGetTag_default = baseGetTag;

// ../../node_modules/lodash-es/isObjectLike.js
function isObjectLike(value2) {
  return value2 != null && typeof value2 == "object";
}
var isObjectLike_default = isObjectLike;

// ../../node_modules/lodash-es/isArray.js
var isArray = Array.isArray;
var isArray_default = isArray;

// ../../node_modules/lodash-es/isObject.js
function isObject(value2) {
  var type = typeof value2;
  return value2 != null && (type == "object" || type == "function");
}
var isObject_default = isObject;

// ../../node_modules/lodash-es/identity.js
function identity2(value2) {
  return value2;
}
var identity_default = identity2;

// ../../node_modules/lodash-es/isFunction.js
var asyncTag = "[object AsyncFunction]";
var funcTag = "[object Function]";
var genTag = "[object GeneratorFunction]";
var proxyTag = "[object Proxy]";
function isFunction(value2) {
  if (!isObject_default(value2)) {
    return false;
  }
  var tag = baseGetTag_default(value2);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
var isFunction_default = isFunction;

// ../../node_modules/lodash-es/_coreJsData.js
var coreJsData = root_default["__core-js_shared__"];
var coreJsData_default = coreJsData;

// ../../node_modules/lodash-es/_isMasked.js
var maskSrcKey = function() {
  var uid = /[^.]+$/.exec(coreJsData_default && coreJsData_default.keys && coreJsData_default.keys.IE_PROTO || "");
  return uid ? "Symbol(src)_1." + uid : "";
}();
function isMasked(func) {
  return !!maskSrcKey && maskSrcKey in func;
}
var isMasked_default = isMasked;

// ../../node_modules/lodash-es/_toSource.js
var funcProto = Function.prototype;
var funcToString = funcProto.toString;
function toSource(func) {
  if (func != null) {
    try {
      return funcToString.call(func);
    } catch (e) {
    }
    try {
      return func + "";
    } catch (e) {
    }
  }
  return "";
}
var toSource_default = toSource;

// ../../node_modules/lodash-es/_baseIsNative.js
var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
var reIsHostCtor = /^\[object .+?Constructor\]$/;
var funcProto2 = Function.prototype;
var objectProto3 = Object.prototype;
var funcToString2 = funcProto2.toString;
var hasOwnProperty2 = objectProto3.hasOwnProperty;
var reIsNative = RegExp(
  "^" + funcToString2.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
);
function baseIsNative(value2) {
  if (!isObject_default(value2) || isMasked_default(value2)) {
    return false;
  }
  var pattern = isFunction_default(value2) ? reIsNative : reIsHostCtor;
  return pattern.test(toSource_default(value2));
}
var baseIsNative_default = baseIsNative;

// ../../node_modules/lodash-es/_getValue.js
function getValue(object, key) {
  return object == null ? void 0 : object[key];
}
var getValue_default = getValue;

// ../../node_modules/lodash-es/_getNative.js
function getNative(object, key) {
  var value2 = getValue_default(object, key);
  return baseIsNative_default(value2) ? value2 : void 0;
}
var getNative_default = getNative;

// ../../node_modules/lodash-es/_WeakMap.js
var WeakMap2 = getNative_default(root_default, "WeakMap");
var WeakMap_default = WeakMap2;

// ../../node_modules/lodash-es/_baseCreate.js
var objectCreate = Object.create;
var baseCreate = /* @__PURE__ */ function() {
  function object() {
  }
  return function(proto) {
    if (!isObject_default(proto)) {
      return {};
    }
    if (objectCreate) {
      return objectCreate(proto);
    }
    object.prototype = proto;
    var result = new object();
    object.prototype = void 0;
    return result;
  };
}();
var baseCreate_default = baseCreate;

// ../../node_modules/lodash-es/_apply.js
function apply(func, thisArg, args) {
  switch (args.length) {
    case 0:
      return func.call(thisArg);
    case 1:
      return func.call(thisArg, args[0]);
    case 2:
      return func.call(thisArg, args[0], args[1]);
    case 3:
      return func.call(thisArg, args[0], args[1], args[2]);
  }
  return func.apply(thisArg, args);
}
var apply_default = apply;

// ../../node_modules/lodash-es/_copyArray.js
function copyArray(source, array) {
  var index = -1, length2 = source.length;
  array || (array = Array(length2));
  while (++index < length2) {
    array[index] = source[index];
  }
  return array;
}
var copyArray_default = copyArray;

// ../../node_modules/lodash-es/_shortOut.js
var HOT_COUNT = 800;
var HOT_SPAN = 16;
var nativeNow = Date.now;
function shortOut(func) {
  var count = 0, lastCalled = 0;
  return function() {
    var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
    lastCalled = stamp;
    if (remaining > 0) {
      if (++count >= HOT_COUNT) {
        return arguments[0];
      }
    } else {
      count = 0;
    }
    return func.apply(void 0, arguments);
  };
}
var shortOut_default = shortOut;

// ../../node_modules/lodash-es/constant.js
function constant(value2) {
  return function() {
    return value2;
  };
}
var constant_default = constant;

// ../../node_modules/lodash-es/_defineProperty.js
var defineProperty = function() {
  try {
    var func = getNative_default(Object, "defineProperty");
    func({}, "", {});
    return func;
  } catch (e) {
  }
}();
var defineProperty_default = defineProperty;

// ../../node_modules/lodash-es/_baseSetToString.js
var baseSetToString = !defineProperty_default ? identity_default : function(func, string) {
  return defineProperty_default(func, "toString", {
    "configurable": true,
    "enumerable": false,
    "value": constant_default(string),
    "writable": true
  });
};
var baseSetToString_default = baseSetToString;

// ../../node_modules/lodash-es/_setToString.js
var setToString = shortOut_default(baseSetToString_default);
var setToString_default = setToString;

// ../../node_modules/lodash-es/_arrayEach.js
function arrayEach(array, iteratee) {
  var index = -1, length2 = array == null ? 0 : array.length;
  while (++index < length2) {
    if (iteratee(array[index], index, array) === false) {
      break;
    }
  }
  return array;
}
var arrayEach_default = arrayEach;

// ../../node_modules/lodash-es/_isIndex.js
var MAX_SAFE_INTEGER = 9007199254740991;
var reIsUint = /^(?:0|[1-9]\d*)$/;
function isIndex(value2, length2) {
  var type = typeof value2;
  length2 = length2 == null ? MAX_SAFE_INTEGER : length2;
  return !!length2 && (type == "number" || type != "symbol" && reIsUint.test(value2)) && (value2 > -1 && value2 % 1 == 0 && value2 < length2);
}
var isIndex_default = isIndex;

// ../../node_modules/lodash-es/_baseAssignValue.js
function baseAssignValue(object, key, value2) {
  if (key == "__proto__" && defineProperty_default) {
    defineProperty_default(object, key, {
      "configurable": true,
      "enumerable": true,
      "value": value2,
      "writable": true
    });
  } else {
    object[key] = value2;
  }
}
var baseAssignValue_default = baseAssignValue;

// ../../node_modules/lodash-es/eq.js
function eq(value2, other) {
  return value2 === other || value2 !== value2 && other !== other;
}
var eq_default = eq;

// ../../node_modules/lodash-es/_assignValue.js
var objectProto4 = Object.prototype;
var hasOwnProperty3 = objectProto4.hasOwnProperty;
function assignValue(object, key, value2) {
  var objValue = object[key];
  if (!(hasOwnProperty3.call(object, key) && eq_default(objValue, value2)) || value2 === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value2);
  }
}
var assignValue_default = assignValue;

// ../../node_modules/lodash-es/_copyObject.js
function copyObject(source, props, object, customizer) {
  var isNew = !object;
  object || (object = {});
  var index = -1, length2 = props.length;
  while (++index < length2) {
    var key = props[index];
    var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
    if (newValue === void 0) {
      newValue = source[key];
    }
    if (isNew) {
      baseAssignValue_default(object, key, newValue);
    } else {
      assignValue_default(object, key, newValue);
    }
  }
  return object;
}
var copyObject_default = copyObject;

// ../../node_modules/lodash-es/_overRest.js
var nativeMax = Math.max;
function overRest(func, start2, transform) {
  start2 = nativeMax(start2 === void 0 ? func.length - 1 : start2, 0);
  return function() {
    var args = arguments, index = -1, length2 = nativeMax(args.length - start2, 0), array = Array(length2);
    while (++index < length2) {
      array[index] = args[start2 + index];
    }
    index = -1;
    var otherArgs = Array(start2 + 1);
    while (++index < start2) {
      otherArgs[index] = args[index];
    }
    otherArgs[start2] = transform(array);
    return apply_default(func, this, otherArgs);
  };
}
var overRest_default = overRest;

// ../../node_modules/lodash-es/_baseRest.js
function baseRest(func, start2) {
  return setToString_default(overRest_default(func, start2, identity_default), func + "");
}
var baseRest_default = baseRest;

// ../../node_modules/lodash-es/isLength.js
var MAX_SAFE_INTEGER2 = 9007199254740991;
function isLength(value2) {
  return typeof value2 == "number" && value2 > -1 && value2 % 1 == 0 && value2 <= MAX_SAFE_INTEGER2;
}
var isLength_default = isLength;

// ../../node_modules/lodash-es/isArrayLike.js
function isArrayLike(value2) {
  return value2 != null && isLength_default(value2.length) && !isFunction_default(value2);
}
var isArrayLike_default = isArrayLike;

// ../../node_modules/lodash-es/_isIterateeCall.js
function isIterateeCall(value2, index, object) {
  if (!isObject_default(object)) {
    return false;
  }
  var type = typeof index;
  if (type == "number" ? isArrayLike_default(object) && isIndex_default(index, object.length) : type == "string" && index in object) {
    return eq_default(object[index], value2);
  }
  return false;
}
var isIterateeCall_default = isIterateeCall;

// ../../node_modules/lodash-es/_createAssigner.js
function createAssigner(assigner) {
  return baseRest_default(function(object, sources) {
    var index = -1, length2 = sources.length, customizer = length2 > 1 ? sources[length2 - 1] : void 0, guard = length2 > 2 ? sources[2] : void 0;
    customizer = assigner.length > 3 && typeof customizer == "function" ? (length2--, customizer) : void 0;
    if (guard && isIterateeCall_default(sources[0], sources[1], guard)) {
      customizer = length2 < 3 ? void 0 : customizer;
      length2 = 1;
    }
    object = Object(object);
    while (++index < length2) {
      var source = sources[index];
      if (source) {
        assigner(object, source, index, customizer);
      }
    }
    return object;
  });
}
var createAssigner_default = createAssigner;

// ../../node_modules/lodash-es/_isPrototype.js
var objectProto5 = Object.prototype;
function isPrototype(value2) {
  var Ctor = value2 && value2.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto5;
  return value2 === proto;
}
var isPrototype_default = isPrototype;

// ../../node_modules/lodash-es/_baseTimes.js
function baseTimes(n, iteratee) {
  var index = -1, result = Array(n);
  while (++index < n) {
    result[index] = iteratee(index);
  }
  return result;
}
var baseTimes_default = baseTimes;

// ../../node_modules/lodash-es/_baseIsArguments.js
var argsTag = "[object Arguments]";
function baseIsArguments(value2) {
  return isObjectLike_default(value2) && baseGetTag_default(value2) == argsTag;
}
var baseIsArguments_default = baseIsArguments;

// ../../node_modules/lodash-es/isArguments.js
var objectProto6 = Object.prototype;
var hasOwnProperty4 = objectProto6.hasOwnProperty;
var propertyIsEnumerable = objectProto6.propertyIsEnumerable;
var isArguments = baseIsArguments_default(/* @__PURE__ */ function() {
  return arguments;
}()) ? baseIsArguments_default : function(value2) {
  return isObjectLike_default(value2) && hasOwnProperty4.call(value2, "callee") && !propertyIsEnumerable.call(value2, "callee");
};
var isArguments_default = isArguments;

// ../../node_modules/lodash-es/stubFalse.js
function stubFalse() {
  return false;
}
var stubFalse_default = stubFalse;

// ../../node_modules/lodash-es/isBuffer.js
var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
var moduleExports = freeModule && freeModule.exports === freeExports;
var Buffer2 = moduleExports ? root_default.Buffer : void 0;
var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
var isBuffer = nativeIsBuffer || stubFalse_default;
var isBuffer_default = isBuffer;

// ../../node_modules/lodash-es/_baseIsTypedArray.js
var argsTag2 = "[object Arguments]";
var arrayTag = "[object Array]";
var boolTag = "[object Boolean]";
var dateTag = "[object Date]";
var errorTag = "[object Error]";
var funcTag2 = "[object Function]";
var mapTag = "[object Map]";
var numberTag = "[object Number]";
var objectTag = "[object Object]";
var regexpTag = "[object RegExp]";
var setTag = "[object Set]";
var stringTag = "[object String]";
var weakMapTag = "[object WeakMap]";
var arrayBufferTag = "[object ArrayBuffer]";
var dataViewTag = "[object DataView]";
var float32Tag = "[object Float32Array]";
var float64Tag = "[object Float64Array]";
var int8Tag = "[object Int8Array]";
var int16Tag = "[object Int16Array]";
var int32Tag = "[object Int32Array]";
var uint8Tag = "[object Uint8Array]";
var uint8ClampedTag = "[object Uint8ClampedArray]";
var uint16Tag = "[object Uint16Array]";
var uint32Tag = "[object Uint32Array]";
var typedArrayTags = {};
typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
typedArrayTags[argsTag2] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag2] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
function baseIsTypedArray(value2) {
  return isObjectLike_default(value2) && isLength_default(value2.length) && !!typedArrayTags[baseGetTag_default(value2)];
}
var baseIsTypedArray_default = baseIsTypedArray;

// ../../node_modules/lodash-es/_baseUnary.js
function baseUnary(func) {
  return function(value2) {
    return func(value2);
  };
}
var baseUnary_default = baseUnary;

// ../../node_modules/lodash-es/_nodeUtil.js
var freeExports2 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule2 = freeExports2 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports2 = freeModule2 && freeModule2.exports === freeExports2;
var freeProcess = moduleExports2 && freeGlobal_default.process;
var nodeUtil = function() {
  try {
    var types = freeModule2 && freeModule2.require && freeModule2.require("util").types;
    if (types) {
      return types;
    }
    return freeProcess && freeProcess.binding && freeProcess.binding("util");
  } catch (e) {
  }
}();
var nodeUtil_default = nodeUtil;

// ../../node_modules/lodash-es/isTypedArray.js
var nodeIsTypedArray = nodeUtil_default && nodeUtil_default.isTypedArray;
var isTypedArray = nodeIsTypedArray ? baseUnary_default(nodeIsTypedArray) : baseIsTypedArray_default;
var isTypedArray_default = isTypedArray;

// ../../node_modules/lodash-es/_arrayLikeKeys.js
var objectProto7 = Object.prototype;
var hasOwnProperty5 = objectProto7.hasOwnProperty;
function arrayLikeKeys(value2, inherited) {
  var isArr = isArray_default(value2), isArg = !isArr && isArguments_default(value2), isBuff = !isArr && !isArg && isBuffer_default(value2), isType = !isArr && !isArg && !isBuff && isTypedArray_default(value2), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes_default(value2.length, String) : [], length2 = result.length;
  for (var key in value2) {
    if ((inherited || hasOwnProperty5.call(value2, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
    (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
    isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
    isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
    isIndex_default(key, length2)))) {
      result.push(key);
    }
  }
  return result;
}
var arrayLikeKeys_default = arrayLikeKeys;

// ../../node_modules/lodash-es/_overArg.js
function overArg(func, transform) {
  return function(arg) {
    return func(transform(arg));
  };
}
var overArg_default = overArg;

// ../../node_modules/lodash-es/_nativeKeys.js
var nativeKeys = overArg_default(Object.keys, Object);
var nativeKeys_default = nativeKeys;

// ../../node_modules/lodash-es/_baseKeys.js
var objectProto8 = Object.prototype;
var hasOwnProperty6 = objectProto8.hasOwnProperty;
function baseKeys(object) {
  if (!isPrototype_default(object)) {
    return nativeKeys_default(object);
  }
  var result = [];
  for (var key in Object(object)) {
    if (hasOwnProperty6.call(object, key) && key != "constructor") {
      result.push(key);
    }
  }
  return result;
}
var baseKeys_default = baseKeys;

// ../../node_modules/lodash-es/keys.js
function keys(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object) : baseKeys_default(object);
}
var keys_default = keys;

// ../../node_modules/lodash-es/_nativeKeysIn.js
function nativeKeysIn(object) {
  var result = [];
  if (object != null) {
    for (var key in Object(object)) {
      result.push(key);
    }
  }
  return result;
}
var nativeKeysIn_default = nativeKeysIn;

// ../../node_modules/lodash-es/_baseKeysIn.js
var objectProto9 = Object.prototype;
var hasOwnProperty7 = objectProto9.hasOwnProperty;
function baseKeysIn(object) {
  if (!isObject_default(object)) {
    return nativeKeysIn_default(object);
  }
  var isProto = isPrototype_default(object), result = [];
  for (var key in object) {
    if (!(key == "constructor" && (isProto || !hasOwnProperty7.call(object, key)))) {
      result.push(key);
    }
  }
  return result;
}
var baseKeysIn_default = baseKeysIn;

// ../../node_modules/lodash-es/keysIn.js
function keysIn(object) {
  return isArrayLike_default(object) ? arrayLikeKeys_default(object, true) : baseKeysIn_default(object);
}
var keysIn_default = keysIn;

// ../../node_modules/lodash-es/_nativeCreate.js
var nativeCreate = getNative_default(Object, "create");
var nativeCreate_default = nativeCreate;

// ../../node_modules/lodash-es/_hashClear.js
function hashClear() {
  this.__data__ = nativeCreate_default ? nativeCreate_default(null) : {};
  this.size = 0;
}
var hashClear_default = hashClear;

// ../../node_modules/lodash-es/_hashDelete.js
function hashDelete(key) {
  var result = this.has(key) && delete this.__data__[key];
  this.size -= result ? 1 : 0;
  return result;
}
var hashDelete_default = hashDelete;

// ../../node_modules/lodash-es/_hashGet.js
var HASH_UNDEFINED = "__lodash_hash_undefined__";
var objectProto10 = Object.prototype;
var hasOwnProperty8 = objectProto10.hasOwnProperty;
function hashGet(key) {
  var data = this.__data__;
  if (nativeCreate_default) {
    var result = data[key];
    return result === HASH_UNDEFINED ? void 0 : result;
  }
  return hasOwnProperty8.call(data, key) ? data[key] : void 0;
}
var hashGet_default = hashGet;

// ../../node_modules/lodash-es/_hashHas.js
var objectProto11 = Object.prototype;
var hasOwnProperty9 = objectProto11.hasOwnProperty;
function hashHas(key) {
  var data = this.__data__;
  return nativeCreate_default ? data[key] !== void 0 : hasOwnProperty9.call(data, key);
}
var hashHas_default = hashHas;

// ../../node_modules/lodash-es/_hashSet.js
var HASH_UNDEFINED2 = "__lodash_hash_undefined__";
function hashSet(key, value2) {
  var data = this.__data__;
  this.size += this.has(key) ? 0 : 1;
  data[key] = nativeCreate_default && value2 === void 0 ? HASH_UNDEFINED2 : value2;
  return this;
}
var hashSet_default = hashSet;

// ../../node_modules/lodash-es/_Hash.js
function Hash(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
Hash.prototype.clear = hashClear_default;
Hash.prototype["delete"] = hashDelete_default;
Hash.prototype.get = hashGet_default;
Hash.prototype.has = hashHas_default;
Hash.prototype.set = hashSet_default;
var Hash_default = Hash;

// ../../node_modules/lodash-es/_listCacheClear.js
function listCacheClear() {
  this.__data__ = [];
  this.size = 0;
}
var listCacheClear_default = listCacheClear;

// ../../node_modules/lodash-es/_assocIndexOf.js
function assocIndexOf(array, key) {
  var length2 = array.length;
  while (length2--) {
    if (eq_default(array[length2][0], key)) {
      return length2;
    }
  }
  return -1;
}
var assocIndexOf_default = assocIndexOf;

// ../../node_modules/lodash-es/_listCacheDelete.js
var arrayProto = Array.prototype;
var splice = arrayProto.splice;
function listCacheDelete(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    return false;
  }
  var lastIndex = data.length - 1;
  if (index == lastIndex) {
    data.pop();
  } else {
    splice.call(data, index, 1);
  }
  --this.size;
  return true;
}
var listCacheDelete_default = listCacheDelete;

// ../../node_modules/lodash-es/_listCacheGet.js
function listCacheGet(key) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  return index < 0 ? void 0 : data[index][1];
}
var listCacheGet_default = listCacheGet;

// ../../node_modules/lodash-es/_listCacheHas.js
function listCacheHas(key) {
  return assocIndexOf_default(this.__data__, key) > -1;
}
var listCacheHas_default = listCacheHas;

// ../../node_modules/lodash-es/_listCacheSet.js
function listCacheSet(key, value2) {
  var data = this.__data__, index = assocIndexOf_default(data, key);
  if (index < 0) {
    ++this.size;
    data.push([key, value2]);
  } else {
    data[index][1] = value2;
  }
  return this;
}
var listCacheSet_default = listCacheSet;

// ../../node_modules/lodash-es/_ListCache.js
function ListCache(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
ListCache.prototype.clear = listCacheClear_default;
ListCache.prototype["delete"] = listCacheDelete_default;
ListCache.prototype.get = listCacheGet_default;
ListCache.prototype.has = listCacheHas_default;
ListCache.prototype.set = listCacheSet_default;
var ListCache_default = ListCache;

// ../../node_modules/lodash-es/_Map.js
var Map2 = getNative_default(root_default, "Map");
var Map_default = Map2;

// ../../node_modules/lodash-es/_mapCacheClear.js
function mapCacheClear() {
  this.size = 0;
  this.__data__ = {
    "hash": new Hash_default(),
    "map": new (Map_default || ListCache_default)(),
    "string": new Hash_default()
  };
}
var mapCacheClear_default = mapCacheClear;

// ../../node_modules/lodash-es/_isKeyable.js
function isKeyable(value2) {
  var type = typeof value2;
  return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value2 !== "__proto__" : value2 === null;
}
var isKeyable_default = isKeyable;

// ../../node_modules/lodash-es/_getMapData.js
function getMapData(map3, key) {
  var data = map3.__data__;
  return isKeyable_default(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
}
var getMapData_default = getMapData;

// ../../node_modules/lodash-es/_mapCacheDelete.js
function mapCacheDelete(key) {
  var result = getMapData_default(this, key)["delete"](key);
  this.size -= result ? 1 : 0;
  return result;
}
var mapCacheDelete_default = mapCacheDelete;

// ../../node_modules/lodash-es/_mapCacheGet.js
function mapCacheGet(key) {
  return getMapData_default(this, key).get(key);
}
var mapCacheGet_default = mapCacheGet;

// ../../node_modules/lodash-es/_mapCacheHas.js
function mapCacheHas(key) {
  return getMapData_default(this, key).has(key);
}
var mapCacheHas_default = mapCacheHas;

// ../../node_modules/lodash-es/_mapCacheSet.js
function mapCacheSet(key, value2) {
  var data = getMapData_default(this, key), size = data.size;
  data.set(key, value2);
  this.size += data.size == size ? 0 : 1;
  return this;
}
var mapCacheSet_default = mapCacheSet;

// ../../node_modules/lodash-es/_MapCache.js
function MapCache(entries) {
  var index = -1, length2 = entries == null ? 0 : entries.length;
  this.clear();
  while (++index < length2) {
    var entry = entries[index];
    this.set(entry[0], entry[1]);
  }
}
MapCache.prototype.clear = mapCacheClear_default;
MapCache.prototype["delete"] = mapCacheDelete_default;
MapCache.prototype.get = mapCacheGet_default;
MapCache.prototype.has = mapCacheHas_default;
MapCache.prototype.set = mapCacheSet_default;
var MapCache_default = MapCache;

// ../../node_modules/lodash-es/_arrayPush.js
function arrayPush(array, values) {
  var index = -1, length2 = values.length, offset = array.length;
  while (++index < length2) {
    array[offset + index] = values[index];
  }
  return array;
}
var arrayPush_default = arrayPush;

// ../../node_modules/lodash-es/_getPrototype.js
var getPrototype = overArg_default(Object.getPrototypeOf, Object);
var getPrototype_default = getPrototype;

// ../../node_modules/lodash-es/isPlainObject.js
var objectTag2 = "[object Object]";
var funcProto3 = Function.prototype;
var objectProto12 = Object.prototype;
var funcToString3 = funcProto3.toString;
var hasOwnProperty10 = objectProto12.hasOwnProperty;
var objectCtorString = funcToString3.call(Object);
function isPlainObject(value2) {
  if (!isObjectLike_default(value2) || baseGetTag_default(value2) != objectTag2) {
    return false;
  }
  var proto = getPrototype_default(value2);
  if (proto === null) {
    return true;
  }
  var Ctor = hasOwnProperty10.call(proto, "constructor") && proto.constructor;
  return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString3.call(Ctor) == objectCtorString;
}
var isPlainObject_default = isPlainObject;

// ../../node_modules/lodash-es/_stackClear.js
function stackClear() {
  this.__data__ = new ListCache_default();
  this.size = 0;
}
var stackClear_default = stackClear;

// ../../node_modules/lodash-es/_stackDelete.js
function stackDelete(key) {
  var data = this.__data__, result = data["delete"](key);
  this.size = data.size;
  return result;
}
var stackDelete_default = stackDelete;

// ../../node_modules/lodash-es/_stackGet.js
function stackGet(key) {
  return this.__data__.get(key);
}
var stackGet_default = stackGet;

// ../../node_modules/lodash-es/_stackHas.js
function stackHas(key) {
  return this.__data__.has(key);
}
var stackHas_default = stackHas;

// ../../node_modules/lodash-es/_stackSet.js
var LARGE_ARRAY_SIZE = 200;
function stackSet(key, value2) {
  var data = this.__data__;
  if (data instanceof ListCache_default) {
    var pairs = data.__data__;
    if (!Map_default || pairs.length < LARGE_ARRAY_SIZE - 1) {
      pairs.push([key, value2]);
      this.size = ++data.size;
      return this;
    }
    data = this.__data__ = new MapCache_default(pairs);
  }
  data.set(key, value2);
  this.size = data.size;
  return this;
}
var stackSet_default = stackSet;

// ../../node_modules/lodash-es/_Stack.js
function Stack(entries) {
  var data = this.__data__ = new ListCache_default(entries);
  this.size = data.size;
}
Stack.prototype.clear = stackClear_default;
Stack.prototype["delete"] = stackDelete_default;
Stack.prototype.get = stackGet_default;
Stack.prototype.has = stackHas_default;
Stack.prototype.set = stackSet_default;
var Stack_default = Stack;

// ../../node_modules/lodash-es/_baseAssign.js
function baseAssign(object, source) {
  return object && copyObject_default(source, keys_default(source), object);
}
var baseAssign_default = baseAssign;

// ../../node_modules/lodash-es/_baseAssignIn.js
function baseAssignIn(object, source) {
  return object && copyObject_default(source, keysIn_default(source), object);
}
var baseAssignIn_default = baseAssignIn;

// ../../node_modules/lodash-es/_cloneBuffer.js
var freeExports3 = typeof exports == "object" && exports && !exports.nodeType && exports;
var freeModule3 = freeExports3 && typeof module == "object" && module && !module.nodeType && module;
var moduleExports3 = freeModule3 && freeModule3.exports === freeExports3;
var Buffer3 = moduleExports3 ? root_default.Buffer : void 0;
var allocUnsafe = Buffer3 ? Buffer3.allocUnsafe : void 0;
function cloneBuffer(buffer, isDeep) {
  if (isDeep) {
    return buffer.slice();
  }
  var length2 = buffer.length, result = allocUnsafe ? allocUnsafe(length2) : new buffer.constructor(length2);
  buffer.copy(result);
  return result;
}
var cloneBuffer_default = cloneBuffer;

// ../../node_modules/lodash-es/_arrayFilter.js
function arrayFilter(array, predicate) {
  var index = -1, length2 = array == null ? 0 : array.length, resIndex = 0, result = [];
  while (++index < length2) {
    var value2 = array[index];
    if (predicate(value2, index, array)) {
      result[resIndex++] = value2;
    }
  }
  return result;
}
var arrayFilter_default = arrayFilter;

// ../../node_modules/lodash-es/stubArray.js
function stubArray() {
  return [];
}
var stubArray_default = stubArray;

// ../../node_modules/lodash-es/_getSymbols.js
var objectProto13 = Object.prototype;
var propertyIsEnumerable2 = objectProto13.propertyIsEnumerable;
var nativeGetSymbols = Object.getOwnPropertySymbols;
var getSymbols = !nativeGetSymbols ? stubArray_default : function(object) {
  if (object == null) {
    return [];
  }
  object = Object(object);
  return arrayFilter_default(nativeGetSymbols(object), function(symbol) {
    return propertyIsEnumerable2.call(object, symbol);
  });
};
var getSymbols_default = getSymbols;

// ../../node_modules/lodash-es/_copySymbols.js
function copySymbols(source, object) {
  return copyObject_default(source, getSymbols_default(source), object);
}
var copySymbols_default = copySymbols;

// ../../node_modules/lodash-es/_getSymbolsIn.js
var nativeGetSymbols2 = Object.getOwnPropertySymbols;
var getSymbolsIn = !nativeGetSymbols2 ? stubArray_default : function(object) {
  var result = [];
  while (object) {
    arrayPush_default(result, getSymbols_default(object));
    object = getPrototype_default(object);
  }
  return result;
};
var getSymbolsIn_default = getSymbolsIn;

// ../../node_modules/lodash-es/_copySymbolsIn.js
function copySymbolsIn(source, object) {
  return copyObject_default(source, getSymbolsIn_default(source), object);
}
var copySymbolsIn_default = copySymbolsIn;

// ../../node_modules/lodash-es/_baseGetAllKeys.js
function baseGetAllKeys(object, keysFunc, symbolsFunc) {
  var result = keysFunc(object);
  return isArray_default(object) ? result : arrayPush_default(result, symbolsFunc(object));
}
var baseGetAllKeys_default = baseGetAllKeys;

// ../../node_modules/lodash-es/_getAllKeys.js
function getAllKeys(object) {
  return baseGetAllKeys_default(object, keys_default, getSymbols_default);
}
var getAllKeys_default = getAllKeys;

// ../../node_modules/lodash-es/_getAllKeysIn.js
function getAllKeysIn(object) {
  return baseGetAllKeys_default(object, keysIn_default, getSymbolsIn_default);
}
var getAllKeysIn_default = getAllKeysIn;

// ../../node_modules/lodash-es/_DataView.js
var DataView2 = getNative_default(root_default, "DataView");
var DataView_default = DataView2;

// ../../node_modules/lodash-es/_Promise.js
var Promise2 = getNative_default(root_default, "Promise");
var Promise_default = Promise2;

// ../../node_modules/lodash-es/_Set.js
var Set2 = getNative_default(root_default, "Set");
var Set_default = Set2;

// ../../node_modules/lodash-es/_getTag.js
var mapTag2 = "[object Map]";
var objectTag3 = "[object Object]";
var promiseTag = "[object Promise]";
var setTag2 = "[object Set]";
var weakMapTag2 = "[object WeakMap]";
var dataViewTag2 = "[object DataView]";
var dataViewCtorString = toSource_default(DataView_default);
var mapCtorString = toSource_default(Map_default);
var promiseCtorString = toSource_default(Promise_default);
var setCtorString = toSource_default(Set_default);
var weakMapCtorString = toSource_default(WeakMap_default);
var getTag = baseGetTag_default;
if (DataView_default && getTag(new DataView_default(new ArrayBuffer(1))) != dataViewTag2 || Map_default && getTag(new Map_default()) != mapTag2 || Promise_default && getTag(Promise_default.resolve()) != promiseTag || Set_default && getTag(new Set_default()) != setTag2 || WeakMap_default && getTag(new WeakMap_default()) != weakMapTag2) {
  getTag = function(value2) {
    var result = baseGetTag_default(value2), Ctor = result == objectTag3 ? value2.constructor : void 0, ctorString = Ctor ? toSource_default(Ctor) : "";
    if (ctorString) {
      switch (ctorString) {
        case dataViewCtorString:
          return dataViewTag2;
        case mapCtorString:
          return mapTag2;
        case promiseCtorString:
          return promiseTag;
        case setCtorString:
          return setTag2;
        case weakMapCtorString:
          return weakMapTag2;
      }
    }
    return result;
  };
}
var getTag_default = getTag;

// ../../node_modules/lodash-es/_initCloneArray.js
var objectProto14 = Object.prototype;
var hasOwnProperty11 = objectProto14.hasOwnProperty;
function initCloneArray(array) {
  var length2 = array.length, result = new array.constructor(length2);
  if (length2 && typeof array[0] == "string" && hasOwnProperty11.call(array, "index")) {
    result.index = array.index;
    result.input = array.input;
  }
  return result;
}
var initCloneArray_default = initCloneArray;

// ../../node_modules/lodash-es/_Uint8Array.js
var Uint8Array2 = root_default.Uint8Array;
var Uint8Array_default = Uint8Array2;

// ../../node_modules/lodash-es/_cloneArrayBuffer.js
function cloneArrayBuffer(arrayBuffer) {
  var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
  new Uint8Array_default(result).set(new Uint8Array_default(arrayBuffer));
  return result;
}
var cloneArrayBuffer_default = cloneArrayBuffer;

// ../../node_modules/lodash-es/_cloneDataView.js
function cloneDataView(dataView, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(dataView.buffer) : dataView.buffer;
  return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
}
var cloneDataView_default = cloneDataView;

// ../../node_modules/lodash-es/_cloneRegExp.js
var reFlags = /\w*$/;
function cloneRegExp(regexp) {
  var result = new regexp.constructor(regexp.source, reFlags.exec(regexp));
  result.lastIndex = regexp.lastIndex;
  return result;
}
var cloneRegExp_default = cloneRegExp;

// ../../node_modules/lodash-es/_cloneSymbol.js
var symbolProto = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
function cloneSymbol(symbol) {
  return symbolValueOf ? Object(symbolValueOf.call(symbol)) : {};
}
var cloneSymbol_default = cloneSymbol;

// ../../node_modules/lodash-es/_cloneTypedArray.js
function cloneTypedArray(typedArray, isDeep) {
  var buffer = isDeep ? cloneArrayBuffer_default(typedArray.buffer) : typedArray.buffer;
  return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
}
var cloneTypedArray_default = cloneTypedArray;

// ../../node_modules/lodash-es/_initCloneByTag.js
var boolTag2 = "[object Boolean]";
var dateTag2 = "[object Date]";
var mapTag3 = "[object Map]";
var numberTag2 = "[object Number]";
var regexpTag2 = "[object RegExp]";
var setTag3 = "[object Set]";
var stringTag2 = "[object String]";
var symbolTag = "[object Symbol]";
var arrayBufferTag2 = "[object ArrayBuffer]";
var dataViewTag3 = "[object DataView]";
var float32Tag2 = "[object Float32Array]";
var float64Tag2 = "[object Float64Array]";
var int8Tag2 = "[object Int8Array]";
var int16Tag2 = "[object Int16Array]";
var int32Tag2 = "[object Int32Array]";
var uint8Tag2 = "[object Uint8Array]";
var uint8ClampedTag2 = "[object Uint8ClampedArray]";
var uint16Tag2 = "[object Uint16Array]";
var uint32Tag2 = "[object Uint32Array]";
function initCloneByTag(object, tag, isDeep) {
  var Ctor = object.constructor;
  switch (tag) {
    case arrayBufferTag2:
      return cloneArrayBuffer_default(object);
    case boolTag2:
    case dateTag2:
      return new Ctor(+object);
    case dataViewTag3:
      return cloneDataView_default(object, isDeep);
    case float32Tag2:
    case float64Tag2:
    case int8Tag2:
    case int16Tag2:
    case int32Tag2:
    case uint8Tag2:
    case uint8ClampedTag2:
    case uint16Tag2:
    case uint32Tag2:
      return cloneTypedArray_default(object, isDeep);
    case mapTag3:
      return new Ctor();
    case numberTag2:
    case stringTag2:
      return new Ctor(object);
    case regexpTag2:
      return cloneRegExp_default(object);
    case setTag3:
      return new Ctor();
    case symbolTag:
      return cloneSymbol_default(object);
  }
}
var initCloneByTag_default = initCloneByTag;

// ../../node_modules/lodash-es/_initCloneObject.js
function initCloneObject(object) {
  return typeof object.constructor == "function" && !isPrototype_default(object) ? baseCreate_default(getPrototype_default(object)) : {};
}
var initCloneObject_default = initCloneObject;

// ../../node_modules/lodash-es/_baseIsMap.js
var mapTag4 = "[object Map]";
function baseIsMap(value2) {
  return isObjectLike_default(value2) && getTag_default(value2) == mapTag4;
}
var baseIsMap_default = baseIsMap;

// ../../node_modules/lodash-es/isMap.js
var nodeIsMap = nodeUtil_default && nodeUtil_default.isMap;
var isMap = nodeIsMap ? baseUnary_default(nodeIsMap) : baseIsMap_default;
var isMap_default = isMap;

// ../../node_modules/lodash-es/_baseIsSet.js
var setTag4 = "[object Set]";
function baseIsSet(value2) {
  return isObjectLike_default(value2) && getTag_default(value2) == setTag4;
}
var baseIsSet_default = baseIsSet;

// ../../node_modules/lodash-es/isSet.js
var nodeIsSet = nodeUtil_default && nodeUtil_default.isSet;
var isSet = nodeIsSet ? baseUnary_default(nodeIsSet) : baseIsSet_default;
var isSet_default = isSet;

// ../../node_modules/lodash-es/_baseClone.js
var CLONE_DEEP_FLAG = 1;
var CLONE_FLAT_FLAG = 2;
var CLONE_SYMBOLS_FLAG = 4;
var argsTag3 = "[object Arguments]";
var arrayTag2 = "[object Array]";
var boolTag3 = "[object Boolean]";
var dateTag3 = "[object Date]";
var errorTag2 = "[object Error]";
var funcTag3 = "[object Function]";
var genTag2 = "[object GeneratorFunction]";
var mapTag5 = "[object Map]";
var numberTag3 = "[object Number]";
var objectTag4 = "[object Object]";
var regexpTag3 = "[object RegExp]";
var setTag5 = "[object Set]";
var stringTag3 = "[object String]";
var symbolTag2 = "[object Symbol]";
var weakMapTag3 = "[object WeakMap]";
var arrayBufferTag3 = "[object ArrayBuffer]";
var dataViewTag4 = "[object DataView]";
var float32Tag3 = "[object Float32Array]";
var float64Tag3 = "[object Float64Array]";
var int8Tag3 = "[object Int8Array]";
var int16Tag3 = "[object Int16Array]";
var int32Tag3 = "[object Int32Array]";
var uint8Tag3 = "[object Uint8Array]";
var uint8ClampedTag3 = "[object Uint8ClampedArray]";
var uint16Tag3 = "[object Uint16Array]";
var uint32Tag3 = "[object Uint32Array]";
var cloneableTags = {};
cloneableTags[argsTag3] = cloneableTags[arrayTag2] = cloneableTags[arrayBufferTag3] = cloneableTags[dataViewTag4] = cloneableTags[boolTag3] = cloneableTags[dateTag3] = cloneableTags[float32Tag3] = cloneableTags[float64Tag3] = cloneableTags[int8Tag3] = cloneableTags[int16Tag3] = cloneableTags[int32Tag3] = cloneableTags[mapTag5] = cloneableTags[numberTag3] = cloneableTags[objectTag4] = cloneableTags[regexpTag3] = cloneableTags[setTag5] = cloneableTags[stringTag3] = cloneableTags[symbolTag2] = cloneableTags[uint8Tag3] = cloneableTags[uint8ClampedTag3] = cloneableTags[uint16Tag3] = cloneableTags[uint32Tag3] = true;
cloneableTags[errorTag2] = cloneableTags[funcTag3] = cloneableTags[weakMapTag3] = false;
function baseClone(value2, bitmask, customizer, key, object, stack) {
  var result, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
  if (customizer) {
    result = object ? customizer(value2, key, object, stack) : customizer(value2);
  }
  if (result !== void 0) {
    return result;
  }
  if (!isObject_default(value2)) {
    return value2;
  }
  var isArr = isArray_default(value2);
  if (isArr) {
    result = initCloneArray_default(value2);
    if (!isDeep) {
      return copyArray_default(value2, result);
    }
  } else {
    var tag = getTag_default(value2), isFunc = tag == funcTag3 || tag == genTag2;
    if (isBuffer_default(value2)) {
      return cloneBuffer_default(value2, isDeep);
    }
    if (tag == objectTag4 || tag == argsTag3 || isFunc && !object) {
      result = isFlat || isFunc ? {} : initCloneObject_default(value2);
      if (!isDeep) {
        return isFlat ? copySymbolsIn_default(value2, baseAssignIn_default(result, value2)) : copySymbols_default(value2, baseAssign_default(result, value2));
      }
    } else {
      if (!cloneableTags[tag]) {
        return object ? value2 : {};
      }
      result = initCloneByTag_default(value2, tag, isDeep);
    }
  }
  stack || (stack = new Stack_default());
  var stacked = stack.get(value2);
  if (stacked) {
    return stacked;
  }
  stack.set(value2, result);
  if (isSet_default(value2)) {
    value2.forEach(function(subValue) {
      result.add(baseClone(subValue, bitmask, customizer, subValue, value2, stack));
    });
  } else if (isMap_default(value2)) {
    value2.forEach(function(subValue, key2) {
      result.set(key2, baseClone(subValue, bitmask, customizer, key2, value2, stack));
    });
  }
  var keysFunc = isFull ? isFlat ? getAllKeysIn_default : getAllKeys_default : isFlat ? keysIn_default : keys_default;
  var props = isArr ? void 0 : keysFunc(value2);
  arrayEach_default(props || value2, function(subValue, key2) {
    if (props) {
      key2 = subValue;
      subValue = value2[key2];
    }
    assignValue_default(result, key2, baseClone(subValue, bitmask, customizer, key2, value2, stack));
  });
  return result;
}
var baseClone_default = baseClone;

// ../../node_modules/lodash-es/cloneDeep.js
var CLONE_DEEP_FLAG2 = 1;
var CLONE_SYMBOLS_FLAG2 = 4;
function cloneDeep(value2) {
  return baseClone_default(value2, CLONE_DEEP_FLAG2 | CLONE_SYMBOLS_FLAG2);
}
var cloneDeep_default = cloneDeep;

// ../../node_modules/lodash-es/_setCacheAdd.js
var HASH_UNDEFINED3 = "__lodash_hash_undefined__";
function setCacheAdd(value2) {
  this.__data__.set(value2, HASH_UNDEFINED3);
  return this;
}
var setCacheAdd_default = setCacheAdd;

// ../../node_modules/lodash-es/_setCacheHas.js
function setCacheHas(value2) {
  return this.__data__.has(value2);
}
var setCacheHas_default = setCacheHas;

// ../../node_modules/lodash-es/_SetCache.js
function SetCache(values) {
  var index = -1, length2 = values == null ? 0 : values.length;
  this.__data__ = new MapCache_default();
  while (++index < length2) {
    this.add(values[index]);
  }
}
SetCache.prototype.add = SetCache.prototype.push = setCacheAdd_default;
SetCache.prototype.has = setCacheHas_default;
var SetCache_default = SetCache;

// ../../node_modules/lodash-es/_arraySome.js
function arraySome(array, predicate) {
  var index = -1, length2 = array == null ? 0 : array.length;
  while (++index < length2) {
    if (predicate(array[index], index, array)) {
      return true;
    }
  }
  return false;
}
var arraySome_default = arraySome;

// ../../node_modules/lodash-es/_cacheHas.js
function cacheHas(cache, key) {
  return cache.has(key);
}
var cacheHas_default = cacheHas;

// ../../node_modules/lodash-es/_equalArrays.js
var COMPARE_PARTIAL_FLAG = 1;
var COMPARE_UNORDERED_FLAG = 2;
function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
  if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
    return false;
  }
  var arrStacked = stack.get(array);
  var othStacked = stack.get(other);
  if (arrStacked && othStacked) {
    return arrStacked == other && othStacked == array;
  }
  var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache_default() : void 0;
  stack.set(array, other);
  stack.set(other, array);
  while (++index < arrLength) {
    var arrValue = array[index], othValue = other[index];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
    }
    if (compared !== void 0) {
      if (compared) {
        continue;
      }
      result = false;
      break;
    }
    if (seen) {
      if (!arraySome_default(other, function(othValue2, othIndex) {
        if (!cacheHas_default(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
          return seen.push(othIndex);
        }
      })) {
        result = false;
        break;
      }
    } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
      result = false;
      break;
    }
  }
  stack["delete"](array);
  stack["delete"](other);
  return result;
}
var equalArrays_default = equalArrays;

// ../../node_modules/lodash-es/_mapToArray.js
function mapToArray(map3) {
  var index = -1, result = Array(map3.size);
  map3.forEach(function(value2, key) {
    result[++index] = [key, value2];
  });
  return result;
}
var mapToArray_default = mapToArray;

// ../../node_modules/lodash-es/_setToArray.js
function setToArray(set) {
  var index = -1, result = Array(set.size);
  set.forEach(function(value2) {
    result[++index] = value2;
  });
  return result;
}
var setToArray_default = setToArray;

// ../../node_modules/lodash-es/_equalByTag.js
var COMPARE_PARTIAL_FLAG2 = 1;
var COMPARE_UNORDERED_FLAG2 = 2;
var boolTag4 = "[object Boolean]";
var dateTag4 = "[object Date]";
var errorTag3 = "[object Error]";
var mapTag6 = "[object Map]";
var numberTag4 = "[object Number]";
var regexpTag4 = "[object RegExp]";
var setTag6 = "[object Set]";
var stringTag4 = "[object String]";
var symbolTag3 = "[object Symbol]";
var arrayBufferTag4 = "[object ArrayBuffer]";
var dataViewTag5 = "[object DataView]";
var symbolProto2 = Symbol_default ? Symbol_default.prototype : void 0;
var symbolValueOf2 = symbolProto2 ? symbolProto2.valueOf : void 0;
function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
  switch (tag) {
    case dataViewTag5:
      if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
        return false;
      }
      object = object.buffer;
      other = other.buffer;
    case arrayBufferTag4:
      if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array_default(object), new Uint8Array_default(other))) {
        return false;
      }
      return true;
    case boolTag4:
    case dateTag4:
    case numberTag4:
      return eq_default(+object, +other);
    case errorTag3:
      return object.name == other.name && object.message == other.message;
    case regexpTag4:
    case stringTag4:
      return object == other + "";
    case mapTag6:
      var convert = mapToArray_default;
    case setTag6:
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG2;
      convert || (convert = setToArray_default);
      if (object.size != other.size && !isPartial) {
        return false;
      }
      var stacked = stack.get(object);
      if (stacked) {
        return stacked == other;
      }
      bitmask |= COMPARE_UNORDERED_FLAG2;
      stack.set(object, other);
      var result = equalArrays_default(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
      stack["delete"](object);
      return result;
    case symbolTag3:
      if (symbolValueOf2) {
        return symbolValueOf2.call(object) == symbolValueOf2.call(other);
      }
  }
  return false;
}
var equalByTag_default = equalByTag;

// ../../node_modules/lodash-es/_equalObjects.js
var COMPARE_PARTIAL_FLAG3 = 1;
var objectProto15 = Object.prototype;
var hasOwnProperty12 = objectProto15.hasOwnProperty;
function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
  var isPartial = bitmask & COMPARE_PARTIAL_FLAG3, objProps = getAllKeys_default(object), objLength = objProps.length, othProps = getAllKeys_default(other), othLength = othProps.length;
  if (objLength != othLength && !isPartial) {
    return false;
  }
  var index = objLength;
  while (index--) {
    var key = objProps[index];
    if (!(isPartial ? key in other : hasOwnProperty12.call(other, key))) {
      return false;
    }
  }
  var objStacked = stack.get(object);
  var othStacked = stack.get(other);
  if (objStacked && othStacked) {
    return objStacked == other && othStacked == object;
  }
  var result = true;
  stack.set(object, other);
  stack.set(other, object);
  var skipCtor = isPartial;
  while (++index < objLength) {
    key = objProps[index];
    var objValue = object[key], othValue = other[key];
    if (customizer) {
      var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
    }
    if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
      result = false;
      break;
    }
    skipCtor || (skipCtor = key == "constructor");
  }
  if (result && !skipCtor) {
    var objCtor = object.constructor, othCtor = other.constructor;
    if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
      result = false;
    }
  }
  stack["delete"](object);
  stack["delete"](other);
  return result;
}
var equalObjects_default = equalObjects;

// ../../node_modules/lodash-es/_baseIsEqualDeep.js
var COMPARE_PARTIAL_FLAG4 = 1;
var argsTag4 = "[object Arguments]";
var arrayTag3 = "[object Array]";
var objectTag5 = "[object Object]";
var objectProto16 = Object.prototype;
var hasOwnProperty13 = objectProto16.hasOwnProperty;
function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
  var objIsArr = isArray_default(object), othIsArr = isArray_default(other), objTag = objIsArr ? arrayTag3 : getTag_default(object), othTag = othIsArr ? arrayTag3 : getTag_default(other);
  objTag = objTag == argsTag4 ? objectTag5 : objTag;
  othTag = othTag == argsTag4 ? objectTag5 : othTag;
  var objIsObj = objTag == objectTag5, othIsObj = othTag == objectTag5, isSameTag = objTag == othTag;
  if (isSameTag && isBuffer_default(object)) {
    if (!isBuffer_default(other)) {
      return false;
    }
    objIsArr = true;
    objIsObj = false;
  }
  if (isSameTag && !objIsObj) {
    stack || (stack = new Stack_default());
    return objIsArr || isTypedArray_default(object) ? equalArrays_default(object, other, bitmask, customizer, equalFunc, stack) : equalByTag_default(object, other, objTag, bitmask, customizer, equalFunc, stack);
  }
  if (!(bitmask & COMPARE_PARTIAL_FLAG4)) {
    var objIsWrapped = objIsObj && hasOwnProperty13.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty13.call(other, "__wrapped__");
    if (objIsWrapped || othIsWrapped) {
      var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
      stack || (stack = new Stack_default());
      return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
    }
  }
  if (!isSameTag) {
    return false;
  }
  stack || (stack = new Stack_default());
  return equalObjects_default(object, other, bitmask, customizer, equalFunc, stack);
}
var baseIsEqualDeep_default = baseIsEqualDeep;

// ../../node_modules/lodash-es/_baseIsEqual.js
function baseIsEqual(value2, other, bitmask, customizer, stack) {
  if (value2 === other) {
    return true;
  }
  if (value2 == null || other == null || !isObjectLike_default(value2) && !isObjectLike_default(other)) {
    return value2 !== value2 && other !== other;
  }
  return baseIsEqualDeep_default(value2, other, bitmask, customizer, baseIsEqual, stack);
}
var baseIsEqual_default = baseIsEqual;

// ../../node_modules/lodash-es/_createBaseFor.js
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1, iterable = Object(object), props = keysFunc(object), length2 = props.length;
    while (length2--) {
      var key = props[fromRight ? length2 : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}
var createBaseFor_default = createBaseFor;

// ../../node_modules/lodash-es/_baseFor.js
var baseFor = createBaseFor_default();
var baseFor_default = baseFor;

// ../../node_modules/lodash-es/_assignMergeValue.js
function assignMergeValue(object, key, value2) {
  if (value2 !== void 0 && !eq_default(object[key], value2) || value2 === void 0 && !(key in object)) {
    baseAssignValue_default(object, key, value2);
  }
}
var assignMergeValue_default = assignMergeValue;

// ../../node_modules/lodash-es/isArrayLikeObject.js
function isArrayLikeObject(value2) {
  return isObjectLike_default(value2) && isArrayLike_default(value2);
}
var isArrayLikeObject_default = isArrayLikeObject;

// ../../node_modules/lodash-es/_safeGet.js
function safeGet(object, key) {
  if (key === "constructor" && typeof object[key] === "function") {
    return;
  }
  if (key == "__proto__") {
    return;
  }
  return object[key];
}
var safeGet_default = safeGet;

// ../../node_modules/lodash-es/toPlainObject.js
function toPlainObject(value2) {
  return copyObject_default(value2, keysIn_default(value2));
}
var toPlainObject_default = toPlainObject;

// ../../node_modules/lodash-es/_baseMergeDeep.js
function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
  var objValue = safeGet_default(object, key), srcValue = safeGet_default(source, key), stacked = stack.get(srcValue);
  if (stacked) {
    assignMergeValue_default(object, key, stacked);
    return;
  }
  var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
  var isCommon = newValue === void 0;
  if (isCommon) {
    var isArr = isArray_default(srcValue), isBuff = !isArr && isBuffer_default(srcValue), isTyped = !isArr && !isBuff && isTypedArray_default(srcValue);
    newValue = srcValue;
    if (isArr || isBuff || isTyped) {
      if (isArray_default(objValue)) {
        newValue = objValue;
      } else if (isArrayLikeObject_default(objValue)) {
        newValue = copyArray_default(objValue);
      } else if (isBuff) {
        isCommon = false;
        newValue = cloneBuffer_default(srcValue, true);
      } else if (isTyped) {
        isCommon = false;
        newValue = cloneTypedArray_default(srcValue, true);
      } else {
        newValue = [];
      }
    } else if (isPlainObject_default(srcValue) || isArguments_default(srcValue)) {
      newValue = objValue;
      if (isArguments_default(objValue)) {
        newValue = toPlainObject_default(objValue);
      } else if (!isObject_default(objValue) || isFunction_default(objValue)) {
        newValue = initCloneObject_default(srcValue);
      }
    } else {
      isCommon = false;
    }
  }
  if (isCommon) {
    stack.set(srcValue, newValue);
    mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
    stack["delete"](srcValue);
  }
  assignMergeValue_default(object, key, newValue);
}
var baseMergeDeep_default = baseMergeDeep;

// ../../node_modules/lodash-es/_baseMerge.js
function baseMerge(object, source, srcIndex, customizer, stack) {
  if (object === source) {
    return;
  }
  baseFor_default(source, function(srcValue, key) {
    stack || (stack = new Stack_default());
    if (isObject_default(srcValue)) {
      baseMergeDeep_default(object, source, key, srcIndex, baseMerge, customizer, stack);
    } else {
      var newValue = customizer ? customizer(safeGet_default(object, key), srcValue, key + "", object, source, stack) : void 0;
      if (newValue === void 0) {
        newValue = srcValue;
      }
      assignMergeValue_default(object, key, newValue);
    }
  }, keysIn_default);
}
var baseMerge_default = baseMerge;

// ../../node_modules/lodash-es/isEqual.js
function isEqual2(value2, other) {
  return baseIsEqual_default(value2, other);
}
var isEqual_default = isEqual2;

// ../../node_modules/lodash-es/merge.js
var merge = createAssigner_default(function(object, source, srcIndex) {
  baseMerge_default(object, source, srcIndex);
});
var merge_default = merge;

// ../../node_modules/parchment/dist/parchment.js
var parchment_exports = {};
__export(parchment_exports, {
  Attributor: () => Attributor,
  AttributorStore: () => AttributorStore$1,
  BlockBlot: () => BlockBlot$1,
  ClassAttributor: () => ClassAttributor$1,
  ContainerBlot: () => ContainerBlot$1,
  EmbedBlot: () => EmbedBlot$1,
  InlineBlot: () => InlineBlot$1,
  LeafBlot: () => LeafBlot$1,
  ParentBlot: () => ParentBlot$1,
  Registry: () => Registry,
  Scope: () => Scope,
  ScrollBlot: () => ScrollBlot$1,
  StyleAttributor: () => StyleAttributor$1,
  TextBlot: () => TextBlot$1
});
var Scope = /* @__PURE__ */ ((Scope2) => (Scope2[Scope2.TYPE = 3] = "TYPE", Scope2[Scope2.LEVEL = 12] = "LEVEL", Scope2[Scope2.ATTRIBUTE = 13] = "ATTRIBUTE", Scope2[Scope2.BLOT = 14] = "BLOT", Scope2[Scope2.INLINE = 7] = "INLINE", Scope2[Scope2.BLOCK = 11] = "BLOCK", Scope2[Scope2.BLOCK_BLOT = 10] = "BLOCK_BLOT", Scope2[Scope2.INLINE_BLOT = 6] = "INLINE_BLOT", Scope2[Scope2.BLOCK_ATTRIBUTE = 9] = "BLOCK_ATTRIBUTE", Scope2[Scope2.INLINE_ATTRIBUTE = 5] = "INLINE_ATTRIBUTE", Scope2[Scope2.ANY = 15] = "ANY", Scope2))(Scope || {});
var Attributor = class {
  constructor(attrName, keyName, options = {}) {
    this.attrName = attrName, this.keyName = keyName;
    const attributeBit = Scope.TYPE & Scope.ATTRIBUTE;
    this.scope = options.scope != null ? (
      // Ignore type bits, force attribute bit
      options.scope & Scope.LEVEL | attributeBit
    ) : Scope.ATTRIBUTE, options.whitelist != null && (this.whitelist = options.whitelist);
  }
  static keys(node) {
    return Array.from(node.attributes).map((item) => item.name);
  }
  add(node, value2) {
    return this.canAdd(node, value2) ? (node.setAttribute(this.keyName, value2), true) : false;
  }
  canAdd(_node, value2) {
    return this.whitelist == null ? true : typeof value2 == "string" ? this.whitelist.indexOf(value2.replace(/["']/g, "")) > -1 : this.whitelist.indexOf(value2) > -1;
  }
  remove(node) {
    node.removeAttribute(this.keyName);
  }
  value(node) {
    const value2 = node.getAttribute(this.keyName);
    return this.canAdd(node, value2) && value2 ? value2 : "";
  }
};
var ParchmentError = class extends Error {
  constructor(message) {
    message = "[Parchment] " + message, super(message), this.message = message, this.name = this.constructor.name;
  }
};
var _Registry = class _Registry2 {
  constructor() {
    this.attributes = {}, this.classes = {}, this.tags = {}, this.types = {};
  }
  static find(node, bubble = false) {
    if (node == null)
      return null;
    if (this.blots.has(node))
      return this.blots.get(node) || null;
    if (bubble) {
      let parentNode = null;
      try {
        parentNode = node.parentNode;
      } catch {
        return null;
      }
      return this.find(parentNode, bubble);
    }
    return null;
  }
  create(scroll, input, value2) {
    const match2 = this.query(input);
    if (match2 == null)
      throw new ParchmentError(`Unable to create ${input} blot`);
    const blotClass = match2, node = (
      // @ts-expect-error Fix me later
      input instanceof Node || input.nodeType === Node.TEXT_NODE ? input : blotClass.create(value2)
    ), blot = new blotClass(scroll, node, value2);
    return _Registry2.blots.set(blot.domNode, blot), blot;
  }
  find(node, bubble = false) {
    return _Registry2.find(node, bubble);
  }
  query(query, scope = Scope.ANY) {
    let match2;
    return typeof query == "string" ? match2 = this.types[query] || this.attributes[query] : query instanceof Text || query.nodeType === Node.TEXT_NODE ? match2 = this.types.text : typeof query == "number" ? query & Scope.LEVEL & Scope.BLOCK ? match2 = this.types.block : query & Scope.LEVEL & Scope.INLINE && (match2 = this.types.inline) : query instanceof Element && ((query.getAttribute("class") || "").split(/\s+/).some((name) => (match2 = this.classes[name], !!match2)), match2 = match2 || this.tags[query.tagName]), match2 == null ? null : "scope" in match2 && scope & Scope.LEVEL & match2.scope && scope & Scope.TYPE & match2.scope ? match2 : null;
  }
  register(...definitions) {
    return definitions.map((definition) => {
      const isBlot = "blotName" in definition, isAttr = "attrName" in definition;
      if (!isBlot && !isAttr)
        throw new ParchmentError("Invalid definition");
      if (isBlot && definition.blotName === "abstract")
        throw new ParchmentError("Cannot register abstract class");
      const key = isBlot ? definition.blotName : isAttr ? definition.attrName : void 0;
      return this.types[key] = definition, isAttr ? typeof definition.keyName == "string" && (this.attributes[definition.keyName] = definition) : isBlot && (definition.className && (this.classes[definition.className] = definition), definition.tagName && (Array.isArray(definition.tagName) ? definition.tagName = definition.tagName.map((tagName) => tagName.toUpperCase()) : definition.tagName = definition.tagName.toUpperCase(), (Array.isArray(definition.tagName) ? definition.tagName : [definition.tagName]).forEach((tag) => {
        (this.tags[tag] == null || definition.className == null) && (this.tags[tag] = definition);
      }))), definition;
    });
  }
};
_Registry.blots = /* @__PURE__ */ new WeakMap();
var Registry = _Registry;
function match(node, prefix) {
  return (node.getAttribute("class") || "").split(/\s+/).filter((name) => name.indexOf(`${prefix}-`) === 0);
}
var ClassAttributor = class extends Attributor {
  static keys(node) {
    return (node.getAttribute("class") || "").split(/\s+/).map((name) => name.split("-").slice(0, -1).join("-"));
  }
  add(node, value2) {
    return this.canAdd(node, value2) ? (this.remove(node), node.classList.add(`${this.keyName}-${value2}`), true) : false;
  }
  remove(node) {
    match(node, this.keyName).forEach((name) => {
      node.classList.remove(name);
    }), node.classList.length === 0 && node.removeAttribute("class");
  }
  value(node) {
    const value2 = (match(node, this.keyName)[0] || "").slice(this.keyName.length + 1);
    return this.canAdd(node, value2) ? value2 : "";
  }
};
var ClassAttributor$1 = ClassAttributor;
function camelize(name) {
  const parts = name.split("-"), rest = parts.slice(1).map((part) => part[0].toUpperCase() + part.slice(1)).join("");
  return parts[0] + rest;
}
var StyleAttributor = class extends Attributor {
  static keys(node) {
    return (node.getAttribute("style") || "").split(";").map((value2) => value2.split(":")[0].trim());
  }
  add(node, value2) {
    return this.canAdd(node, value2) ? (node.style[camelize(this.keyName)] = value2, true) : false;
  }
  remove(node) {
    node.style[camelize(this.keyName)] = "", node.getAttribute("style") || node.removeAttribute("style");
  }
  value(node) {
    const value2 = node.style[camelize(this.keyName)];
    return this.canAdd(node, value2) ? value2 : "";
  }
};
var StyleAttributor$1 = StyleAttributor;
var AttributorStore = class {
  constructor(domNode) {
    this.attributes = {}, this.domNode = domNode, this.build();
  }
  attribute(attribute, value2) {
    value2 ? attribute.add(this.domNode, value2) && (attribute.value(this.domNode) != null ? this.attributes[attribute.attrName] = attribute : delete this.attributes[attribute.attrName]) : (attribute.remove(this.domNode), delete this.attributes[attribute.attrName]);
  }
  build() {
    this.attributes = {};
    const blot = Registry.find(this.domNode);
    if (blot == null)
      return;
    const attributes = Attributor.keys(this.domNode), classes = ClassAttributor$1.keys(this.domNode), styles = StyleAttributor$1.keys(this.domNode);
    attributes.concat(classes).concat(styles).forEach((name) => {
      const attr = blot.scroll.query(name, Scope.ATTRIBUTE);
      attr instanceof Attributor && (this.attributes[attr.attrName] = attr);
    });
  }
  copy(target) {
    Object.keys(this.attributes).forEach((key) => {
      const value2 = this.attributes[key].value(this.domNode);
      target.format(key, value2);
    });
  }
  move(target) {
    this.copy(target), Object.keys(this.attributes).forEach((key) => {
      this.attributes[key].remove(this.domNode);
    }), this.attributes = {};
  }
  values() {
    return Object.keys(this.attributes).reduce(
      (attributes, name) => (attributes[name] = this.attributes[name].value(this.domNode), attributes),
      {}
    );
  }
};
var AttributorStore$1 = AttributorStore;
var _ShadowBlot = class _ShadowBlot2 {
  constructor(scroll, domNode) {
    this.scroll = scroll, this.domNode = domNode, Registry.blots.set(domNode, this), this.prev = null, this.next = null;
  }
  static create(rawValue) {
    if (this.tagName == null)
      throw new ParchmentError("Blot definition missing tagName");
    let node, value2;
    return Array.isArray(this.tagName) ? (typeof rawValue == "string" ? (value2 = rawValue.toUpperCase(), parseInt(value2, 10).toString() === value2 && (value2 = parseInt(value2, 10))) : typeof rawValue == "number" && (value2 = rawValue), typeof value2 == "number" ? node = document.createElement(this.tagName[value2 - 1]) : value2 && this.tagName.indexOf(value2) > -1 ? node = document.createElement(value2) : node = document.createElement(this.tagName[0])) : node = document.createElement(this.tagName), this.className && node.classList.add(this.className), node;
  }
  // Hack for accessing inherited static methods
  get statics() {
    return this.constructor;
  }
  attach() {
  }
  clone() {
    const domNode = this.domNode.cloneNode(false);
    return this.scroll.create(domNode);
  }
  detach() {
    this.parent != null && this.parent.removeChild(this), Registry.blots.delete(this.domNode);
  }
  deleteAt(index, length2) {
    this.isolate(index, length2).remove();
  }
  formatAt(index, length2, name, value2) {
    const blot = this.isolate(index, length2);
    if (this.scroll.query(name, Scope.BLOT) != null && value2)
      blot.wrap(name, value2);
    else if (this.scroll.query(name, Scope.ATTRIBUTE) != null) {
      const parent = this.scroll.create(this.statics.scope);
      blot.wrap(parent), parent.format(name, value2);
    }
  }
  insertAt(index, value2, def) {
    const blot = def == null ? this.scroll.create("text", value2) : this.scroll.create(value2, def), ref = this.split(index);
    this.parent.insertBefore(blot, ref || void 0);
  }
  isolate(index, length2) {
    const target = this.split(index);
    if (target == null)
      throw new Error("Attempt to isolate at end");
    return target.split(length2), target;
  }
  length() {
    return 1;
  }
  offset(root2 = this.parent) {
    return this.parent == null || this === root2 ? 0 : this.parent.children.offset(this) + this.parent.offset(root2);
  }
  optimize(_context) {
    this.statics.requiredContainer && !(this.parent instanceof this.statics.requiredContainer) && this.wrap(this.statics.requiredContainer.blotName);
  }
  remove() {
    this.domNode.parentNode != null && this.domNode.parentNode.removeChild(this.domNode), this.detach();
  }
  replaceWith(name, value2) {
    const replacement = typeof name == "string" ? this.scroll.create(name, value2) : name;
    return this.parent != null && (this.parent.insertBefore(replacement, this.next || void 0), this.remove()), replacement;
  }
  split(index, _force) {
    return index === 0 ? this : this.next;
  }
  update(_mutations, _context) {
  }
  wrap(name, value2) {
    const wrapper = typeof name == "string" ? this.scroll.create(name, value2) : name;
    if (this.parent != null && this.parent.insertBefore(wrapper, this.next || void 0), typeof wrapper.appendChild != "function")
      throw new ParchmentError(`Cannot wrap ${name}`);
    return wrapper.appendChild(this), wrapper;
  }
};
_ShadowBlot.blotName = "abstract";
var ShadowBlot = _ShadowBlot;
var _LeafBlot = class _LeafBlot2 extends ShadowBlot {
  /**
   * Returns the value represented by domNode if it is this Blot's type
   * No checking that domNode can represent this Blot type is required so
   * applications needing it should check externally before calling.
   */
  static value(_domNode) {
    return true;
  }
  /**
   * Given location represented by node and offset from DOM Selection Range,
   * return index to that location.
   */
  index(node, offset) {
    return this.domNode === node || this.domNode.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY ? Math.min(offset, 1) : -1;
  }
  /**
   * Given index to location within blot, return node and offset representing
   * that location, consumable by DOM Selection Range
   */
  position(index, _inclusive) {
    let offset = Array.from(this.parent.domNode.childNodes).indexOf(this.domNode);
    return index > 0 && (offset += 1), [this.parent.domNode, offset];
  }
  /**
   * Return value represented by this blot
   * Should not change without interaction from API or
   * user change detectable by update()
   */
  value() {
    return {
      [this.statics.blotName]: this.statics.value(this.domNode) || true
    };
  }
};
_LeafBlot.scope = Scope.INLINE_BLOT;
var LeafBlot = _LeafBlot;
var LeafBlot$1 = LeafBlot;
var LinkedList = class {
  constructor() {
    this.head = null, this.tail = null, this.length = 0;
  }
  append(...nodes) {
    if (this.insertBefore(nodes[0], null), nodes.length > 1) {
      const rest = nodes.slice(1);
      this.append(...rest);
    }
  }
  at(index) {
    const next = this.iterator();
    let cur = next();
    for (; cur && index > 0; )
      index -= 1, cur = next();
    return cur;
  }
  contains(node) {
    const next = this.iterator();
    let cur = next();
    for (; cur; ) {
      if (cur === node)
        return true;
      cur = next();
    }
    return false;
  }
  indexOf(node) {
    const next = this.iterator();
    let cur = next(), index = 0;
    for (; cur; ) {
      if (cur === node)
        return index;
      index += 1, cur = next();
    }
    return -1;
  }
  insertBefore(node, refNode) {
    node != null && (this.remove(node), node.next = refNode, refNode != null ? (node.prev = refNode.prev, refNode.prev != null && (refNode.prev.next = node), refNode.prev = node, refNode === this.head && (this.head = node)) : this.tail != null ? (this.tail.next = node, node.prev = this.tail, this.tail = node) : (node.prev = null, this.head = this.tail = node), this.length += 1);
  }
  offset(target) {
    let index = 0, cur = this.head;
    for (; cur != null; ) {
      if (cur === target)
        return index;
      index += cur.length(), cur = cur.next;
    }
    return -1;
  }
  remove(node) {
    this.contains(node) && (node.prev != null && (node.prev.next = node.next), node.next != null && (node.next.prev = node.prev), node === this.head && (this.head = node.next), node === this.tail && (this.tail = node.prev), this.length -= 1);
  }
  iterator(curNode = this.head) {
    return () => {
      const ret = curNode;
      return curNode != null && (curNode = curNode.next), ret;
    };
  }
  find(index, inclusive = false) {
    const next = this.iterator();
    let cur = next();
    for (; cur; ) {
      const length2 = cur.length();
      if (index < length2 || inclusive && index === length2 && (cur.next == null || cur.next.length() !== 0))
        return [cur, index];
      index -= length2, cur = next();
    }
    return [null, 0];
  }
  forEach(callback) {
    const next = this.iterator();
    let cur = next();
    for (; cur; )
      callback(cur), cur = next();
  }
  forEachAt(index, length2, callback) {
    if (length2 <= 0)
      return;
    const [startNode, offset] = this.find(index);
    let curIndex = index - offset;
    const next = this.iterator(startNode);
    let cur = next();
    for (; cur && curIndex < index + length2; ) {
      const curLength = cur.length();
      index > curIndex ? callback(
        cur,
        index - curIndex,
        Math.min(length2, curIndex + curLength - index)
      ) : callback(cur, 0, Math.min(curLength, index + length2 - curIndex)), curIndex += curLength, cur = next();
    }
  }
  map(callback) {
    return this.reduce((memo, cur) => (memo.push(callback(cur)), memo), []);
  }
  reduce(callback, memo) {
    const next = this.iterator();
    let cur = next();
    for (; cur; )
      memo = callback(memo, cur), cur = next();
    return memo;
  }
};
function makeAttachedBlot(node, scroll) {
  const found = scroll.find(node);
  if (found)
    return found;
  try {
    return scroll.create(node);
  } catch {
    const blot = scroll.create(Scope.INLINE);
    return Array.from(node.childNodes).forEach((child) => {
      blot.domNode.appendChild(child);
    }), node.parentNode && node.parentNode.replaceChild(blot.domNode, node), blot.attach(), blot;
  }
}
var _ParentBlot = class _ParentBlot2 extends ShadowBlot {
  constructor(scroll, domNode) {
    super(scroll, domNode), this.uiNode = null, this.build();
  }
  appendChild(other) {
    this.insertBefore(other);
  }
  attach() {
    super.attach(), this.children.forEach((child) => {
      child.attach();
    });
  }
  attachUI(node) {
    this.uiNode != null && this.uiNode.remove(), this.uiNode = node, _ParentBlot2.uiClass && this.uiNode.classList.add(_ParentBlot2.uiClass), this.uiNode.setAttribute("contenteditable", "false"), this.domNode.insertBefore(this.uiNode, this.domNode.firstChild);
  }
  /**
   * Called during construction, should fill its own children LinkedList.
   */
  build() {
    this.children = new LinkedList(), Array.from(this.domNode.childNodes).filter((node) => node !== this.uiNode).reverse().forEach((node) => {
      try {
        const child = makeAttachedBlot(node, this.scroll);
        this.insertBefore(child, this.children.head || void 0);
      } catch (err) {
        if (err instanceof ParchmentError)
          return;
        throw err;
      }
    });
  }
  deleteAt(index, length2) {
    if (index === 0 && length2 === this.length())
      return this.remove();
    this.children.forEachAt(index, length2, (child, offset, childLength) => {
      child.deleteAt(offset, childLength);
    });
  }
  descendant(criteria, index = 0) {
    const [child, offset] = this.children.find(index);
    return criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria ? [child, offset] : child instanceof _ParentBlot2 ? child.descendant(criteria, offset) : [null, -1];
  }
  descendants(criteria, index = 0, length2 = Number.MAX_VALUE) {
    let descendants = [], lengthLeft = length2;
    return this.children.forEachAt(
      index,
      length2,
      (child, childIndex, childLength) => {
        (criteria.blotName == null && criteria(child) || criteria.blotName != null && child instanceof criteria) && descendants.push(child), child instanceof _ParentBlot2 && (descendants = descendants.concat(
          child.descendants(criteria, childIndex, lengthLeft)
        )), lengthLeft -= childLength;
      }
    ), descendants;
  }
  detach() {
    this.children.forEach((child) => {
      child.detach();
    }), super.detach();
  }
  enforceAllowedChildren() {
    let done = false;
    this.children.forEach((child) => {
      done || this.statics.allowedChildren.some(
        (def) => child instanceof def
      ) || (child.statics.scope === Scope.BLOCK_BLOT ? (child.next != null && this.splitAfter(child), child.prev != null && this.splitAfter(child.prev), child.parent.unwrap(), done = true) : child instanceof _ParentBlot2 ? child.unwrap() : child.remove());
    });
  }
  formatAt(index, length2, name, value2) {
    this.children.forEachAt(index, length2, (child, offset, childLength) => {
      child.formatAt(offset, childLength, name, value2);
    });
  }
  insertAt(index, value2, def) {
    const [child, offset] = this.children.find(index);
    if (child)
      child.insertAt(offset, value2, def);
    else {
      const blot = def == null ? this.scroll.create("text", value2) : this.scroll.create(value2, def);
      this.appendChild(blot);
    }
  }
  insertBefore(childBlot, refBlot) {
    childBlot.parent != null && childBlot.parent.children.remove(childBlot);
    let refDomNode = null;
    this.children.insertBefore(childBlot, refBlot || null), childBlot.parent = this, refBlot != null && (refDomNode = refBlot.domNode), (this.domNode.parentNode !== childBlot.domNode || this.domNode.nextSibling !== refDomNode) && this.domNode.insertBefore(childBlot.domNode, refDomNode), childBlot.attach();
  }
  length() {
    return this.children.reduce((memo, child) => memo + child.length(), 0);
  }
  moveChildren(targetParent, refNode) {
    this.children.forEach((child) => {
      targetParent.insertBefore(child, refNode);
    });
  }
  optimize(context) {
    if (super.optimize(context), this.enforceAllowedChildren(), this.uiNode != null && this.uiNode !== this.domNode.firstChild && this.domNode.insertBefore(this.uiNode, this.domNode.firstChild), this.children.length === 0)
      if (this.statics.defaultChild != null) {
        const child = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(child);
      } else
        this.remove();
  }
  path(index, inclusive = false) {
    const [child, offset] = this.children.find(index, inclusive), position = [[this, index]];
    return child instanceof _ParentBlot2 ? position.concat(child.path(offset, inclusive)) : (child != null && position.push([child, offset]), position);
  }
  removeChild(child) {
    this.children.remove(child);
  }
  replaceWith(name, value2) {
    const replacement = typeof name == "string" ? this.scroll.create(name, value2) : name;
    return replacement instanceof _ParentBlot2 && this.moveChildren(replacement), super.replaceWith(replacement);
  }
  split(index, force = false) {
    if (!force) {
      if (index === 0)
        return this;
      if (index === this.length())
        return this.next;
    }
    const after = this.clone();
    return this.parent && this.parent.insertBefore(after, this.next || void 0), this.children.forEachAt(index, this.length(), (child, offset, _length) => {
      const split3 = child.split(offset, force);
      split3 != null && after.appendChild(split3);
    }), after;
  }
  splitAfter(child) {
    const after = this.clone();
    for (; child.next != null; )
      after.appendChild(child.next);
    return this.parent && this.parent.insertBefore(after, this.next || void 0), after;
  }
  unwrap() {
    this.parent && this.moveChildren(this.parent, this.next || void 0), this.remove();
  }
  update(mutations, _context) {
    const addedNodes = [], removedNodes = [];
    mutations.forEach((mutation) => {
      mutation.target === this.domNode && mutation.type === "childList" && (addedNodes.push(...mutation.addedNodes), removedNodes.push(...mutation.removedNodes));
    }), removedNodes.forEach((node) => {
      if (node.parentNode != null && // @ts-expect-error Fix me later
      node.tagName !== "IFRAME" && document.body.compareDocumentPosition(node) & Node.DOCUMENT_POSITION_CONTAINED_BY)
        return;
      const blot = this.scroll.find(node);
      blot != null && (blot.domNode.parentNode == null || blot.domNode.parentNode === this.domNode) && blot.detach();
    }), addedNodes.filter((node) => node.parentNode === this.domNode && node !== this.uiNode).sort((a, b) => a === b ? 0 : a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? 1 : -1).forEach((node) => {
      let refBlot = null;
      node.nextSibling != null && (refBlot = this.scroll.find(node.nextSibling));
      const blot = makeAttachedBlot(node, this.scroll);
      (blot.next !== refBlot || blot.next == null) && (blot.parent != null && blot.parent.removeChild(this), this.insertBefore(blot, refBlot || void 0));
    }), this.enforceAllowedChildren();
  }
};
_ParentBlot.uiClass = "";
var ParentBlot = _ParentBlot;
var ParentBlot$1 = ParentBlot;
function isEqual3(obj1, obj2) {
  if (Object.keys(obj1).length !== Object.keys(obj2).length)
    return false;
  for (const prop in obj1)
    if (obj1[prop] !== obj2[prop])
      return false;
  return true;
}
var _InlineBlot = class _InlineBlot2 extends ParentBlot$1 {
  static create(value2) {
    return super.create(value2);
  }
  static formats(domNode, scroll) {
    const match2 = scroll.query(_InlineBlot2.blotName);
    if (!(match2 != null && domNode.tagName === match2.tagName)) {
      if (typeof this.tagName == "string")
        return true;
      if (Array.isArray(this.tagName))
        return domNode.tagName.toLowerCase();
    }
  }
  constructor(scroll, domNode) {
    super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
  }
  format(name, value2) {
    if (name === this.statics.blotName && !value2)
      this.children.forEach((child) => {
        child instanceof _InlineBlot2 || (child = child.wrap(_InlineBlot2.blotName, true)), this.attributes.copy(child);
      }), this.unwrap();
    else {
      const format2 = this.scroll.query(name, Scope.INLINE);
      if (format2 == null)
        return;
      format2 instanceof Attributor ? this.attributes.attribute(format2, value2) : value2 && (name !== this.statics.blotName || this.formats()[name] !== value2) && this.replaceWith(name, value2);
    }
  }
  formats() {
    const formats = this.attributes.values(), format2 = this.statics.formats(this.domNode, this.scroll);
    return format2 != null && (formats[this.statics.blotName] = format2), formats;
  }
  formatAt(index, length2, name, value2) {
    this.formats()[name] != null || this.scroll.query(name, Scope.ATTRIBUTE) ? this.isolate(index, length2).format(name, value2) : super.formatAt(index, length2, name, value2);
  }
  optimize(context) {
    super.optimize(context);
    const formats = this.formats();
    if (Object.keys(formats).length === 0)
      return this.unwrap();
    const next = this.next;
    next instanceof _InlineBlot2 && next.prev === this && isEqual3(formats, next.formats()) && (next.moveChildren(this), next.remove());
  }
  replaceWith(name, value2) {
    const replacement = super.replaceWith(name, value2);
    return this.attributes.copy(replacement), replacement;
  }
  update(mutations, context) {
    super.update(mutations, context), mutations.some(
      (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
    ) && this.attributes.build();
  }
  wrap(name, value2) {
    const wrapper = super.wrap(name, value2);
    return wrapper instanceof _InlineBlot2 && this.attributes.move(wrapper), wrapper;
  }
};
_InlineBlot.allowedChildren = [_InlineBlot, LeafBlot$1], _InlineBlot.blotName = "inline", _InlineBlot.scope = Scope.INLINE_BLOT, _InlineBlot.tagName = "SPAN";
var InlineBlot = _InlineBlot;
var InlineBlot$1 = InlineBlot;
var _BlockBlot = class _BlockBlot2 extends ParentBlot$1 {
  static create(value2) {
    return super.create(value2);
  }
  static formats(domNode, scroll) {
    const match2 = scroll.query(_BlockBlot2.blotName);
    if (!(match2 != null && domNode.tagName === match2.tagName)) {
      if (typeof this.tagName == "string")
        return true;
      if (Array.isArray(this.tagName))
        return domNode.tagName.toLowerCase();
    }
  }
  constructor(scroll, domNode) {
    super(scroll, domNode), this.attributes = new AttributorStore$1(this.domNode);
  }
  format(name, value2) {
    const format2 = this.scroll.query(name, Scope.BLOCK);
    format2 != null && (format2 instanceof Attributor ? this.attributes.attribute(format2, value2) : name === this.statics.blotName && !value2 ? this.replaceWith(_BlockBlot2.blotName) : value2 && (name !== this.statics.blotName || this.formats()[name] !== value2) && this.replaceWith(name, value2));
  }
  formats() {
    const formats = this.attributes.values(), format2 = this.statics.formats(this.domNode, this.scroll);
    return format2 != null && (formats[this.statics.blotName] = format2), formats;
  }
  formatAt(index, length2, name, value2) {
    this.scroll.query(name, Scope.BLOCK) != null ? this.format(name, value2) : super.formatAt(index, length2, name, value2);
  }
  insertAt(index, value2, def) {
    if (def == null || this.scroll.query(value2, Scope.INLINE) != null)
      super.insertAt(index, value2, def);
    else {
      const after = this.split(index);
      if (after != null) {
        const blot = this.scroll.create(value2, def);
        after.parent.insertBefore(blot, after);
      } else
        throw new Error("Attempt to insertAt after block boundaries");
    }
  }
  replaceWith(name, value2) {
    const replacement = super.replaceWith(name, value2);
    return this.attributes.copy(replacement), replacement;
  }
  update(mutations, context) {
    super.update(mutations, context), mutations.some(
      (mutation) => mutation.target === this.domNode && mutation.type === "attributes"
    ) && this.attributes.build();
  }
};
_BlockBlot.blotName = "block", _BlockBlot.scope = Scope.BLOCK_BLOT, _BlockBlot.tagName = "P", _BlockBlot.allowedChildren = [
  InlineBlot$1,
  _BlockBlot,
  LeafBlot$1
];
var BlockBlot = _BlockBlot;
var BlockBlot$1 = BlockBlot;
var _ContainerBlot = class _ContainerBlot2 extends ParentBlot$1 {
  checkMerge() {
    return this.next !== null && this.next.statics.blotName === this.statics.blotName;
  }
  deleteAt(index, length2) {
    super.deleteAt(index, length2), this.enforceAllowedChildren();
  }
  formatAt(index, length2, name, value2) {
    super.formatAt(index, length2, name, value2), this.enforceAllowedChildren();
  }
  insertAt(index, value2, def) {
    super.insertAt(index, value2, def), this.enforceAllowedChildren();
  }
  optimize(context) {
    super.optimize(context), this.children.length > 0 && this.next != null && this.checkMerge() && (this.next.moveChildren(this), this.next.remove());
  }
};
_ContainerBlot.blotName = "container", _ContainerBlot.scope = Scope.BLOCK_BLOT;
var ContainerBlot = _ContainerBlot;
var ContainerBlot$1 = ContainerBlot;
var EmbedBlot = class extends LeafBlot$1 {
  static formats(_domNode, _scroll) {
  }
  format(name, value2) {
    super.formatAt(0, this.length(), name, value2);
  }
  formatAt(index, length2, name, value2) {
    index === 0 && length2 === this.length() ? this.format(name, value2) : super.formatAt(index, length2, name, value2);
  }
  formats() {
    return this.statics.formats(this.domNode, this.scroll);
  }
};
var EmbedBlot$1 = EmbedBlot;
var OBSERVER_CONFIG = {
  attributes: true,
  characterData: true,
  characterDataOldValue: true,
  childList: true,
  subtree: true
};
var MAX_OPTIMIZE_ITERATIONS = 100;
var _ScrollBlot = class _ScrollBlot2 extends ParentBlot$1 {
  constructor(registry, node) {
    super(null, node), this.registry = registry, this.scroll = this, this.build(), this.observer = new MutationObserver((mutations) => {
      this.update(mutations);
    }), this.observer.observe(this.domNode, OBSERVER_CONFIG), this.attach();
  }
  create(input, value2) {
    return this.registry.create(this, input, value2);
  }
  find(node, bubble = false) {
    const blot = this.registry.find(node, bubble);
    return blot ? blot.scroll === this ? blot : bubble ? this.find(blot.scroll.domNode.parentNode, true) : null : null;
  }
  query(query, scope = Scope.ANY) {
    return this.registry.query(query, scope);
  }
  register(...definitions) {
    return this.registry.register(...definitions);
  }
  build() {
    this.scroll != null && super.build();
  }
  detach() {
    super.detach(), this.observer.disconnect();
  }
  deleteAt(index, length2) {
    this.update(), index === 0 && length2 === this.length() ? this.children.forEach((child) => {
      child.remove();
    }) : super.deleteAt(index, length2);
  }
  formatAt(index, length2, name, value2) {
    this.update(), super.formatAt(index, length2, name, value2);
  }
  insertAt(index, value2, def) {
    this.update(), super.insertAt(index, value2, def);
  }
  optimize(mutations = [], context = {}) {
    super.optimize(context);
    const mutationsMap = context.mutationsMap || /* @__PURE__ */ new WeakMap();
    let records = Array.from(this.observer.takeRecords());
    for (; records.length > 0; )
      mutations.push(records.pop());
    const mark = (blot, markParent = true) => {
      blot == null || blot === this || blot.domNode.parentNode != null && (mutationsMap.has(blot.domNode) || mutationsMap.set(blot.domNode, []), markParent && mark(blot.parent));
    }, optimize = (blot) => {
      mutationsMap.has(blot.domNode) && (blot instanceof ParentBlot$1 && blot.children.forEach(optimize), mutationsMap.delete(blot.domNode), blot.optimize(context));
    };
    let remaining = mutations;
    for (let i = 0; remaining.length > 0; i += 1) {
      if (i >= MAX_OPTIMIZE_ITERATIONS)
        throw new Error("[Parchment] Maximum optimize iterations reached");
      for (remaining.forEach((mutation) => {
        const blot = this.find(mutation.target, true);
        blot != null && (blot.domNode === mutation.target && (mutation.type === "childList" ? (mark(this.find(mutation.previousSibling, false)), Array.from(mutation.addedNodes).forEach((node) => {
          const child = this.find(node, false);
          mark(child, false), child instanceof ParentBlot$1 && child.children.forEach((grandChild) => {
            mark(grandChild, false);
          });
        })) : mutation.type === "attributes" && mark(blot.prev)), mark(blot));
      }), this.children.forEach(optimize), remaining = Array.from(this.observer.takeRecords()), records = remaining.slice(); records.length > 0; )
        mutations.push(records.pop());
    }
  }
  update(mutations, context = {}) {
    mutations = mutations || this.observer.takeRecords();
    const mutationsMap = /* @__PURE__ */ new WeakMap();
    mutations.map((mutation) => {
      const blot = this.find(mutation.target, true);
      return blot == null ? null : mutationsMap.has(blot.domNode) ? (mutationsMap.get(blot.domNode).push(mutation), null) : (mutationsMap.set(blot.domNode, [mutation]), blot);
    }).forEach((blot) => {
      blot != null && blot !== this && mutationsMap.has(blot.domNode) && blot.update(mutationsMap.get(blot.domNode) || [], context);
    }), context.mutationsMap = mutationsMap, mutationsMap.has(this.domNode) && super.update(mutationsMap.get(this.domNode), context), this.optimize(mutations, context);
  }
};
_ScrollBlot.blotName = "scroll", _ScrollBlot.defaultChild = BlockBlot$1, _ScrollBlot.allowedChildren = [BlockBlot$1, ContainerBlot$1], _ScrollBlot.scope = Scope.BLOCK_BLOT, _ScrollBlot.tagName = "DIV";
var ScrollBlot = _ScrollBlot;
var ScrollBlot$1 = ScrollBlot;
var _TextBlot = class _TextBlot2 extends LeafBlot$1 {
  static create(value2) {
    return document.createTextNode(value2);
  }
  static value(domNode) {
    return domNode.data;
  }
  constructor(scroll, node) {
    super(scroll, node), this.text = this.statics.value(this.domNode);
  }
  deleteAt(index, length2) {
    this.domNode.data = this.text = this.text.slice(0, index) + this.text.slice(index + length2);
  }
  index(node, offset) {
    return this.domNode === node ? offset : -1;
  }
  insertAt(index, value2, def) {
    def == null ? (this.text = this.text.slice(0, index) + value2 + this.text.slice(index), this.domNode.data = this.text) : super.insertAt(index, value2, def);
  }
  length() {
    return this.text.length;
  }
  optimize(context) {
    super.optimize(context), this.text = this.statics.value(this.domNode), this.text.length === 0 ? this.remove() : this.next instanceof _TextBlot2 && this.next.prev === this && (this.insertAt(this.length(), this.next.value()), this.next.remove());
  }
  position(index, _inclusive = false) {
    return [this.domNode, index];
  }
  split(index, force = false) {
    if (!force) {
      if (index === 0)
        return this;
      if (index === this.length())
        return this.next;
    }
    const after = this.scroll.create(this.domNode.splitText(index));
    return this.parent.insertBefore(after, this.next || void 0), this.text = this.statics.value(this.domNode), after;
  }
  update(mutations, _context) {
    mutations.some((mutation) => mutation.type === "characterData" && mutation.target === this.domNode) && (this.text = this.statics.value(this.domNode));
  }
  value() {
    return this.text;
  }
};
_TextBlot.blotName = "text", _TextBlot.scope = Scope.INLINE_BLOT;
var TextBlot = _TextBlot;
var TextBlot$1 = TextBlot;

// ../../node_modules/quill/core/quill.js
var import_quill_delta3 = __toESM(require_Delta(), 1);

// ../../node_modules/quill/core/editor.js
var import_quill_delta2 = __toESM(require_Delta(), 1);

// ../../node_modules/quill/blots/block.js
var import_quill_delta = __toESM(require_Delta(), 1);

// ../../node_modules/quill/blots/break.js
var Break = class extends EmbedBlot$1 {
  static value() {
    return void 0;
  }
  optimize() {
    if (this.prev || this.next) {
      this.remove();
    }
  }
  length() {
    return 0;
  }
  value() {
    return "";
  }
};
Break.blotName = "break";
Break.tagName = "BR";
var break_default = Break;

// ../../node_modules/quill/blots/text.js
var Text2 = class extends TextBlot$1 {
};
function escapeText(text2) {
  return text2.replace(/[&<>"']/g, (s) => {
    const entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    return entityMap[s];
  });
}

// ../../node_modules/quill/blots/inline.js
var Inline = class _Inline extends InlineBlot$1 {
  static allowedChildren = [_Inline, break_default, EmbedBlot$1, Text2];
  // Lower index means deeper in the DOM tree, since not found (-1) is for embeds
  static order = [
    "cursor",
    "inline",
    // Must be lower
    "link",
    // Chrome wants <a> to be lower
    "underline",
    "strike",
    "italic",
    "bold",
    "script",
    "code"
    // Must be higher
  ];
  static compare(self2, other) {
    const selfIndex = _Inline.order.indexOf(self2);
    const otherIndex = _Inline.order.indexOf(other);
    if (selfIndex >= 0 || otherIndex >= 0) {
      return selfIndex - otherIndex;
    }
    if (self2 === other) {
      return 0;
    }
    if (self2 < other) {
      return -1;
    }
    return 1;
  }
  formatAt(index, length2, name, value2) {
    if (_Inline.compare(this.statics.blotName, name) < 0 && this.scroll.query(name, Scope.BLOT)) {
      const blot = this.isolate(index, length2);
      if (value2) {
        blot.wrap(name, value2);
      }
    } else {
      super.formatAt(index, length2, name, value2);
    }
  }
  optimize(context) {
    super.optimize(context);
    if (this.parent instanceof _Inline && _Inline.compare(this.statics.blotName, this.parent.statics.blotName) > 0) {
      const parent = this.parent.isolate(this.offset(), this.length());
      this.moveChildren(parent);
      parent.wrap(this);
    }
  }
};
var inline_default = Inline;

// ../../node_modules/quill/blots/block.js
var NEWLINE_LENGTH = 1;
var Block = class extends BlockBlot$1 {
  cache = {};
  delta() {
    if (this.cache.delta == null) {
      this.cache.delta = blockDelta(this);
    }
    return this.cache.delta;
  }
  deleteAt(index, length2) {
    super.deleteAt(index, length2);
    this.cache = {};
  }
  formatAt(index, length2, name, value2) {
    if (length2 <= 0)
      return;
    if (this.scroll.query(name, Scope.BLOCK)) {
      if (index + length2 === this.length()) {
        this.format(name, value2);
      }
    } else {
      super.formatAt(index, Math.min(length2, this.length() - index - 1), name, value2);
    }
    this.cache = {};
  }
  insertAt(index, value2, def) {
    if (def != null) {
      super.insertAt(index, value2, def);
      this.cache = {};
      return;
    }
    if (value2.length === 0)
      return;
    const lines = value2.split("\n");
    const text2 = lines.shift();
    if (text2.length > 0) {
      if (index < this.length() - 1 || this.children.tail == null) {
        super.insertAt(Math.min(index, this.length() - 1), text2);
      } else {
        this.children.tail.insertAt(this.children.tail.length(), text2);
      }
      this.cache = {};
    }
    let block = this;
    lines.reduce((lineIndex, line) => {
      block = block.split(lineIndex, true);
      block.insertAt(0, line);
      return line.length;
    }, index + text2.length);
  }
  insertBefore(blot, ref) {
    const {
      head
    } = this.children;
    super.insertBefore(blot, ref);
    if (head instanceof break_default) {
      head.remove();
    }
    this.cache = {};
  }
  length() {
    if (this.cache.length == null) {
      this.cache.length = super.length() + NEWLINE_LENGTH;
    }
    return this.cache.length;
  }
  moveChildren(target, ref) {
    super.moveChildren(target, ref);
    this.cache = {};
  }
  optimize(context) {
    super.optimize(context);
    this.cache = {};
  }
  path(index) {
    return super.path(index, true);
  }
  removeChild(child) {
    super.removeChild(child);
    this.cache = {};
  }
  split(index) {
    let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (force && (index === 0 || index >= this.length() - NEWLINE_LENGTH)) {
      const clone = this.clone();
      if (index === 0) {
        this.parent.insertBefore(clone, this);
        return this;
      }
      this.parent.insertBefore(clone, this.next);
      return clone;
    }
    const next = super.split(index, force);
    this.cache = {};
    return next;
  }
};
Block.blotName = "block";
Block.tagName = "P";
Block.defaultChild = break_default;
Block.allowedChildren = [break_default, inline_default, EmbedBlot$1, Text2];
var BlockEmbed = class extends EmbedBlot$1 {
  attach() {
    super.attach();
    this.attributes = new AttributorStore$1(this.domNode);
  }
  delta() {
    return new import_quill_delta.default().insert(this.value(), {
      ...this.formats(),
      ...this.attributes.values()
    });
  }
  format(name, value2) {
    const attribute = this.scroll.query(name, Scope.BLOCK_ATTRIBUTE);
    if (attribute != null) {
      this.attributes.attribute(attribute, value2);
    }
  }
  formatAt(index, length2, name, value2) {
    this.format(name, value2);
  }
  insertAt(index, value2, def) {
    if (def != null) {
      super.insertAt(index, value2, def);
      return;
    }
    const lines = value2.split("\n");
    const text2 = lines.pop();
    const blocks = lines.map((line) => {
      const block = this.scroll.create(Block.blotName);
      block.insertAt(0, line);
      return block;
    });
    const ref = this.split(index);
    blocks.forEach((block) => {
      this.parent.insertBefore(block, ref);
    });
    if (text2) {
      this.parent.insertBefore(this.scroll.create("text", text2), ref);
    }
  }
};
BlockEmbed.scope = Scope.BLOCK_BLOT;
function blockDelta(blot) {
  let filter = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
  return blot.descendants(LeafBlot$1).reduce((delta, leaf) => {
    if (leaf.length() === 0) {
      return delta;
    }
    return delta.insert(leaf.value(), bubbleFormats(leaf, {}, filter));
  }, new import_quill_delta.default()).insert("\n", bubbleFormats(blot));
}
function bubbleFormats(blot) {
  let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  let filter = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
  if (blot == null)
    return formats;
  if ("formats" in blot && typeof blot.formats === "function") {
    formats = {
      ...formats,
      ...blot.formats()
    };
    if (filter) {
      delete formats["code-token"];
    }
  }
  if (blot.parent == null || blot.parent.statics.blotName === "scroll" || blot.parent.statics.scope !== blot.statics.scope) {
    return formats;
  }
  return bubbleFormats(blot.parent, formats, filter);
}

// ../../node_modules/quill/blots/cursor.js
var Cursor = class _Cursor extends EmbedBlot$1 {
  static blotName = "cursor";
  static className = "ql-cursor";
  static tagName = "span";
  static CONTENTS = "\uFEFF";
  // Zero width no break space
  static value() {
    return void 0;
  }
  constructor(scroll, domNode, selection) {
    super(scroll, domNode);
    this.selection = selection;
    this.textNode = document.createTextNode(_Cursor.CONTENTS);
    this.domNode.appendChild(this.textNode);
    this.savedLength = 0;
  }
  detach() {
    if (this.parent != null)
      this.parent.removeChild(this);
  }
  format(name, value2) {
    if (this.savedLength !== 0) {
      super.format(name, value2);
      return;
    }
    let target = this;
    let index = 0;
    while (target != null && target.statics.scope !== Scope.BLOCK_BLOT) {
      index += target.offset(target.parent);
      target = target.parent;
    }
    if (target != null) {
      this.savedLength = _Cursor.CONTENTS.length;
      target.optimize();
      target.formatAt(index, _Cursor.CONTENTS.length, name, value2);
      this.savedLength = 0;
    }
  }
  index(node, offset) {
    if (node === this.textNode)
      return 0;
    return super.index(node, offset);
  }
  length() {
    return this.savedLength;
  }
  position() {
    return [this.textNode, this.textNode.data.length];
  }
  remove() {
    super.remove();
    this.parent = null;
  }
  restore() {
    if (this.selection.composing || this.parent == null)
      return null;
    const range = this.selection.getNativeRange();
    while (this.domNode.lastChild != null && this.domNode.lastChild !== this.textNode) {
      this.domNode.parentNode.insertBefore(this.domNode.lastChild, this.domNode);
    }
    const prevTextBlot = this.prev instanceof Text2 ? this.prev : null;
    const prevTextLength = prevTextBlot ? prevTextBlot.length() : 0;
    const nextTextBlot = this.next instanceof Text2 ? this.next : null;
    const nextText = nextTextBlot ? nextTextBlot.text : "";
    const {
      textNode
    } = this;
    const newText = textNode.data.split(_Cursor.CONTENTS).join("");
    textNode.data = _Cursor.CONTENTS;
    let mergedTextBlot;
    if (prevTextBlot) {
      mergedTextBlot = prevTextBlot;
      if (newText || nextTextBlot) {
        prevTextBlot.insertAt(prevTextBlot.length(), newText + nextText);
        if (nextTextBlot) {
          nextTextBlot.remove();
        }
      }
    } else if (nextTextBlot) {
      mergedTextBlot = nextTextBlot;
      nextTextBlot.insertAt(0, newText);
    } else {
      const newTextNode = document.createTextNode(newText);
      mergedTextBlot = this.scroll.create(newTextNode);
      this.parent.insertBefore(mergedTextBlot, this);
    }
    this.remove();
    if (range) {
      const remapOffset = (node, offset) => {
        if (prevTextBlot && node === prevTextBlot.domNode) {
          return offset;
        }
        if (node === textNode) {
          return prevTextLength + offset - 1;
        }
        if (nextTextBlot && node === nextTextBlot.domNode) {
          return prevTextLength + newText.length + offset;
        }
        return null;
      };
      const start2 = remapOffset(range.start.node, range.start.offset);
      const end = remapOffset(range.end.node, range.end.offset);
      if (start2 !== null && end !== null) {
        return {
          startNode: mergedTextBlot.domNode,
          startOffset: start2,
          endNode: mergedTextBlot.domNode,
          endOffset: end
        };
      }
    }
    return null;
  }
  update(mutations, context) {
    if (mutations.some((mutation) => {
      return mutation.type === "characterData" && mutation.target === this.textNode;
    })) {
      const range = this.restore();
      if (range)
        context.range = range;
    }
  }
  // Avoid .ql-cursor being a descendant of `<a/>`.
  // The reason is Safari pushes down `<a/>` on text insertion.
  // That will cause DOM nodes not sync with the model.
  //
  // For example ({I} is the caret), given the markup:
  //    <a><span class="ql-cursor">\uFEFF{I}</span></a>
  // When typing a char "x", `<a/>` will be pushed down inside the `<span>` first:
  //    <span class="ql-cursor"><a>\uFEFF{I}</a></span>
  // And then "x" will be inserted after `<a/>`:
  //    <span class="ql-cursor"><a>\uFEFF</a>d{I}</span>
  optimize(context) {
    super.optimize(context);
    let {
      parent
    } = this;
    while (parent) {
      if (parent.domNode.tagName === "A") {
        this.savedLength = _Cursor.CONTENTS.length;
        parent.isolate(this.offset(parent), this.length()).unwrap();
        this.savedLength = 0;
        break;
      }
      parent = parent.parent;
    }
  }
  value() {
    return "";
  }
};
var cursor_default = Cursor;

// ../../node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// ../../node_modules/quill/core/instances.js
var instances_default = /* @__PURE__ */ new WeakMap();

// ../../node_modules/quill/core/logger.js
var levels = ["error", "warn", "log", "info"];
var level = "warn";
function debug(method) {
  if (level) {
    if (levels.indexOf(method) <= levels.indexOf(level)) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      console[method](...args);
    }
  }
}
function namespace(ns) {
  return levels.reduce((logger, method) => {
    logger[method] = debug.bind(console, method, ns);
    return logger;
  }, {});
}
namespace.level = (newLevel) => {
  level = newLevel;
};
debug.level = namespace.level;
var logger_default = namespace;

// ../../node_modules/quill/core/emitter.js
var debug2 = logger_default("quill:events");
var EVENTS = ["selectionchange", "mousedown", "mouseup", "click"];
EVENTS.forEach((eventName) => {
  document.addEventListener(eventName, function() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    Array.from(document.querySelectorAll(".ql-container")).forEach((node) => {
      const quill = instances_default.get(node);
      if (quill && quill.emitter) {
        quill.emitter.handleDOM(...args);
      }
    });
  });
});
var Emitter = class extends import_index.default {
  static events = {
    EDITOR_CHANGE: "editor-change",
    SCROLL_BEFORE_UPDATE: "scroll-before-update",
    SCROLL_BLOT_MOUNT: "scroll-blot-mount",
    SCROLL_BLOT_UNMOUNT: "scroll-blot-unmount",
    SCROLL_OPTIMIZE: "scroll-optimize",
    SCROLL_UPDATE: "scroll-update",
    SCROLL_EMBED_UPDATE: "scroll-embed-update",
    SELECTION_CHANGE: "selection-change",
    TEXT_CHANGE: "text-change",
    COMPOSITION_BEFORE_START: "composition-before-start",
    COMPOSITION_START: "composition-start",
    COMPOSITION_BEFORE_END: "composition-before-end",
    COMPOSITION_END: "composition-end"
  };
  static sources = {
    API: "api",
    SILENT: "silent",
    USER: "user"
  };
  constructor() {
    super();
    this.domListeners = {};
    this.on("error", debug2.error);
  }
  emit() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    debug2.log.call(debug2, ...args);
    return super.emit(...args);
  }
  handleDOM(event) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    (this.domListeners[event.type] || []).forEach((_ref) => {
      let {
        node,
        handler
      } = _ref;
      if (event.target === node || node.contains(event.target)) {
        handler(event, ...args);
      }
    });
  }
  listenDOM(eventName, node, handler) {
    if (!this.domListeners[eventName]) {
      this.domListeners[eventName] = [];
    }
    this.domListeners[eventName].push({
      node,
      handler
    });
  }
};
var emitter_default = Emitter;

// ../../node_modules/quill/core/selection.js
var debug3 = logger_default("quill:selection");
var Range = class {
  constructor(index) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    this.index = index;
    this.length = length2;
  }
};
var Selection = class {
  constructor(scroll, emitter) {
    this.emitter = emitter;
    this.scroll = scroll;
    this.composing = false;
    this.mouseDown = false;
    this.root = this.scroll.domNode;
    this.cursor = this.scroll.create("cursor", this);
    this.savedRange = new Range(0, 0);
    this.lastRange = this.savedRange;
    this.lastNative = null;
    this.handleComposition();
    this.handleDragging();
    this.emitter.listenDOM("selectionchange", document, () => {
      if (!this.mouseDown && !this.composing) {
        setTimeout(this.update.bind(this, emitter_default.sources.USER), 1);
      }
    });
    this.emitter.on(emitter_default.events.SCROLL_BEFORE_UPDATE, () => {
      if (!this.hasFocus())
        return;
      const native = this.getNativeRange();
      if (native == null)
        return;
      if (native.start.node === this.cursor.textNode)
        return;
      this.emitter.once(emitter_default.events.SCROLL_UPDATE, (source, mutations) => {
        try {
          if (this.root.contains(native.start.node) && this.root.contains(native.end.node)) {
            this.setNativeRange(native.start.node, native.start.offset, native.end.node, native.end.offset);
          }
          const triggeredByTyping = mutations.some((mutation) => mutation.type === "characterData" || mutation.type === "childList" || mutation.type === "attributes" && mutation.target === this.root);
          this.update(triggeredByTyping ? emitter_default.sources.SILENT : source);
        } catch (ignored) {
        }
      });
    });
    this.emitter.on(emitter_default.events.SCROLL_OPTIMIZE, (mutations, context) => {
      if (context.range) {
        const {
          startNode,
          startOffset,
          endNode,
          endOffset
        } = context.range;
        this.setNativeRange(startNode, startOffset, endNode, endOffset);
        this.update(emitter_default.sources.SILENT);
      }
    });
    this.update(emitter_default.sources.SILENT);
  }
  handleComposition() {
    this.emitter.on(emitter_default.events.COMPOSITION_BEFORE_START, () => {
      this.composing = true;
    });
    this.emitter.on(emitter_default.events.COMPOSITION_END, () => {
      this.composing = false;
      if (this.cursor.parent) {
        const range = this.cursor.restore();
        if (!range)
          return;
        setTimeout(() => {
          this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
        }, 1);
      }
    });
  }
  handleDragging() {
    this.emitter.listenDOM("mousedown", document.body, () => {
      this.mouseDown = true;
    });
    this.emitter.listenDOM("mouseup", document.body, () => {
      this.mouseDown = false;
      this.update(emitter_default.sources.USER);
    });
  }
  focus() {
    if (this.hasFocus())
      return;
    this.root.focus({
      preventScroll: true
    });
    this.setRange(this.savedRange);
  }
  format(format2, value2) {
    this.scroll.update();
    const nativeRange = this.getNativeRange();
    if (nativeRange == null || !nativeRange.native.collapsed || this.scroll.query(format2, Scope.BLOCK))
      return;
    if (nativeRange.start.node !== this.cursor.textNode) {
      const blot = this.scroll.find(nativeRange.start.node, false);
      if (blot == null)
        return;
      if (blot instanceof LeafBlot$1) {
        const after = blot.split(nativeRange.start.offset);
        blot.parent.insertBefore(this.cursor, after);
      } else {
        blot.insertBefore(this.cursor, nativeRange.start.node);
      }
      this.cursor.attach();
    }
    this.cursor.format(format2, value2);
    this.scroll.optimize();
    this.setNativeRange(this.cursor.textNode, this.cursor.textNode.data.length);
    this.update();
  }
  getBounds(index) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    const scrollLength = this.scroll.length();
    index = Math.min(index, scrollLength - 1);
    length2 = Math.min(index + length2, scrollLength - 1) - index;
    let node;
    let [leaf, offset] = this.scroll.leaf(index);
    if (leaf == null)
      return null;
    if (length2 > 0 && offset === leaf.length()) {
      const [next] = this.scroll.leaf(index + 1);
      if (next) {
        const [line] = this.scroll.line(index);
        const [nextLine] = this.scroll.line(index + 1);
        if (line === nextLine) {
          leaf = next;
          offset = 0;
        }
      }
    }
    [node, offset] = leaf.position(offset, true);
    const range = document.createRange();
    if (length2 > 0) {
      range.setStart(node, offset);
      [leaf, offset] = this.scroll.leaf(index + length2);
      if (leaf == null)
        return null;
      [node, offset] = leaf.position(offset, true);
      range.setEnd(node, offset);
      return range.getBoundingClientRect();
    }
    let side = "left";
    let rect;
    if (node instanceof Text) {
      if (!node.data.length) {
        return null;
      }
      if (offset < node.data.length) {
        range.setStart(node, offset);
        range.setEnd(node, offset + 1);
      } else {
        range.setStart(node, offset - 1);
        range.setEnd(node, offset);
        side = "right";
      }
      rect = range.getBoundingClientRect();
    } else {
      if (!(leaf.domNode instanceof Element))
        return null;
      rect = leaf.domNode.getBoundingClientRect();
      if (offset > 0)
        side = "right";
    }
    return {
      bottom: rect.top + rect.height,
      height: rect.height,
      left: rect[side],
      right: rect[side],
      top: rect.top,
      width: 0
    };
  }
  getNativeRange() {
    const selection = document.getSelection();
    if (selection == null || selection.rangeCount <= 0)
      return null;
    const nativeRange = selection.getRangeAt(0);
    if (nativeRange == null)
      return null;
    const range = this.normalizeNative(nativeRange);
    debug3.info("getNativeRange", range);
    return range;
  }
  getRange() {
    const root2 = this.scroll.domNode;
    if ("isConnected" in root2 && !root2.isConnected) {
      return [null, null];
    }
    const normalized = this.getNativeRange();
    if (normalized == null)
      return [null, null];
    const range = this.normalizedToRange(normalized);
    return [range, normalized];
  }
  hasFocus() {
    return document.activeElement === this.root || document.activeElement != null && contains(this.root, document.activeElement);
  }
  normalizedToRange(range) {
    const positions = [[range.start.node, range.start.offset]];
    if (!range.native.collapsed) {
      positions.push([range.end.node, range.end.offset]);
    }
    const indexes = positions.map((position) => {
      const [node, offset] = position;
      const blot = this.scroll.find(node, true);
      const index = blot.offset(this.scroll);
      if (offset === 0) {
        return index;
      }
      if (blot instanceof LeafBlot$1) {
        return index + blot.index(node, offset);
      }
      return index + blot.length();
    });
    const end = Math.min(Math.max(...indexes), this.scroll.length() - 1);
    const start2 = Math.min(end, ...indexes);
    return new Range(start2, end - start2);
  }
  normalizeNative(nativeRange) {
    if (!contains(this.root, nativeRange.startContainer) || !nativeRange.collapsed && !contains(this.root, nativeRange.endContainer)) {
      return null;
    }
    const range = {
      start: {
        node: nativeRange.startContainer,
        offset: nativeRange.startOffset
      },
      end: {
        node: nativeRange.endContainer,
        offset: nativeRange.endOffset
      },
      native: nativeRange
    };
    [range.start, range.end].forEach((position) => {
      let {
        node,
        offset
      } = position;
      while (!(node instanceof Text) && node.childNodes.length > 0) {
        if (node.childNodes.length > offset) {
          node = node.childNodes[offset];
          offset = 0;
        } else if (node.childNodes.length === offset) {
          node = node.lastChild;
          if (node instanceof Text) {
            offset = node.data.length;
          } else if (node.childNodes.length > 0) {
            offset = node.childNodes.length;
          } else {
            offset = node.childNodes.length + 1;
          }
        } else {
          break;
        }
      }
      position.node = node;
      position.offset = offset;
    });
    return range;
  }
  rangeToNative(range) {
    const scrollLength = this.scroll.length();
    const getPosition = (index, inclusive) => {
      index = Math.min(scrollLength - 1, index);
      const [leaf, leafOffset] = this.scroll.leaf(index);
      return leaf ? leaf.position(leafOffset, inclusive) : [null, -1];
    };
    return [...getPosition(range.index, false), ...getPosition(range.index + range.length, true)];
  }
  setNativeRange(startNode, startOffset) {
    let endNode = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : startNode;
    let endOffset = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : startOffset;
    let force = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : false;
    debug3.info("setNativeRange", startNode, startOffset, endNode, endOffset);
    if (startNode != null && (this.root.parentNode == null || startNode.parentNode == null || // @ts-expect-error Fix me later
    endNode.parentNode == null)) {
      return;
    }
    const selection = document.getSelection();
    if (selection == null)
      return;
    if (startNode != null) {
      if (!this.hasFocus())
        this.root.focus({
          preventScroll: true
        });
      const {
        native
      } = this.getNativeRange() || {};
      if (native == null || force || startNode !== native.startContainer || startOffset !== native.startOffset || endNode !== native.endContainer || endOffset !== native.endOffset) {
        if (startNode instanceof Element && startNode.tagName === "BR") {
          startOffset = Array.from(startNode.parentNode.childNodes).indexOf(startNode);
          startNode = startNode.parentNode;
        }
        if (endNode instanceof Element && endNode.tagName === "BR") {
          endOffset = Array.from(endNode.parentNode.childNodes).indexOf(endNode);
          endNode = endNode.parentNode;
        }
        const range = document.createRange();
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    } else {
      selection.removeAllRanges();
      this.root.blur();
    }
  }
  setRange(range) {
    let force = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : emitter_default.sources.API;
    if (typeof force === "string") {
      source = force;
      force = false;
    }
    debug3.info("setRange", range);
    if (range != null) {
      const args = this.rangeToNative(range);
      this.setNativeRange(...args, force);
    } else {
      this.setNativeRange(null);
    }
    this.update(source);
  }
  update() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : emitter_default.sources.USER;
    const oldRange = this.lastRange;
    const [lastRange, nativeRange] = this.getRange();
    this.lastRange = lastRange;
    this.lastNative = nativeRange;
    if (this.lastRange != null) {
      this.savedRange = this.lastRange;
    }
    if (!isEqual_default(oldRange, this.lastRange)) {
      if (!this.composing && nativeRange != null && nativeRange.native.collapsed && nativeRange.start.node !== this.cursor.textNode) {
        const range = this.cursor.restore();
        if (range) {
          this.setNativeRange(range.startNode, range.startOffset, range.endNode, range.endOffset);
        }
      }
      const args = [emitter_default.events.SELECTION_CHANGE, cloneDeep_default(this.lastRange), cloneDeep_default(oldRange), source];
      this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
      if (source !== emitter_default.sources.SILENT) {
        this.emitter.emit(...args);
      }
    }
  }
};
function contains(parent, descendant) {
  try {
    descendant.parentNode;
  } catch (e) {
    return false;
  }
  return parent.contains(descendant);
}
var selection_default = Selection;

// ../../node_modules/quill/core/editor.js
var ASCII = /^[ -~]*$/;
var Editor = class {
  constructor(scroll) {
    this.scroll = scroll;
    this.delta = this.getDelta();
  }
  applyDelta(delta) {
    this.scroll.update();
    let scrollLength = this.scroll.length();
    this.scroll.batchStart();
    const normalizedDelta = normalizeDelta(delta);
    const deleteDelta = new import_quill_delta2.default();
    const normalizedOps = splitOpLines(normalizedDelta.ops.slice());
    normalizedOps.reduce((index, op) => {
      const length2 = import_quill_delta2.Op.length(op);
      let attributes = op.attributes || {};
      let isImplicitNewlinePrepended = false;
      let isImplicitNewlineAppended = false;
      if (op.insert != null) {
        deleteDelta.retain(length2);
        if (typeof op.insert === "string") {
          const text2 = op.insert;
          isImplicitNewlineAppended = !text2.endsWith("\n") && (scrollLength <= index || !!this.scroll.descendant(BlockEmbed, index)[0]);
          this.scroll.insertAt(index, text2);
          const [line, offset] = this.scroll.line(index);
          let formats = merge_default({}, bubbleFormats(line));
          if (line instanceof Block) {
            const [leaf] = line.descendant(LeafBlot$1, offset);
            if (leaf) {
              formats = merge_default(formats, bubbleFormats(leaf));
            }
          }
          attributes = import_quill_delta2.AttributeMap.diff(formats, attributes) || {};
        } else if (typeof op.insert === "object") {
          const key = Object.keys(op.insert)[0];
          if (key == null)
            return index;
          const isInlineEmbed = this.scroll.query(key, Scope.INLINE) != null;
          if (isInlineEmbed) {
            if (scrollLength <= index || !!this.scroll.descendant(BlockEmbed, index)[0]) {
              isImplicitNewlineAppended = true;
            }
          } else if (index > 0) {
            const [leaf, offset] = this.scroll.descendant(LeafBlot$1, index - 1);
            if (leaf instanceof Text2) {
              const text2 = leaf.value();
              if (text2[offset] !== "\n") {
                isImplicitNewlinePrepended = true;
              }
            } else if (leaf instanceof EmbedBlot$1 && leaf.statics.scope === Scope.INLINE_BLOT) {
              isImplicitNewlinePrepended = true;
            }
          }
          this.scroll.insertAt(index, key, op.insert[key]);
          if (isInlineEmbed) {
            const [leaf] = this.scroll.descendant(LeafBlot$1, index);
            if (leaf) {
              const formats = merge_default({}, bubbleFormats(leaf));
              attributes = import_quill_delta2.AttributeMap.diff(formats, attributes) || {};
            }
          }
        }
        scrollLength += length2;
      } else {
        deleteDelta.push(op);
        if (op.retain !== null && typeof op.retain === "object") {
          const key = Object.keys(op.retain)[0];
          if (key == null)
            return index;
          this.scroll.updateEmbedAt(index, key, op.retain[key]);
        }
      }
      Object.keys(attributes).forEach((name) => {
        this.scroll.formatAt(index, length2, name, attributes[name]);
      });
      const prependedLength = isImplicitNewlinePrepended ? 1 : 0;
      const addedLength = isImplicitNewlineAppended ? 1 : 0;
      scrollLength += prependedLength + addedLength;
      deleteDelta.retain(prependedLength);
      deleteDelta.delete(addedLength);
      return index + length2 + prependedLength + addedLength;
    }, 0);
    deleteDelta.reduce((index, op) => {
      if (typeof op.delete === "number") {
        this.scroll.deleteAt(index, op.delete);
        return index;
      }
      return index + import_quill_delta2.Op.length(op);
    }, 0);
    this.scroll.batchEnd();
    this.scroll.optimize();
    return this.update(normalizedDelta);
  }
  deleteText(index, length2) {
    this.scroll.deleteAt(index, length2);
    return this.update(new import_quill_delta2.default().retain(index).delete(length2));
  }
  formatLine(index, length2) {
    let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    this.scroll.update();
    Object.keys(formats).forEach((format2) => {
      this.scroll.lines(index, Math.max(length2, 1)).forEach((line) => {
        line.format(format2, formats[format2]);
      });
    });
    this.scroll.optimize();
    const delta = new import_quill_delta2.default().retain(index).retain(length2, cloneDeep_default(formats));
    return this.update(delta);
  }
  formatText(index, length2) {
    let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    Object.keys(formats).forEach((format2) => {
      this.scroll.formatAt(index, length2, format2, formats[format2]);
    });
    const delta = new import_quill_delta2.default().retain(index).retain(length2, cloneDeep_default(formats));
    return this.update(delta);
  }
  getContents(index, length2) {
    return this.delta.slice(index, index + length2);
  }
  getDelta() {
    return this.scroll.lines().reduce((delta, line) => {
      return delta.concat(line.delta());
    }, new import_quill_delta2.default());
  }
  getFormat(index) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let lines = [];
    let leaves = [];
    if (length2 === 0) {
      this.scroll.path(index).forEach((path) => {
        const [blot] = path;
        if (blot instanceof Block) {
          lines.push(blot);
        } else if (blot instanceof LeafBlot$1) {
          leaves.push(blot);
        }
      });
    } else {
      lines = this.scroll.lines(index, length2);
      leaves = this.scroll.descendants(LeafBlot$1, index, length2);
    }
    const [lineFormats, leafFormats] = [lines, leaves].map((blots) => {
      const blot = blots.shift();
      if (blot == null)
        return {};
      let formats = bubbleFormats(blot);
      while (Object.keys(formats).length > 0) {
        const blot2 = blots.shift();
        if (blot2 == null)
          return formats;
        formats = combineFormats(bubbleFormats(blot2), formats);
      }
      return formats;
    });
    return {
      ...lineFormats,
      ...leafFormats
    };
  }
  getHTML(index, length2) {
    const [line, lineOffset] = this.scroll.line(index);
    if (line) {
      const lineLength = line.length();
      const isWithinLine = line.length() >= lineOffset + length2;
      if (isWithinLine && !(lineOffset === 0 && length2 === lineLength)) {
        return convertHTML(line, lineOffset, length2, true);
      }
      return convertHTML(this.scroll, index, length2, true);
    }
    return "";
  }
  getText(index, length2) {
    return this.getContents(index, length2).filter((op) => typeof op.insert === "string").map((op) => op.insert).join("");
  }
  insertContents(index, contents) {
    const normalizedDelta = normalizeDelta(contents);
    const change = new import_quill_delta2.default().retain(index).concat(normalizedDelta);
    this.scroll.insertContents(index, normalizedDelta);
    return this.update(change);
  }
  insertEmbed(index, embed, value2) {
    this.scroll.insertAt(index, embed, value2);
    return this.update(new import_quill_delta2.default().retain(index).insert({
      [embed]: value2
    }));
  }
  insertText(index, text2) {
    let formats = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    text2 = text2.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    this.scroll.insertAt(index, text2);
    Object.keys(formats).forEach((format2) => {
      this.scroll.formatAt(index, text2.length, format2, formats[format2]);
    });
    return this.update(new import_quill_delta2.default().retain(index).insert(text2, cloneDeep_default(formats)));
  }
  isBlank() {
    if (this.scroll.children.length === 0)
      return true;
    if (this.scroll.children.length > 1)
      return false;
    const blot = this.scroll.children.head;
    if (blot?.statics.blotName !== Block.blotName)
      return false;
    const block = blot;
    if (block.children.length > 1)
      return false;
    return block.children.head instanceof break_default;
  }
  removeFormat(index, length2) {
    const text2 = this.getText(index, length2);
    const [line, offset] = this.scroll.line(index + length2);
    let suffixLength = 0;
    let suffix = new import_quill_delta2.default();
    if (line != null) {
      suffixLength = line.length() - offset;
      suffix = line.delta().slice(offset, offset + suffixLength - 1).insert("\n");
    }
    const contents = this.getContents(index, length2 + suffixLength);
    const diff = contents.diff(new import_quill_delta2.default().insert(text2).concat(suffix));
    const delta = new import_quill_delta2.default().retain(index).concat(diff);
    return this.applyDelta(delta);
  }
  update(change) {
    let mutations = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
    let selectionInfo = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : void 0;
    const oldDelta = this.delta;
    if (mutations.length === 1 && mutations[0].type === "characterData" && // @ts-expect-error Fix me later
    mutations[0].target.data.match(ASCII) && this.scroll.find(mutations[0].target)) {
      const textBlot = this.scroll.find(mutations[0].target);
      const formats = bubbleFormats(textBlot);
      const index = textBlot.offset(this.scroll);
      const oldValue = mutations[0].oldValue.replace(cursor_default.CONTENTS, "");
      const oldText = new import_quill_delta2.default().insert(oldValue);
      const newText = new import_quill_delta2.default().insert(textBlot.value());
      const relativeSelectionInfo = selectionInfo && {
        oldRange: shiftRange(selectionInfo.oldRange, -index),
        newRange: shiftRange(selectionInfo.newRange, -index)
      };
      const diffDelta = new import_quill_delta2.default().retain(index).concat(oldText.diff(newText, relativeSelectionInfo));
      change = diffDelta.reduce((delta, op) => {
        if (op.insert) {
          return delta.insert(op.insert, formats);
        }
        return delta.push(op);
      }, new import_quill_delta2.default());
      this.delta = oldDelta.compose(change);
    } else {
      this.delta = this.getDelta();
      if (!change || !isEqual_default(oldDelta.compose(change), this.delta)) {
        change = oldDelta.diff(this.delta, selectionInfo);
      }
    }
    return change;
  }
};
function convertListHTML(items, lastIndent, types) {
  if (items.length === 0) {
    const [endTag2] = getListType(types.pop());
    if (lastIndent <= 0) {
      return `</li></${endTag2}>`;
    }
    return `</li></${endTag2}>${convertListHTML([], lastIndent - 1, types)}`;
  }
  const [{
    child,
    offset,
    length: length2,
    indent,
    type
  }, ...rest] = items;
  const [tag, attribute] = getListType(type);
  if (indent > lastIndent) {
    types.push(type);
    if (indent === lastIndent + 1) {
      return `<${tag}><li${attribute}>${convertHTML(child, offset, length2)}${convertListHTML(rest, indent, types)}`;
    }
    return `<${tag}><li>${convertListHTML(items, lastIndent + 1, types)}`;
  }
  const previousType = types[types.length - 1];
  if (indent === lastIndent && type === previousType) {
    return `</li><li${attribute}>${convertHTML(child, offset, length2)}${convertListHTML(rest, indent, types)}`;
  }
  const [endTag] = getListType(types.pop());
  return `</li></${endTag}>${convertListHTML(items, lastIndent - 1, types)}`;
}
function convertHTML(blot, index, length2) {
  let isRoot = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : false;
  if ("html" in blot && typeof blot.html === "function") {
    return blot.html(index, length2);
  }
  if (blot instanceof Text2) {
    return escapeText(blot.value().slice(index, index + length2));
  }
  if (blot instanceof ParentBlot$1) {
    if (blot.statics.blotName === "list-container") {
      const items = [];
      blot.children.forEachAt(index, length2, (child, offset, childLength) => {
        const formats = "formats" in child && typeof child.formats === "function" ? child.formats() : {};
        items.push({
          child,
          offset,
          length: childLength,
          indent: formats.indent || 0,
          type: formats.list
        });
      });
      return convertListHTML(items, -1, []);
    }
    const parts = [];
    blot.children.forEachAt(index, length2, (child, offset, childLength) => {
      parts.push(convertHTML(child, offset, childLength));
    });
    if (isRoot || blot.statics.blotName === "list") {
      return parts.join("");
    }
    const {
      outerHTML,
      innerHTML
    } = blot.domNode;
    const [start2, end] = outerHTML.split(`>${innerHTML}<`);
    if (start2 === "<table") {
      return `<table style="border: 1px solid #000;">${parts.join("")}<${end}`;
    }
    return `${start2}>${parts.join("")}<${end}`;
  }
  return blot.domNode instanceof Element ? blot.domNode.outerHTML : "";
}
function combineFormats(formats, combined) {
  return Object.keys(combined).reduce((merged, name) => {
    if (formats[name] == null)
      return merged;
    const combinedValue = combined[name];
    if (combinedValue === formats[name]) {
      merged[name] = combinedValue;
    } else if (Array.isArray(combinedValue)) {
      if (combinedValue.indexOf(formats[name]) < 0) {
        merged[name] = combinedValue.concat([formats[name]]);
      } else {
        merged[name] = combinedValue;
      }
    } else {
      merged[name] = [combinedValue, formats[name]];
    }
    return merged;
  }, {});
}
function getListType(type) {
  const tag = type === "ordered" ? "ol" : "ul";
  switch (type) {
    case "checked":
      return [tag, ' data-list="checked"'];
    case "unchecked":
      return [tag, ' data-list="unchecked"'];
    default:
      return [tag, ""];
  }
}
function normalizeDelta(delta) {
  return delta.reduce((normalizedDelta, op) => {
    if (typeof op.insert === "string") {
      const text2 = op.insert.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
      return normalizedDelta.insert(text2, op.attributes);
    }
    return normalizedDelta.push(op);
  }, new import_quill_delta2.default());
}
function shiftRange(_ref, amount) {
  let {
    index,
    length: length2
  } = _ref;
  return new Range(index + amount, length2);
}
function splitOpLines(ops) {
  const split3 = [];
  ops.forEach((op) => {
    if (typeof op.insert === "string") {
      const lines = op.insert.split("\n");
      lines.forEach((line, index) => {
        if (index)
          split3.push({
            insert: "\n",
            attributes: op.attributes
          });
        if (line)
          split3.push({
            insert: line,
            attributes: op.attributes
          });
      });
    } else {
      split3.push(op);
    }
  });
  return split3;
}
var editor_default = Editor;

// ../../node_modules/quill/core/module.js
var Module = class {
  static DEFAULTS = {};
  constructor(quill) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.quill = quill;
    this.options = options;
  }
};
var module_default = Module;

// ../../node_modules/quill/blots/embed.js
var GUARD_TEXT = "\uFEFF";
var Embed = class extends EmbedBlot$1 {
  constructor(scroll, node) {
    super(scroll, node);
    this.contentNode = document.createElement("span");
    this.contentNode.setAttribute("contenteditable", "false");
    Array.from(this.domNode.childNodes).forEach((childNode) => {
      this.contentNode.appendChild(childNode);
    });
    this.leftGuard = document.createTextNode(GUARD_TEXT);
    this.rightGuard = document.createTextNode(GUARD_TEXT);
    this.domNode.appendChild(this.leftGuard);
    this.domNode.appendChild(this.contentNode);
    this.domNode.appendChild(this.rightGuard);
  }
  index(node, offset) {
    if (node === this.leftGuard)
      return 0;
    if (node === this.rightGuard)
      return 1;
    return super.index(node, offset);
  }
  restore(node) {
    let range = null;
    let textNode;
    const text2 = node.data.split(GUARD_TEXT).join("");
    if (node === this.leftGuard) {
      if (this.prev instanceof Text2) {
        const prevLength = this.prev.length();
        this.prev.insertAt(prevLength, text2);
        range = {
          startNode: this.prev.domNode,
          startOffset: prevLength + text2.length
        };
      } else {
        textNode = document.createTextNode(text2);
        this.parent.insertBefore(this.scroll.create(textNode), this);
        range = {
          startNode: textNode,
          startOffset: text2.length
        };
      }
    } else if (node === this.rightGuard) {
      if (this.next instanceof Text2) {
        this.next.insertAt(0, text2);
        range = {
          startNode: this.next.domNode,
          startOffset: text2.length
        };
      } else {
        textNode = document.createTextNode(text2);
        this.parent.insertBefore(this.scroll.create(textNode), this.next);
        range = {
          startNode: textNode,
          startOffset: text2.length
        };
      }
    }
    node.data = GUARD_TEXT;
    return range;
  }
  update(mutations, context) {
    mutations.forEach((mutation) => {
      if (mutation.type === "characterData" && (mutation.target === this.leftGuard || mutation.target === this.rightGuard)) {
        const range = this.restore(mutation.target);
        if (range)
          context.range = range;
      }
    });
  }
};
var embed_default = Embed;

// ../../node_modules/quill/core/composition.js
var Composition = class {
  isComposing = false;
  constructor(scroll, emitter) {
    this.scroll = scroll;
    this.emitter = emitter;
    this.setupListeners();
  }
  setupListeners() {
    this.scroll.domNode.addEventListener("compositionstart", (event) => {
      if (!this.isComposing) {
        this.handleCompositionStart(event);
      }
    });
    this.scroll.domNode.addEventListener("compositionend", (event) => {
      if (this.isComposing) {
        queueMicrotask(() => {
          this.handleCompositionEnd(event);
        });
      }
    });
  }
  handleCompositionStart(event) {
    const blot = event.target instanceof Node ? this.scroll.find(event.target, true) : null;
    if (blot && !(blot instanceof embed_default)) {
      this.emitter.emit(emitter_default.events.COMPOSITION_BEFORE_START, event);
      this.scroll.batchStart();
      this.emitter.emit(emitter_default.events.COMPOSITION_START, event);
      this.isComposing = true;
    }
  }
  handleCompositionEnd(event) {
    this.emitter.emit(emitter_default.events.COMPOSITION_BEFORE_END, event);
    this.scroll.batchEnd();
    this.emitter.emit(emitter_default.events.COMPOSITION_END, event);
    this.isComposing = false;
  }
};
var composition_default = Composition;

// ../../node_modules/quill/core/theme.js
var Theme = class _Theme {
  static DEFAULTS = {
    modules: {}
  };
  static themes = {
    default: _Theme
  };
  modules = {};
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
  }
  init() {
    Object.keys(this.options.modules).forEach((name) => {
      if (this.modules[name] == null) {
        this.addModule(name);
      }
    });
  }
  addModule(name) {
    const ModuleClass = this.quill.constructor.import(`modules/${name}`);
    this.modules[name] = new ModuleClass(this.quill, this.options.modules[name] || {});
    return this.modules[name];
  }
};
var theme_default = Theme;

// ../../node_modules/quill/core/utils/scrollRectIntoView.js
var getParentElement = (element) => element.parentElement || element.getRootNode().host || null;
var getElementRect = (element) => {
  const rect = element.getBoundingClientRect();
  const scaleX = "offsetWidth" in element && Math.abs(rect.width) / element.offsetWidth || 1;
  const scaleY = "offsetHeight" in element && Math.abs(rect.height) / element.offsetHeight || 1;
  return {
    top: rect.top,
    right: rect.left + element.clientWidth * scaleX,
    bottom: rect.top + element.clientHeight * scaleY,
    left: rect.left
  };
};
var paddingValueToInt = (value2) => {
  const number = parseInt(value2, 10);
  return Number.isNaN(number) ? 0 : number;
};
var getScrollDistance = (targetStart, targetEnd, scrollStart, scrollEnd, scrollPaddingStart, scrollPaddingEnd) => {
  if (targetStart < scrollStart && targetEnd > scrollEnd) {
    return 0;
  }
  if (targetStart < scrollStart) {
    return -(scrollStart - targetStart + scrollPaddingStart);
  }
  if (targetEnd > scrollEnd) {
    return targetEnd - targetStart > scrollEnd - scrollStart ? targetStart + scrollPaddingStart - scrollStart : targetEnd - scrollEnd + scrollPaddingEnd;
  }
  return 0;
};
var scrollRectIntoView = (root2, targetRect) => {
  const document3 = root2.ownerDocument;
  let rect = targetRect;
  let current = root2;
  while (current) {
    const isDocumentBody = current === document3.body;
    const bounding = isDocumentBody ? {
      top: 0,
      right: window.visualViewport?.width ?? document3.documentElement.clientWidth,
      bottom: window.visualViewport?.height ?? document3.documentElement.clientHeight,
      left: 0
    } : getElementRect(current);
    const style2 = getComputedStyle(current);
    const scrollDistanceX = getScrollDistance(rect.left, rect.right, bounding.left, bounding.right, paddingValueToInt(style2.scrollPaddingLeft), paddingValueToInt(style2.scrollPaddingRight));
    const scrollDistanceY = getScrollDistance(rect.top, rect.bottom, bounding.top, bounding.bottom, paddingValueToInt(style2.scrollPaddingTop), paddingValueToInt(style2.scrollPaddingBottom));
    if (scrollDistanceX || scrollDistanceY) {
      if (isDocumentBody) {
        document3.defaultView?.scrollBy(scrollDistanceX, scrollDistanceY);
      } else {
        const {
          scrollLeft,
          scrollTop
        } = current;
        if (scrollDistanceY) {
          current.scrollTop += scrollDistanceY;
        }
        if (scrollDistanceX) {
          current.scrollLeft += scrollDistanceX;
        }
        const scrolledLeft = current.scrollLeft - scrollLeft;
        const scrolledTop = current.scrollTop - scrollTop;
        rect = {
          left: rect.left - scrolledLeft,
          top: rect.top - scrolledTop,
          right: rect.right - scrolledLeft,
          bottom: rect.bottom - scrolledTop
        };
      }
    }
    current = isDocumentBody || style2.position === "fixed" ? null : getParentElement(current);
  }
};
var scrollRectIntoView_default = scrollRectIntoView;

// ../../node_modules/quill/core/utils/createRegistryWithFormats.js
var MAX_REGISTER_ITERATIONS = 100;
var CORE_FORMATS = ["block", "break", "cursor", "inline", "scroll", "text"];
var createRegistryWithFormats = (formats, sourceRegistry, debug7) => {
  const registry = new Registry();
  CORE_FORMATS.forEach((name) => {
    const coreBlot = sourceRegistry.query(name);
    if (coreBlot)
      registry.register(coreBlot);
  });
  formats.forEach((name) => {
    let format2 = sourceRegistry.query(name);
    if (!format2) {
      debug7.error(`Cannot register "${name}" specified in "formats" config. Are you sure it was registered?`);
    }
    let iterations = 0;
    while (format2) {
      registry.register(format2);
      format2 = "blotName" in format2 ? format2.requiredContainer ?? null : null;
      iterations += 1;
      if (iterations > MAX_REGISTER_ITERATIONS) {
        debug7.error(`Cycle detected in registering blot requiredContainer: "${name}"`);
        break;
      }
    }
  });
  return registry;
};
var createRegistryWithFormats_default = createRegistryWithFormats;

// ../../node_modules/quill/core/quill.js
var debug4 = logger_default("quill");
var globalRegistry = new Registry();
ParentBlot$1.uiClass = "ql-ui";
var Quill = class _Quill {
  static DEFAULTS = {
    bounds: null,
    modules: {
      clipboard: true,
      keyboard: true,
      history: true,
      uploader: true
    },
    placeholder: "",
    readOnly: false,
    registry: globalRegistry,
    theme: "default"
  };
  static events = emitter_default.events;
  static sources = emitter_default.sources;
  static version = false ? "dev" : "2.0.2";
  static imports = {
    delta: import_quill_delta3.default,
    parchment: parchment_exports,
    "core/module": module_default,
    "core/theme": theme_default
  };
  static debug(limit) {
    if (limit === true) {
      limit = "log";
    }
    logger_default.level(limit);
  }
  static find(node) {
    let bubble = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    return instances_default.get(node) || globalRegistry.find(node, bubble);
  }
  static import(name) {
    if (this.imports[name] == null) {
      debug4.error(`Cannot import ${name}. Are you sure it was registered?`);
    }
    return this.imports[name];
  }
  static register() {
    if (typeof (arguments.length <= 0 ? void 0 : arguments[0]) !== "string") {
      const target = arguments.length <= 0 ? void 0 : arguments[0];
      const overwrite = !!(arguments.length <= 1 ? void 0 : arguments[1]);
      const name = "attrName" in target ? target.attrName : target.blotName;
      if (typeof name === "string") {
        this.register(`formats/${name}`, target, overwrite);
      } else {
        Object.keys(target).forEach((key) => {
          this.register(key, target[key], overwrite);
        });
      }
    } else {
      const path = arguments.length <= 0 ? void 0 : arguments[0];
      const target = arguments.length <= 1 ? void 0 : arguments[1];
      const overwrite = !!(arguments.length <= 2 ? void 0 : arguments[2]);
      if (this.imports[path] != null && !overwrite) {
        debug4.warn(`Overwriting ${path} with`, target);
      }
      this.imports[path] = target;
      if ((path.startsWith("blots/") || path.startsWith("formats/")) && target && typeof target !== "boolean" && target.blotName !== "abstract") {
        globalRegistry.register(target);
      }
      if (typeof target.register === "function") {
        target.register(globalRegistry);
      }
    }
  }
  constructor(container) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    this.options = expandConfig(container, options);
    this.container = this.options.container;
    if (this.container == null) {
      debug4.error("Invalid Quill container", container);
      return;
    }
    if (this.options.debug) {
      _Quill.debug(this.options.debug);
    }
    const html = this.container.innerHTML.trim();
    this.container.classList.add("ql-container");
    this.container.innerHTML = "";
    instances_default.set(this.container, this);
    this.root = this.addContainer("ql-editor");
    this.root.classList.add("ql-blank");
    this.emitter = new emitter_default();
    const scrollBlotName = ScrollBlot$1.blotName;
    const ScrollBlot2 = this.options.registry.query(scrollBlotName);
    if (!ScrollBlot2 || !("blotName" in ScrollBlot2)) {
      throw new Error(`Cannot initialize Quill without "${scrollBlotName}" blot`);
    }
    this.scroll = new ScrollBlot2(this.options.registry, this.root, {
      emitter: this.emitter
    });
    this.editor = new editor_default(this.scroll);
    this.selection = new selection_default(this.scroll, this.emitter);
    this.composition = new composition_default(this.scroll, this.emitter);
    this.theme = new this.options.theme(this, this.options);
    this.keyboard = this.theme.addModule("keyboard");
    this.clipboard = this.theme.addModule("clipboard");
    this.history = this.theme.addModule("history");
    this.uploader = this.theme.addModule("uploader");
    this.theme.addModule("input");
    this.theme.addModule("uiNode");
    this.theme.init();
    this.emitter.on(emitter_default.events.EDITOR_CHANGE, (type) => {
      if (type === emitter_default.events.TEXT_CHANGE) {
        this.root.classList.toggle("ql-blank", this.editor.isBlank());
      }
    });
    this.emitter.on(emitter_default.events.SCROLL_UPDATE, (source, mutations) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? {
        oldRange,
        newRange
      } : void 0;
      modify.call(this, () => this.editor.update(null, mutations, selectionInfo), source);
    });
    this.emitter.on(emitter_default.events.SCROLL_EMBED_UPDATE, (blot, delta) => {
      const oldRange = this.selection.lastRange;
      const [newRange] = this.selection.getRange();
      const selectionInfo = oldRange && newRange ? {
        oldRange,
        newRange
      } : void 0;
      modify.call(this, () => {
        const change = new import_quill_delta3.default().retain(blot.offset(this)).retain({
          [blot.statics.blotName]: delta
        });
        return this.editor.update(change, [], selectionInfo);
      }, _Quill.sources.USER);
    });
    if (html) {
      const contents = this.clipboard.convert({
        html: `${html}<p><br></p>`,
        text: "\n"
      });
      this.setContents(contents);
    }
    this.history.clear();
    if (this.options.placeholder) {
      this.root.setAttribute("data-placeholder", this.options.placeholder);
    }
    if (this.options.readOnly) {
      this.disable();
    }
    this.allowReadOnlyEdits = false;
  }
  addContainer(container) {
    let refNode = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : null;
    if (typeof container === "string") {
      const className = container;
      container = document.createElement("div");
      container.classList.add(className);
    }
    this.container.insertBefore(container, refNode);
    return container;
  }
  blur() {
    this.selection.setRange(null);
  }
  deleteText(index, length2, source) {
    [index, length2, , source] = overload(index, length2, source);
    return modify.call(this, () => {
      return this.editor.deleteText(index, length2);
    }, source, index, -1 * length2);
  }
  disable() {
    this.enable(false);
  }
  editReadOnly(modifier) {
    this.allowReadOnlyEdits = true;
    const value2 = modifier();
    this.allowReadOnlyEdits = false;
    return value2;
  }
  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    this.scroll.enable(enabled);
    this.container.classList.toggle("ql-disabled", !enabled);
  }
  focus() {
    let options = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    this.selection.focus();
    if (!options.preventScroll) {
      this.scrollSelectionIntoView();
    }
  }
  format(name, value2) {
    let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : emitter_default.sources.API;
    return modify.call(this, () => {
      const range = this.getSelection(true);
      let change = new import_quill_delta3.default();
      if (range == null)
        return change;
      if (this.scroll.query(name, Scope.BLOCK)) {
        change = this.editor.formatLine(range.index, range.length, {
          [name]: value2
        });
      } else if (range.length === 0) {
        this.selection.format(name, value2);
        return change;
      } else {
        change = this.editor.formatText(range.index, range.length, {
          [name]: value2
        });
      }
      this.setSelection(range, emitter_default.sources.SILENT);
      return change;
    }, source);
  }
  formatLine(index, length2, name, value2, source) {
    let formats;
    [index, length2, formats, source] = overload(
      index,
      length2,
      // @ts-expect-error
      name,
      value2,
      source
    );
    return modify.call(this, () => {
      return this.editor.formatLine(index, length2, formats);
    }, source, index, 0);
  }
  formatText(index, length2, name, value2, source) {
    let formats;
    [index, length2, formats, source] = overload(
      // @ts-expect-error
      index,
      length2,
      name,
      value2,
      source
    );
    return modify.call(this, () => {
      return this.editor.formatText(index, length2, formats);
    }, source, index, 0);
  }
  getBounds(index) {
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    let bounds = null;
    if (typeof index === "number") {
      bounds = this.selection.getBounds(index, length2);
    } else {
      bounds = this.selection.getBounds(index.index, index.length);
    }
    if (!bounds)
      return null;
    const containerBounds = this.container.getBoundingClientRect();
    return {
      bottom: bounds.bottom - containerBounds.top,
      height: bounds.height,
      left: bounds.left - containerBounds.left,
      right: bounds.right - containerBounds.left,
      top: bounds.top - containerBounds.top,
      width: bounds.width
    };
  }
  getContents() {
    let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : this.getLength() - index;
    [index, length2] = overload(index, length2);
    return this.editor.getContents(index, length2);
  }
  getFormat() {
    let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : this.getSelection(true);
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
    if (typeof index === "number") {
      return this.editor.getFormat(index, length2);
    }
    return this.editor.getFormat(index.index, index.length);
  }
  getIndex(blot) {
    return blot.offset(this.scroll);
  }
  getLength() {
    return this.scroll.length();
  }
  getLeaf(index) {
    return this.scroll.leaf(index);
  }
  getLine(index) {
    return this.scroll.line(index);
  }
  getLines() {
    let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    if (typeof index !== "number") {
      return this.scroll.lines(index.index, index.length);
    }
    return this.scroll.lines(index, length2);
  }
  getModule(name) {
    return this.theme.modules[name];
  }
  getSelection() {
    let focus = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : false;
    if (focus)
      this.focus();
    this.update();
    return this.selection.getRange()[0];
  }
  getSemanticHTML() {
    let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length2 = arguments.length > 1 ? arguments[1] : void 0;
    if (typeof index === "number") {
      length2 = length2 ?? this.getLength() - index;
    }
    [index, length2] = overload(index, length2);
    return this.editor.getHTML(index, length2);
  }
  getText() {
    let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length2 = arguments.length > 1 ? arguments[1] : void 0;
    if (typeof index === "number") {
      length2 = length2 ?? this.getLength() - index;
    }
    [index, length2] = overload(index, length2);
    return this.editor.getText(index, length2);
  }
  hasFocus() {
    return this.selection.hasFocus();
  }
  insertEmbed(index, embed, value2) {
    let source = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : _Quill.sources.API;
    return modify.call(this, () => {
      return this.editor.insertEmbed(index, embed, value2);
    }, source, index);
  }
  insertText(index, text2, name, value2, source) {
    let formats;
    [index, , formats, source] = overload(index, 0, name, value2, source);
    return modify.call(this, () => {
      return this.editor.insertText(index, text2, formats);
    }, source, index, text2.length);
  }
  isEnabled() {
    return this.scroll.isEnabled();
  }
  off() {
    return this.emitter.off(...arguments);
  }
  on() {
    return this.emitter.on(...arguments);
  }
  once() {
    return this.emitter.once(...arguments);
  }
  removeFormat(index, length2, source) {
    [index, length2, , source] = overload(index, length2, source);
    return modify.call(this, () => {
      return this.editor.removeFormat(index, length2);
    }, source, index);
  }
  scrollRectIntoView(rect) {
    scrollRectIntoView_default(this.root, rect);
  }
  /**
   * @deprecated Use Quill#scrollSelectionIntoView() instead.
   */
  scrollIntoView() {
    console.warn("Quill#scrollIntoView() has been deprecated and will be removed in the near future. Please use Quill#scrollSelectionIntoView() instead.");
    this.scrollSelectionIntoView();
  }
  /**
   * Scroll the current selection into the visible area.
   * If the selection is already visible, no scrolling will occur.
   */
  scrollSelectionIntoView() {
    const range = this.selection.lastRange;
    const bounds = range && this.selection.getBounds(range.index, range.length);
    if (bounds) {
      this.scrollRectIntoView(bounds);
    }
  }
  setContents(delta) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : emitter_default.sources.API;
    return modify.call(this, () => {
      delta = new import_quill_delta3.default(delta);
      const length2 = this.getLength();
      const delete1 = this.editor.deleteText(0, length2);
      const applied = this.editor.insertContents(0, delta);
      const delete2 = this.editor.deleteText(this.getLength() - 1, 1);
      return delete1.compose(applied).compose(delete2);
    }, source);
  }
  setSelection(index, length2, source) {
    if (index == null) {
      this.selection.setRange(null, length2 || _Quill.sources.API);
    } else {
      [index, length2, , source] = overload(index, length2, source);
      this.selection.setRange(new Range(Math.max(0, index), length2), source);
      if (source !== emitter_default.sources.SILENT) {
        this.scrollSelectionIntoView();
      }
    }
  }
  setText(text2) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : emitter_default.sources.API;
    const delta = new import_quill_delta3.default().insert(text2);
    return this.setContents(delta, source);
  }
  update() {
    let source = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : emitter_default.sources.USER;
    const change = this.scroll.update(source);
    this.selection.update(source);
    return change;
  }
  updateContents(delta) {
    let source = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : emitter_default.sources.API;
    return modify.call(this, () => {
      delta = new import_quill_delta3.default(delta);
      return this.editor.applyDelta(delta);
    }, source, true);
  }
};
function resolveSelector(selector) {
  return typeof selector === "string" ? document.querySelector(selector) : selector;
}
function expandModuleConfig(config4) {
  return Object.entries(config4 ?? {}).reduce((expanded, _ref) => {
    let [key, value2] = _ref;
    return {
      ...expanded,
      [key]: value2 === true ? {} : value2
    };
  }, {});
}
function omitUndefinedValuesFromOptions(obj) {
  return Object.fromEntries(Object.entries(obj).filter((entry) => entry[1] !== void 0));
}
function expandConfig(containerOrSelector, options) {
  const container = resolveSelector(containerOrSelector);
  if (!container) {
    throw new Error("Invalid Quill container");
  }
  const shouldUseDefaultTheme = !options.theme || options.theme === Quill.DEFAULTS.theme;
  const theme = shouldUseDefaultTheme ? theme_default : Quill.import(`themes/${options.theme}`);
  if (!theme) {
    throw new Error(`Invalid theme ${options.theme}. Did you register it?`);
  }
  const {
    modules: quillModuleDefaults,
    ...quillDefaults
  } = Quill.DEFAULTS;
  const {
    modules: themeModuleDefaults,
    ...themeDefaults
  } = theme.DEFAULTS;
  let userModuleOptions = expandModuleConfig(options.modules);
  if (userModuleOptions != null && userModuleOptions.toolbar && userModuleOptions.toolbar.constructor !== Object) {
    userModuleOptions = {
      ...userModuleOptions,
      toolbar: {
        container: userModuleOptions.toolbar
      }
    };
  }
  const modules = merge_default({}, expandModuleConfig(quillModuleDefaults), expandModuleConfig(themeModuleDefaults), userModuleOptions);
  const config4 = {
    ...quillDefaults,
    ...omitUndefinedValuesFromOptions(themeDefaults),
    ...omitUndefinedValuesFromOptions(options)
  };
  let registry = options.registry;
  if (registry) {
    if (options.formats) {
      debug4.warn('Ignoring "formats" option because "registry" is specified');
    }
  } else {
    registry = options.formats ? createRegistryWithFormats_default(options.formats, config4.registry, debug4) : config4.registry;
  }
  return {
    ...config4,
    registry,
    container,
    theme,
    modules: Object.entries(modules).reduce((modulesWithDefaults, _ref2) => {
      let [name, value2] = _ref2;
      if (!value2)
        return modulesWithDefaults;
      const moduleClass = Quill.import(`modules/${name}`);
      if (moduleClass == null) {
        debug4.error(`Cannot load ${name} module. Are you sure you registered it?`);
        return modulesWithDefaults;
      }
      return {
        ...modulesWithDefaults,
        // @ts-expect-error
        [name]: merge_default({}, moduleClass.DEFAULTS || {}, value2)
      };
    }, {}),
    bounds: resolveSelector(config4.bounds)
  };
}
function modify(modifier, source, index, shift) {
  if (!this.isEnabled() && source === emitter_default.sources.USER && !this.allowReadOnlyEdits) {
    return new import_quill_delta3.default();
  }
  let range = index == null ? null : this.getSelection();
  const oldDelta = this.editor.delta;
  const change = modifier();
  if (range != null) {
    if (index === true) {
      index = range.index;
    }
    if (shift == null) {
      range = shiftRange2(range, change, source);
    } else if (shift !== 0) {
      range = shiftRange2(range, index, shift, source);
    }
    this.setSelection(range, emitter_default.sources.SILENT);
  }
  if (change.length() > 0) {
    const args = [emitter_default.events.TEXT_CHANGE, change, oldDelta, source];
    this.emitter.emit(emitter_default.events.EDITOR_CHANGE, ...args);
    if (source !== emitter_default.sources.SILENT) {
      this.emitter.emit(...args);
    }
  }
  return change;
}
function overload(index, length2, name, value2, source) {
  let formats = {};
  if (typeof index.index === "number" && typeof index.length === "number") {
    if (typeof length2 !== "number") {
      source = value2;
      value2 = name;
      name = length2;
      length2 = index.length;
      index = index.index;
    } else {
      length2 = index.length;
      index = index.index;
    }
  } else if (typeof length2 !== "number") {
    source = value2;
    value2 = name;
    name = length2;
    length2 = 0;
  }
  if (typeof name === "object") {
    formats = name;
    source = value2;
  } else if (typeof name === "string") {
    if (value2 != null) {
      formats[name] = value2;
    } else {
      source = name;
    }
  }
  source = source || emitter_default.sources.API;
  return [index, length2, formats, source];
}
function shiftRange2(range, index, lengthOrSource, source) {
  const length2 = typeof lengthOrSource === "number" ? lengthOrSource : 0;
  if (range == null)
    return null;
  let start2;
  let end;
  if (index && typeof index.transformPosition === "function") {
    [start2, end] = [range.index, range.index + range.length].map((pos) => (
      // @ts-expect-error -- TODO: add a better type guard around `index`
      index.transformPosition(pos, source !== emitter_default.sources.USER)
    ));
  } else {
    [start2, end] = [range.index, range.index + range.length].map((pos) => {
      if (pos < index || pos === index && source === emitter_default.sources.USER)
        return pos;
      if (length2 >= 0) {
        return pos + length2;
      }
      return Math.max(index, pos + length2);
    });
  }
  return new Range(start2, end - start2);
}

// ../../node_modules/quill/blots/container.js
var Container = class extends ContainerBlot$1 {
};
var container_default = Container;

// ../../node_modules/quill/blots/scroll.js
var import_quill_delta4 = __toESM(require_Delta(), 1);
function isLine(blot) {
  return blot instanceof Block || blot instanceof BlockEmbed;
}
function isUpdatable(blot) {
  return typeof blot.updateContent === "function";
}
var Scroll = class extends ScrollBlot$1 {
  static blotName = "scroll";
  static className = "ql-editor";
  static tagName = "DIV";
  static defaultChild = Block;
  static allowedChildren = [Block, BlockEmbed, container_default];
  constructor(registry, domNode, _ref) {
    let {
      emitter
    } = _ref;
    super(registry, domNode);
    this.emitter = emitter;
    this.batch = false;
    this.optimize();
    this.enable();
    this.domNode.addEventListener("dragstart", (e) => this.handleDragStart(e));
  }
  batchStart() {
    if (!Array.isArray(this.batch)) {
      this.batch = [];
    }
  }
  batchEnd() {
    if (!this.batch)
      return;
    const mutations = this.batch;
    this.batch = false;
    this.update(mutations);
  }
  emitMount(blot) {
    this.emitter.emit(emitter_default.events.SCROLL_BLOT_MOUNT, blot);
  }
  emitUnmount(blot) {
    this.emitter.emit(emitter_default.events.SCROLL_BLOT_UNMOUNT, blot);
  }
  emitEmbedUpdate(blot, change) {
    this.emitter.emit(emitter_default.events.SCROLL_EMBED_UPDATE, blot, change);
  }
  deleteAt(index, length2) {
    const [first, offset] = this.line(index);
    const [last] = this.line(index + length2);
    super.deleteAt(index, length2);
    if (last != null && first !== last && offset > 0) {
      if (first instanceof BlockEmbed || last instanceof BlockEmbed) {
        this.optimize();
        return;
      }
      const ref = last.children.head instanceof break_default ? null : last.children.head;
      first.moveChildren(last, ref);
      first.remove();
    }
    this.optimize();
  }
  enable() {
    let enabled = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true;
    this.domNode.setAttribute("contenteditable", enabled ? "true" : "false");
  }
  formatAt(index, length2, format2, value2) {
    super.formatAt(index, length2, format2, value2);
    this.optimize();
  }
  insertAt(index, value2, def) {
    if (index >= this.length()) {
      if (def == null || this.scroll.query(value2, Scope.BLOCK) == null) {
        const blot = this.scroll.create(this.statics.defaultChild.blotName);
        this.appendChild(blot);
        if (def == null && value2.endsWith("\n")) {
          blot.insertAt(0, value2.slice(0, -1), def);
        } else {
          blot.insertAt(0, value2, def);
        }
      } else {
        const embed = this.scroll.create(value2, def);
        this.appendChild(embed);
      }
    } else {
      super.insertAt(index, value2, def);
    }
    this.optimize();
  }
  insertBefore(blot, ref) {
    if (blot.statics.scope === Scope.INLINE_BLOT) {
      const wrapper = this.scroll.create(this.statics.defaultChild.blotName);
      wrapper.appendChild(blot);
      super.insertBefore(wrapper, ref);
    } else {
      super.insertBefore(blot, ref);
    }
  }
  insertContents(index, delta) {
    const renderBlocks = this.deltaToRenderBlocks(delta.concat(new import_quill_delta4.default().insert("\n")));
    const last = renderBlocks.pop();
    if (last == null)
      return;
    this.batchStart();
    const first = renderBlocks.shift();
    if (first) {
      const shouldInsertNewlineChar = first.type === "block" && (first.delta.length() === 0 || !this.descendant(BlockEmbed, index)[0] && index < this.length());
      const delta2 = first.type === "block" ? first.delta : new import_quill_delta4.default().insert({
        [first.key]: first.value
      });
      insertInlineContents(this, index, delta2);
      const newlineCharLength = first.type === "block" ? 1 : 0;
      const lineEndIndex = index + delta2.length() + newlineCharLength;
      if (shouldInsertNewlineChar) {
        this.insertAt(lineEndIndex - 1, "\n");
      }
      const formats = bubbleFormats(this.line(index)[0]);
      const attributes = import_quill_delta4.AttributeMap.diff(formats, first.attributes) || {};
      Object.keys(attributes).forEach((name) => {
        this.formatAt(lineEndIndex - 1, 1, name, attributes[name]);
      });
      index = lineEndIndex;
    }
    let [refBlot, refBlotOffset] = this.children.find(index);
    if (renderBlocks.length) {
      if (refBlot) {
        refBlot = refBlot.split(refBlotOffset);
        refBlotOffset = 0;
      }
      renderBlocks.forEach((renderBlock) => {
        if (renderBlock.type === "block") {
          const block = this.createBlock(renderBlock.attributes, refBlot || void 0);
          insertInlineContents(block, 0, renderBlock.delta);
        } else {
          const blockEmbed = this.create(renderBlock.key, renderBlock.value);
          this.insertBefore(blockEmbed, refBlot || void 0);
          Object.keys(renderBlock.attributes).forEach((name) => {
            blockEmbed.format(name, renderBlock.attributes[name]);
          });
        }
      });
    }
    if (last.type === "block" && last.delta.length()) {
      const offset = refBlot ? refBlot.offset(refBlot.scroll) + refBlotOffset : this.length();
      insertInlineContents(this, offset, last.delta);
    }
    this.batchEnd();
    this.optimize();
  }
  isEnabled() {
    return this.domNode.getAttribute("contenteditable") === "true";
  }
  leaf(index) {
    const last = this.path(index).pop();
    if (!last) {
      return [null, -1];
    }
    const [blot, offset] = last;
    return blot instanceof LeafBlot$1 ? [blot, offset] : [null, -1];
  }
  line(index) {
    if (index === this.length()) {
      return this.line(index - 1);
    }
    return this.descendant(isLine, index);
  }
  lines() {
    let index = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
    let length2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : Number.MAX_VALUE;
    const getLines = (blot, blotIndex, blotLength) => {
      let lines = [];
      let lengthLeft = blotLength;
      blot.children.forEachAt(blotIndex, blotLength, (child, childIndex, childLength) => {
        if (isLine(child)) {
          lines.push(child);
        } else if (child instanceof ContainerBlot$1) {
          lines = lines.concat(getLines(child, childIndex, lengthLeft));
        }
        lengthLeft -= childLength;
      });
      return lines;
    };
    return getLines(this, index, length2);
  }
  optimize() {
    let mutations = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
    let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.batch)
      return;
    super.optimize(mutations, context);
    if (mutations.length > 0) {
      this.emitter.emit(emitter_default.events.SCROLL_OPTIMIZE, mutations, context);
    }
  }
  path(index) {
    return super.path(index).slice(1);
  }
  remove() {
  }
  update(mutations) {
    if (this.batch) {
      if (Array.isArray(mutations)) {
        this.batch = this.batch.concat(mutations);
      }
      return;
    }
    let source = emitter_default.sources.USER;
    if (typeof mutations === "string") {
      source = mutations;
    }
    if (!Array.isArray(mutations)) {
      mutations = this.observer.takeRecords();
    }
    mutations = mutations.filter((_ref2) => {
      let {
        target
      } = _ref2;
      const blot = this.find(target, true);
      return blot && !isUpdatable(blot);
    });
    if (mutations.length > 0) {
      this.emitter.emit(emitter_default.events.SCROLL_BEFORE_UPDATE, source, mutations);
    }
    super.update(mutations.concat([]));
    if (mutations.length > 0) {
      this.emitter.emit(emitter_default.events.SCROLL_UPDATE, source, mutations);
    }
  }
  updateEmbedAt(index, key, change) {
    const [blot] = this.descendant((b) => b instanceof BlockEmbed, index);
    if (blot && blot.statics.blotName === key && isUpdatable(blot)) {
      blot.updateContent(change);
    }
  }
  handleDragStart(event) {
    event.preventDefault();
  }
  deltaToRenderBlocks(delta) {
    const renderBlocks = [];
    let currentBlockDelta = new import_quill_delta4.default();
    delta.forEach((op) => {
      const insert2 = op?.insert;
      if (!insert2)
        return;
      if (typeof insert2 === "string") {
        const splitted = insert2.split("\n");
        splitted.slice(0, -1).forEach((text2) => {
          currentBlockDelta.insert(text2, op.attributes);
          renderBlocks.push({
            type: "block",
            delta: currentBlockDelta,
            attributes: op.attributes ?? {}
          });
          currentBlockDelta = new import_quill_delta4.default();
        });
        const last = splitted[splitted.length - 1];
        if (last) {
          currentBlockDelta.insert(last, op.attributes);
        }
      } else {
        const key = Object.keys(insert2)[0];
        if (!key)
          return;
        if (this.query(key, Scope.INLINE)) {
          currentBlockDelta.push(op);
        } else {
          if (currentBlockDelta.length()) {
            renderBlocks.push({
              type: "block",
              delta: currentBlockDelta,
              attributes: {}
            });
          }
          currentBlockDelta = new import_quill_delta4.default();
          renderBlocks.push({
            type: "blockEmbed",
            key,
            value: insert2[key],
            attributes: op.attributes ?? {}
          });
        }
      }
    });
    if (currentBlockDelta.length()) {
      renderBlocks.push({
        type: "block",
        delta: currentBlockDelta,
        attributes: {}
      });
    }
    return renderBlocks;
  }
  createBlock(attributes, refBlot) {
    let blotName;
    const formats = {};
    Object.entries(attributes).forEach((_ref3) => {
      let [key, value2] = _ref3;
      const isBlockBlot = this.query(key, Scope.BLOCK & Scope.BLOT) != null;
      if (isBlockBlot) {
        blotName = key;
      } else {
        formats[key] = value2;
      }
    });
    const block = this.create(blotName || this.statics.defaultChild.blotName, blotName ? attributes[blotName] : void 0);
    this.insertBefore(block, refBlot || void 0);
    const length2 = block.length();
    Object.entries(formats).forEach((_ref4) => {
      let [key, value2] = _ref4;
      block.formatAt(0, length2, key, value2);
    });
    return block;
  }
};
function insertInlineContents(parent, index, inlineContents) {
  inlineContents.reduce((index2, op) => {
    const length2 = import_quill_delta4.Op.length(op);
    let attributes = op.attributes || {};
    if (op.insert != null) {
      if (typeof op.insert === "string") {
        const text2 = op.insert;
        parent.insertAt(index2, text2);
        const [leaf] = parent.descendant(LeafBlot$1, index2);
        const formats = bubbleFormats(leaf);
        attributes = import_quill_delta4.AttributeMap.diff(formats, attributes) || {};
      } else if (typeof op.insert === "object") {
        const key = Object.keys(op.insert)[0];
        if (key == null)
          return index2;
        parent.insertAt(index2, key, op.insert[key]);
        const isInlineEmbed = parent.scroll.query(key, Scope.INLINE) != null;
        if (isInlineEmbed) {
          const [leaf] = parent.descendant(LeafBlot$1, index2);
          const formats = bubbleFormats(leaf);
          attributes = import_quill_delta4.AttributeMap.diff(formats, attributes) || {};
        }
      }
    }
    Object.keys(attributes).forEach((key) => {
      parent.formatAt(index2, length2, key, attributes[key]);
    });
    return index2 + length2;
  }, index);
}
var scroll_default = Scroll;

// ../../node_modules/quill/modules/clipboard.js
var import_quill_delta6 = __toESM(require_Delta(), 1);

// ../../node_modules/quill/formats/align.js
var config = {
  scope: Scope.BLOCK,
  whitelist: ["right", "center", "justify"]
};
var AlignAttribute = new Attributor("align", "align", config);
var AlignClass = new ClassAttributor$1("align", "ql-align", config);
var AlignStyle = new StyleAttributor$1("align", "text-align", config);

// ../../node_modules/quill/formats/color.js
var ColorAttributor = class extends StyleAttributor$1 {
  value(domNode) {
    let value2 = super.value(domNode);
    if (!value2.startsWith("rgb("))
      return value2;
    value2 = value2.replace(/^[^\d]+/, "").replace(/[^\d]+$/, "");
    const hex = value2.split(",").map((component2) => `00${parseInt(component2, 10).toString(16)}`.slice(-2)).join("");
    return `#${hex}`;
  }
};
var ColorClass = new ClassAttributor$1("color", "ql-color", {
  scope: Scope.INLINE
});
var ColorStyle = new ColorAttributor("color", "color", {
  scope: Scope.INLINE
});

// ../../node_modules/quill/formats/background.js
var BackgroundClass = new ClassAttributor$1("background", "ql-bg", {
  scope: Scope.INLINE
});
var BackgroundStyle = new ColorAttributor("background", "background-color", {
  scope: Scope.INLINE
});

// ../../node_modules/quill/formats/code.js
var CodeBlockContainer = class extends container_default {
  static create(value2) {
    const domNode = super.create(value2);
    domNode.setAttribute("spellcheck", "false");
    return domNode;
  }
  code(index, length2) {
    return this.children.map((child) => child.length() <= 1 ? "" : child.domNode.innerText).join("\n").slice(index, index + length2);
  }
  html(index, length2) {
    return `<pre>
${escapeText(this.code(index, length2))}
</pre>`;
  }
};
var CodeBlock = class extends Block {
  static TAB = "  ";
  static register() {
    Quill.register(CodeBlockContainer);
  }
};
var Code = class extends inline_default {
};
Code.blotName = "code";
Code.tagName = "CODE";
CodeBlock.blotName = "code-block";
CodeBlock.className = "ql-code-block";
CodeBlock.tagName = "DIV";
CodeBlockContainer.blotName = "code-block-container";
CodeBlockContainer.className = "ql-code-block-container";
CodeBlockContainer.tagName = "DIV";
CodeBlockContainer.allowedChildren = [CodeBlock];
CodeBlock.allowedChildren = [Text2, break_default, cursor_default];
CodeBlock.requiredContainer = CodeBlockContainer;

// ../../node_modules/quill/formats/direction.js
var config2 = {
  scope: Scope.BLOCK,
  whitelist: ["rtl"]
};
var DirectionAttribute = new Attributor("direction", "dir", config2);
var DirectionClass = new ClassAttributor$1("direction", "ql-direction", config2);
var DirectionStyle = new StyleAttributor$1("direction", "direction", config2);

// ../../node_modules/quill/formats/font.js
var config3 = {
  scope: Scope.INLINE,
  whitelist: ["serif", "monospace"]
};
var FontClass = new ClassAttributor$1("font", "ql-font", config3);
var FontStyleAttributor = class extends StyleAttributor$1 {
  value(node) {
    return super.value(node).replace(/["']/g, "");
  }
};
var FontStyle = new FontStyleAttributor("font", "font-family", config3);

// ../../node_modules/quill/formats/size.js
var SizeClass = new ClassAttributor$1("size", "ql-size", {
  scope: Scope.INLINE,
  whitelist: ["small", "large", "huge"]
});
var SizeStyle = new StyleAttributor$1("size", "font-size", {
  scope: Scope.INLINE,
  whitelist: ["10px", "18px", "32px"]
});

// ../../node_modules/quill/modules/keyboard.js
var import_quill_delta5 = __toESM(require_Delta(), 1);
var debug5 = logger_default("quill:keyboard");
var SHORTKEY = /Mac/i.test(navigator.platform) ? "metaKey" : "ctrlKey";
var Keyboard = class _Keyboard extends module_default {
  static match(evt, binding) {
    if (["altKey", "ctrlKey", "metaKey", "shiftKey"].some((key) => {
      return !!binding[key] !== evt[key] && binding[key] !== null;
    })) {
      return false;
    }
    return binding.key === evt.key || binding.key === evt.which;
  }
  constructor(quill, options) {
    super(quill, options);
    this.bindings = {};
    Object.keys(this.options.bindings).forEach((name) => {
      if (this.options.bindings[name]) {
        this.addBinding(this.options.bindings[name]);
      }
    });
    this.addBinding({
      key: "Enter",
      shiftKey: null
    }, this.handleEnter);
    this.addBinding({
      key: "Enter",
      metaKey: null,
      ctrlKey: null,
      altKey: null
    }, () => {
    });
    if (/Firefox/i.test(navigator.userAgent)) {
      this.addBinding({
        key: "Backspace"
      }, {
        collapsed: true
      }, this.handleBackspace);
      this.addBinding({
        key: "Delete"
      }, {
        collapsed: true
      }, this.handleDelete);
    } else {
      this.addBinding({
        key: "Backspace"
      }, {
        collapsed: true,
        prefix: /^.?$/
      }, this.handleBackspace);
      this.addBinding({
        key: "Delete"
      }, {
        collapsed: true,
        suffix: /^.?$/
      }, this.handleDelete);
    }
    this.addBinding({
      key: "Backspace"
    }, {
      collapsed: false
    }, this.handleDeleteRange);
    this.addBinding({
      key: "Delete"
    }, {
      collapsed: false
    }, this.handleDeleteRange);
    this.addBinding({
      key: "Backspace",
      altKey: null,
      ctrlKey: null,
      metaKey: null,
      shiftKey: null
    }, {
      collapsed: true,
      offset: 0
    }, this.handleBackspace);
    this.listen();
  }
  addBinding(keyBinding) {
    let context = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    let handler = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    const binding = normalize(keyBinding);
    if (binding == null) {
      debug5.warn("Attempted to add invalid keyboard binding", binding);
      return;
    }
    if (typeof context === "function") {
      context = {
        handler: context
      };
    }
    if (typeof handler === "function") {
      handler = {
        handler
      };
    }
    const keys2 = Array.isArray(binding.key) ? binding.key : [binding.key];
    keys2.forEach((key) => {
      const singleBinding = {
        ...binding,
        key,
        ...context,
        ...handler
      };
      this.bindings[singleBinding.key] = this.bindings[singleBinding.key] || [];
      this.bindings[singleBinding.key].push(singleBinding);
    });
  }
  listen() {
    this.quill.root.addEventListener("keydown", (evt) => {
      if (evt.defaultPrevented || evt.isComposing)
        return;
      const isComposing = evt.keyCode === 229 && (evt.key === "Enter" || evt.key === "Backspace");
      if (isComposing)
        return;
      const bindings2 = (this.bindings[evt.key] || []).concat(this.bindings[evt.which] || []);
      const matches = bindings2.filter((binding) => _Keyboard.match(evt, binding));
      if (matches.length === 0)
        return;
      const blot = Quill.find(evt.target, true);
      if (blot && blot.scroll !== this.quill.scroll)
        return;
      const range = this.quill.getSelection();
      if (range == null || !this.quill.hasFocus())
        return;
      const [line, offset] = this.quill.getLine(range.index);
      const [leafStart, offsetStart] = this.quill.getLeaf(range.index);
      const [leafEnd, offsetEnd] = range.length === 0 ? [leafStart, offsetStart] : this.quill.getLeaf(range.index + range.length);
      const prefixText = leafStart instanceof TextBlot$1 ? leafStart.value().slice(0, offsetStart) : "";
      const suffixText = leafEnd instanceof TextBlot$1 ? leafEnd.value().slice(offsetEnd) : "";
      const curContext = {
        collapsed: range.length === 0,
        // @ts-expect-error Fix me later
        empty: range.length === 0 && line.length() <= 1,
        format: this.quill.getFormat(range),
        line,
        offset,
        prefix: prefixText,
        suffix: suffixText,
        event: evt
      };
      const prevented = matches.some((binding) => {
        if (binding.collapsed != null && binding.collapsed !== curContext.collapsed) {
          return false;
        }
        if (binding.empty != null && binding.empty !== curContext.empty) {
          return false;
        }
        if (binding.offset != null && binding.offset !== curContext.offset) {
          return false;
        }
        if (Array.isArray(binding.format)) {
          if (binding.format.every((name) => curContext.format[name] == null)) {
            return false;
          }
        } else if (typeof binding.format === "object") {
          if (!Object.keys(binding.format).every((name) => {
            if (binding.format[name] === true)
              return curContext.format[name] != null;
            if (binding.format[name] === false)
              return curContext.format[name] == null;
            return isEqual_default(binding.format[name], curContext.format[name]);
          })) {
            return false;
          }
        }
        if (binding.prefix != null && !binding.prefix.test(curContext.prefix)) {
          return false;
        }
        if (binding.suffix != null && !binding.suffix.test(curContext.suffix)) {
          return false;
        }
        return binding.handler.call(this, range, curContext, binding) !== true;
      });
      if (prevented) {
        evt.preventDefault();
      }
    });
  }
  handleBackspace(range, context) {
    const length2 = /[\uD800-\uDBFF][\uDC00-\uDFFF]$/.test(context.prefix) ? 2 : 1;
    if (range.index === 0 || this.quill.getLength() <= 1)
      return;
    let formats = {};
    const [line] = this.quill.getLine(range.index);
    let delta = new import_quill_delta5.default().retain(range.index - length2).delete(length2);
    if (context.offset === 0) {
      const [prev] = this.quill.getLine(range.index - 1);
      if (prev) {
        const isPrevLineEmpty = prev.statics.blotName === "block" && prev.length() <= 1;
        if (!isPrevLineEmpty) {
          const curFormats = line.formats();
          const prevFormats = this.quill.getFormat(range.index - 1, 1);
          formats = import_quill_delta5.AttributeMap.diff(curFormats, prevFormats) || {};
          if (Object.keys(formats).length > 0) {
            const formatDelta = new import_quill_delta5.default().retain(range.index + line.length() - 2).retain(1, formats);
            delta = delta.compose(formatDelta);
          }
        }
      }
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.focus();
  }
  handleDelete(range, context) {
    const length2 = /^[\uD800-\uDBFF][\uDC00-\uDFFF]/.test(context.suffix) ? 2 : 1;
    if (range.index >= this.quill.getLength() - length2)
      return;
    let formats = {};
    const [line] = this.quill.getLine(range.index);
    let delta = new import_quill_delta5.default().retain(range.index).delete(length2);
    if (context.offset >= line.length() - 1) {
      const [next] = this.quill.getLine(range.index + 1);
      if (next) {
        const curFormats = line.formats();
        const nextFormats = this.quill.getFormat(range.index, 1);
        formats = import_quill_delta5.AttributeMap.diff(curFormats, nextFormats) || {};
        if (Object.keys(formats).length > 0) {
          delta = delta.retain(next.length() - 1).retain(1, formats);
        }
      }
    }
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.focus();
  }
  handleDeleteRange(range) {
    deleteRange({
      range,
      quill: this.quill
    });
    this.quill.focus();
  }
  handleEnter(range, context) {
    const lineFormats = Object.keys(context.format).reduce((formats, format2) => {
      if (this.quill.scroll.query(format2, Scope.BLOCK) && !Array.isArray(context.format[format2])) {
        formats[format2] = context.format[format2];
      }
      return formats;
    }, {});
    const delta = new import_quill_delta5.default().retain(range.index).delete(range.length).insert("\n", lineFormats);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
    this.quill.focus();
  }
};
var defaultOptions = {
  bindings: {
    bold: makeFormatHandler("bold"),
    italic: makeFormatHandler("italic"),
    underline: makeFormatHandler("underline"),
    indent: {
      // highlight tab or tab at beginning of list, indent or blockquote
      key: "Tab",
      format: ["blockquote", "indent", "list"],
      handler(range, context) {
        if (context.collapsed && context.offset !== 0)
          return true;
        this.quill.format("indent", "+1", Quill.sources.USER);
        return false;
      }
    },
    outdent: {
      key: "Tab",
      shiftKey: true,
      format: ["blockquote", "indent", "list"],
      // highlight tab or tab at beginning of list, indent or blockquote
      handler(range, context) {
        if (context.collapsed && context.offset !== 0)
          return true;
        this.quill.format("indent", "-1", Quill.sources.USER);
        return false;
      }
    },
    "outdent backspace": {
      key: "Backspace",
      collapsed: true,
      shiftKey: null,
      metaKey: null,
      ctrlKey: null,
      altKey: null,
      format: ["indent", "list"],
      offset: 0,
      handler(range, context) {
        if (context.format.indent != null) {
          this.quill.format("indent", "-1", Quill.sources.USER);
        } else if (context.format.list != null) {
          this.quill.format("list", false, Quill.sources.USER);
        }
      }
    },
    "indent code-block": makeCodeBlockHandler(true),
    "outdent code-block": makeCodeBlockHandler(false),
    "remove tab": {
      key: "Tab",
      shiftKey: true,
      collapsed: true,
      prefix: /\t$/,
      handler(range) {
        this.quill.deleteText(range.index - 1, 1, Quill.sources.USER);
      }
    },
    tab: {
      key: "Tab",
      handler(range, context) {
        if (context.format.table)
          return true;
        this.quill.history.cutoff();
        const delta = new import_quill_delta5.default().retain(range.index).delete(range.length).insert("	");
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        return false;
      }
    },
    "blockquote empty enter": {
      key: "Enter",
      collapsed: true,
      format: ["blockquote"],
      empty: true,
      handler() {
        this.quill.format("blockquote", false, Quill.sources.USER);
      }
    },
    "list empty enter": {
      key: "Enter",
      collapsed: true,
      format: ["list"],
      empty: true,
      handler(range, context) {
        const formats = {
          list: false
        };
        if (context.format.indent) {
          formats.indent = false;
        }
        this.quill.formatLine(range.index, range.length, formats, Quill.sources.USER);
      }
    },
    "checklist enter": {
      key: "Enter",
      collapsed: true,
      format: {
        list: "checked"
      },
      handler(range) {
        const [line, offset] = this.quill.getLine(range.index);
        const formats = {
          // @ts-expect-error Fix me later
          ...line.formats(),
          list: "checked"
        };
        const delta = new import_quill_delta5.default().retain(range.index).insert("\n", formats).retain(line.length() - offset - 1).retain(1, {
          list: "unchecked"
        });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    "header enter": {
      key: "Enter",
      collapsed: true,
      format: ["header"],
      suffix: /^$/,
      handler(range, context) {
        const [line, offset] = this.quill.getLine(range.index);
        const delta = new import_quill_delta5.default().retain(range.index).insert("\n", context.format).retain(line.length() - offset - 1).retain(1, {
          header: null
        });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.setSelection(range.index + 1, Quill.sources.SILENT);
        this.quill.scrollSelectionIntoView();
      }
    },
    "table backspace": {
      key: "Backspace",
      format: ["table"],
      collapsed: true,
      offset: 0,
      handler() {
      }
    },
    "table delete": {
      key: "Delete",
      format: ["table"],
      collapsed: true,
      suffix: /^$/,
      handler() {
      }
    },
    "table enter": {
      key: "Enter",
      shiftKey: null,
      format: ["table"],
      handler(range) {
        const module2 = this.quill.getModule("table");
        if (module2) {
          const [table, row, cell, offset] = module2.getTable(range);
          const shift = tableSide(table, row, cell, offset);
          if (shift == null)
            return;
          let index = table.offset();
          if (shift < 0) {
            const delta = new import_quill_delta5.default().retain(index).insert("\n");
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(range.index + 1, range.length, Quill.sources.SILENT);
          } else if (shift > 0) {
            index += table.length();
            const delta = new import_quill_delta5.default().retain(index).insert("\n");
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(index, Quill.sources.USER);
          }
        }
      }
    },
    "table tab": {
      key: "Tab",
      shiftKey: null,
      format: ["table"],
      handler(range, context) {
        const {
          event,
          line: cell
        } = context;
        const offset = cell.offset(this.quill.scroll);
        if (event.shiftKey) {
          this.quill.setSelection(offset - 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(offset + cell.length(), Quill.sources.USER);
        }
      }
    },
    "list autofill": {
      key: " ",
      shiftKey: null,
      collapsed: true,
      format: {
        "code-block": false,
        blockquote: false,
        table: false
      },
      prefix: /^\s*?(\d+\.|-|\*|\[ ?\]|\[x\])$/,
      handler(range, context) {
        if (this.quill.scroll.query("list") == null)
          return true;
        const {
          length: length2
        } = context.prefix;
        const [line, offset] = this.quill.getLine(range.index);
        if (offset > length2)
          return true;
        let value2;
        switch (context.prefix.trim()) {
          case "[]":
          case "[ ]":
            value2 = "unchecked";
            break;
          case "[x]":
            value2 = "checked";
            break;
          case "-":
          case "*":
            value2 = "bullet";
            break;
          default:
            value2 = "ordered";
        }
        this.quill.insertText(range.index, " ", Quill.sources.USER);
        this.quill.history.cutoff();
        const delta = new import_quill_delta5.default().retain(range.index - offset).delete(length2 + 1).retain(line.length() - 2 - offset).retain(1, {
          list: value2
        });
        this.quill.updateContents(delta, Quill.sources.USER);
        this.quill.history.cutoff();
        this.quill.setSelection(range.index - length2, Quill.sources.SILENT);
        return false;
      }
    },
    "code exit": {
      key: "Enter",
      collapsed: true,
      format: ["code-block"],
      prefix: /^$/,
      suffix: /^\s*$/,
      handler(range) {
        const [line, offset] = this.quill.getLine(range.index);
        let numLines = 2;
        let cur = line;
        while (cur != null && cur.length() <= 1 && cur.formats()["code-block"]) {
          cur = cur.prev;
          numLines -= 1;
          if (numLines <= 0) {
            const delta = new import_quill_delta5.default().retain(range.index + line.length() - offset - 2).retain(1, {
              "code-block": null
            }).delete(1);
            this.quill.updateContents(delta, Quill.sources.USER);
            this.quill.setSelection(range.index - 1, Quill.sources.SILENT);
            return false;
          }
        }
        return true;
      }
    },
    "embed left": makeEmbedArrowHandler("ArrowLeft", false),
    "embed left shift": makeEmbedArrowHandler("ArrowLeft", true),
    "embed right": makeEmbedArrowHandler("ArrowRight", false),
    "embed right shift": makeEmbedArrowHandler("ArrowRight", true),
    "table down": makeTableArrowHandler(false),
    "table up": makeTableArrowHandler(true)
  }
};
Keyboard.DEFAULTS = defaultOptions;
function makeCodeBlockHandler(indent) {
  return {
    key: "Tab",
    shiftKey: !indent,
    format: {
      "code-block": true
    },
    handler(range, _ref) {
      let {
        event
      } = _ref;
      const CodeBlock2 = this.quill.scroll.query("code-block");
      const {
        TAB
      } = CodeBlock2;
      if (range.length === 0 && !event.shiftKey) {
        this.quill.insertText(range.index, TAB, Quill.sources.USER);
        this.quill.setSelection(range.index + TAB.length, Quill.sources.SILENT);
        return;
      }
      const lines = range.length === 0 ? this.quill.getLines(range.index, 1) : this.quill.getLines(range);
      let {
        index,
        length: length2
      } = range;
      lines.forEach((line, i) => {
        if (indent) {
          line.insertAt(0, TAB);
          if (i === 0) {
            index += TAB.length;
          } else {
            length2 += TAB.length;
          }
        } else if (line.domNode.textContent.startsWith(TAB)) {
          line.deleteAt(0, TAB.length);
          if (i === 0) {
            index -= TAB.length;
          } else {
            length2 -= TAB.length;
          }
        }
      });
      this.quill.update(Quill.sources.USER);
      this.quill.setSelection(index, length2, Quill.sources.SILENT);
    }
  };
}
function makeEmbedArrowHandler(key, shiftKey) {
  const where = key === "ArrowLeft" ? "prefix" : "suffix";
  return {
    key,
    shiftKey,
    altKey: null,
    [where]: /^$/,
    handler(range) {
      let {
        index
      } = range;
      if (key === "ArrowRight") {
        index += range.length + 1;
      }
      const [leaf] = this.quill.getLeaf(index);
      if (!(leaf instanceof EmbedBlot$1))
        return true;
      if (key === "ArrowLeft") {
        if (shiftKey) {
          this.quill.setSelection(range.index - 1, range.length + 1, Quill.sources.USER);
        } else {
          this.quill.setSelection(range.index - 1, Quill.sources.USER);
        }
      } else if (shiftKey) {
        this.quill.setSelection(range.index, range.length + 1, Quill.sources.USER);
      } else {
        this.quill.setSelection(range.index + range.length + 1, Quill.sources.USER);
      }
      return false;
    }
  };
}
function makeFormatHandler(format2) {
  return {
    key: format2[0],
    shortKey: true,
    handler(range, context) {
      this.quill.format(format2, !context.format[format2], Quill.sources.USER);
    }
  };
}
function makeTableArrowHandler(up) {
  return {
    key: up ? "ArrowUp" : "ArrowDown",
    collapsed: true,
    format: ["table"],
    handler(range, context) {
      const key = up ? "prev" : "next";
      const cell = context.line;
      const targetRow = cell.parent[key];
      if (targetRow != null) {
        if (targetRow.statics.blotName === "table-row") {
          let targetCell = targetRow.children.head;
          let cur = cell;
          while (cur.prev != null) {
            cur = cur.prev;
            targetCell = targetCell.next;
          }
          const index = targetCell.offset(this.quill.scroll) + Math.min(context.offset, targetCell.length() - 1);
          this.quill.setSelection(index, 0, Quill.sources.USER);
        }
      } else {
        const targetLine = cell.table()[key];
        if (targetLine != null) {
          if (up) {
            this.quill.setSelection(targetLine.offset(this.quill.scroll) + targetLine.length() - 1, 0, Quill.sources.USER);
          } else {
            this.quill.setSelection(targetLine.offset(this.quill.scroll), 0, Quill.sources.USER);
          }
        }
      }
      return false;
    }
  };
}
function normalize(binding) {
  if (typeof binding === "string" || typeof binding === "number") {
    binding = {
      key: binding
    };
  } else if (typeof binding === "object") {
    binding = cloneDeep_default(binding);
  } else {
    return null;
  }
  if (binding.shortKey) {
    binding[SHORTKEY] = binding.shortKey;
    delete binding.shortKey;
  }
  return binding;
}
function deleteRange(_ref2) {
  let {
    quill,
    range
  } = _ref2;
  const lines = quill.getLines(range);
  let formats = {};
  if (lines.length > 1) {
    const firstFormats = lines[0].formats();
    const lastFormats = lines[lines.length - 1].formats();
    formats = import_quill_delta5.AttributeMap.diff(lastFormats, firstFormats) || {};
  }
  quill.deleteText(range, Quill.sources.USER);
  if (Object.keys(formats).length > 0) {
    quill.formatLine(range.index, 1, formats, Quill.sources.USER);
  }
  quill.setSelection(range.index, Quill.sources.SILENT);
}
function tableSide(_table, row, cell, offset) {
  if (row.prev == null && row.next == null) {
    if (cell.prev == null && cell.next == null) {
      return offset === 0 ? -1 : 1;
    }
    return cell.prev == null ? -1 : 1;
  }
  if (row.prev == null) {
    return -1;
  }
  if (row.next == null) {
    return 1;
  }
  return null;
}

// ../../node_modules/quill/modules/normalizeExternalHTML/normalizers/googleDocs.js
var normalWeightRegexp = /font-weight:\s*normal/;
var blockTagNames = ["P", "OL", "UL"];
var isBlockElement = (element) => {
  return element && blockTagNames.includes(element.tagName);
};
var normalizeEmptyLines = (doc) => {
  Array.from(doc.querySelectorAll("br")).filter((br) => isBlockElement(br.previousElementSibling) && isBlockElement(br.nextElementSibling)).forEach((br) => {
    br.parentNode?.removeChild(br);
  });
};
var normalizeFontWeight = (doc) => {
  Array.from(doc.querySelectorAll('b[style*="font-weight"]')).filter((node) => node.getAttribute("style")?.match(normalWeightRegexp)).forEach((node) => {
    const fragment = doc.createDocumentFragment();
    fragment.append(...node.childNodes);
    node.parentNode?.replaceChild(fragment, node);
  });
};
function normalize2(doc) {
  if (doc.querySelector('[id^="docs-internal-guid-"]')) {
    normalizeFontWeight(doc);
    normalizeEmptyLines(doc);
  }
}

// ../../node_modules/quill/modules/normalizeExternalHTML/normalizers/msWord.js
var ignoreRegexp = /\bmso-list:[^;]*ignore/i;
var idRegexp = /\bmso-list:[^;]*\bl(\d+)/i;
var indentRegexp = /\bmso-list:[^;]*\blevel(\d+)/i;
var parseListItem = (element, html) => {
  const style2 = element.getAttribute("style");
  const idMatch = style2?.match(idRegexp);
  if (!idMatch) {
    return null;
  }
  const id = Number(idMatch[1]);
  const indentMatch = style2?.match(indentRegexp);
  const indent = indentMatch ? Number(indentMatch[1]) : 1;
  const typeRegexp = new RegExp(`@list l${id}:level${indent}\\s*\\{[^\\}]*mso-level-number-format:\\s*([\\w-]+)`, "i");
  const typeMatch = html.match(typeRegexp);
  const type = typeMatch && typeMatch[1] === "bullet" ? "bullet" : "ordered";
  return {
    id,
    indent,
    type,
    element
  };
};
var normalizeListItem = (doc) => {
  const msoList = Array.from(doc.querySelectorAll("[style*=mso-list]"));
  const ignored = [];
  const others = [];
  msoList.forEach((node) => {
    const shouldIgnore = (node.getAttribute("style") || "").match(ignoreRegexp);
    if (shouldIgnore) {
      ignored.push(node);
    } else {
      others.push(node);
    }
  });
  ignored.forEach((node) => node.parentNode?.removeChild(node));
  const html = doc.documentElement.innerHTML;
  const listItems = others.map((element) => parseListItem(element, html)).filter((parsed) => parsed);
  while (listItems.length) {
    const childListItems = [];
    let current = listItems.shift();
    while (current) {
      childListItems.push(current);
      current = listItems.length && listItems[0]?.element === current.element.nextElementSibling && // Different id means the next item doesn't belong to this group.
      listItems[0].id === current.id ? listItems.shift() : null;
    }
    const ul = document.createElement("ul");
    childListItems.forEach((listItem) => {
      const li = document.createElement("li");
      li.setAttribute("data-list", listItem.type);
      if (listItem.indent > 1) {
        li.setAttribute("class", `ql-indent-${listItem.indent - 1}`);
      }
      li.innerHTML = listItem.element.innerHTML;
      ul.appendChild(li);
    });
    const element = childListItems[0]?.element;
    const {
      parentNode
    } = element ?? {};
    if (element) {
      parentNode?.replaceChild(ul, element);
    }
    childListItems.slice(1).forEach((_ref) => {
      let {
        element: e
      } = _ref;
      parentNode?.removeChild(e);
    });
  }
};
function normalize3(doc) {
  if (doc.documentElement.getAttribute("xmlns:w") === "urn:schemas-microsoft-com:office:word") {
    normalizeListItem(doc);
  }
}

// ../../node_modules/quill/modules/normalizeExternalHTML/index.js
var NORMALIZERS = [normalize3, normalize2];
var normalizeExternalHTML = (doc) => {
  if (doc.documentElement) {
    NORMALIZERS.forEach((normalize4) => {
      normalize4(doc);
    });
  }
};
var normalizeExternalHTML_default = normalizeExternalHTML;

// ../../node_modules/quill/modules/clipboard.js
var debug6 = logger_default("quill:clipboard");
var CLIPBOARD_CONFIG = [[Node.TEXT_NODE, matchText], [Node.TEXT_NODE, matchNewline], ["br", matchBreak], [Node.ELEMENT_NODE, matchNewline], [Node.ELEMENT_NODE, matchBlot], [Node.ELEMENT_NODE, matchAttributor], [Node.ELEMENT_NODE, matchStyles], ["li", matchIndent], ["ol, ul", matchList], ["pre", matchCodeBlock], ["tr", matchTable], ["b", createMatchAlias("bold")], ["i", createMatchAlias("italic")], ["strike", createMatchAlias("strike")], ["style", matchIgnore]];
var ATTRIBUTE_ATTRIBUTORS = [AlignAttribute, DirectionAttribute].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
var STYLE_ATTRIBUTORS = [AlignStyle, BackgroundStyle, ColorStyle, DirectionStyle, FontStyle, SizeStyle].reduce((memo, attr) => {
  memo[attr.keyName] = attr;
  return memo;
}, {});
var Clipboard = class extends module_default {
  static DEFAULTS = {
    matchers: []
  };
  constructor(quill, options) {
    super(quill, options);
    this.quill.root.addEventListener("copy", (e) => this.onCaptureCopy(e, false));
    this.quill.root.addEventListener("cut", (e) => this.onCaptureCopy(e, true));
    this.quill.root.addEventListener("paste", this.onCapturePaste.bind(this));
    this.matchers = [];
    CLIPBOARD_CONFIG.concat(this.options.matchers ?? []).forEach((_ref) => {
      let [selector, matcher] = _ref;
      this.addMatcher(selector, matcher);
    });
  }
  addMatcher(selector, matcher) {
    this.matchers.push([selector, matcher]);
  }
  convert(_ref2) {
    let {
      html,
      text: text2
    } = _ref2;
    let formats = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (formats[CodeBlock.blotName]) {
      return new import_quill_delta6.default().insert(text2 || "", {
        [CodeBlock.blotName]: formats[CodeBlock.blotName]
      });
    }
    if (!html) {
      return new import_quill_delta6.default().insert(text2 || "", formats);
    }
    const delta = this.convertHTML(html);
    if (deltaEndsWith(delta, "\n") && (delta.ops[delta.ops.length - 1].attributes == null || formats.table)) {
      return delta.compose(new import_quill_delta6.default().retain(delta.length() - 1).delete(1));
    }
    return delta;
  }
  normalizeHTML(doc) {
    normalizeExternalHTML_default(doc);
  }
  convertHTML(html) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    this.normalizeHTML(doc);
    const container = doc.body;
    const nodeMatches = /* @__PURE__ */ new WeakMap();
    const [elementMatchers, textMatchers] = this.prepareMatching(container, nodeMatches);
    return traverse(this.quill.scroll, container, elementMatchers, textMatchers, nodeMatches);
  }
  dangerouslyPasteHTML(index, html) {
    let source = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : Quill.sources.API;
    if (typeof index === "string") {
      const delta = this.convert({
        html: index,
        text: ""
      });
      this.quill.setContents(delta, html);
      this.quill.setSelection(0, Quill.sources.SILENT);
    } else {
      const paste = this.convert({
        html,
        text: ""
      });
      this.quill.updateContents(new import_quill_delta6.default().retain(index).concat(paste), source);
      this.quill.setSelection(index + paste.length(), Quill.sources.SILENT);
    }
  }
  onCaptureCopy(e) {
    let isCut = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
    if (e.defaultPrevented)
      return;
    e.preventDefault();
    const [range] = this.quill.selection.getRange();
    if (range == null)
      return;
    const {
      html,
      text: text2
    } = this.onCopy(range, isCut);
    e.clipboardData?.setData("text/plain", text2);
    e.clipboardData?.setData("text/html", html);
    if (isCut) {
      deleteRange({
        range,
        quill: this.quill
      });
    }
  }
  /*
   * https://www.iana.org/assignments/media-types/text/uri-list
   */
  normalizeURIList(urlList) {
    return urlList.split(/\r?\n/).filter((url) => url[0] !== "#").join("\n");
  }
  onCapturePaste(e) {
    if (e.defaultPrevented || !this.quill.isEnabled())
      return;
    e.preventDefault();
    const range = this.quill.getSelection(true);
    if (range == null)
      return;
    const html = e.clipboardData?.getData("text/html");
    let text2 = e.clipboardData?.getData("text/plain");
    if (!html && !text2) {
      const urlList = e.clipboardData?.getData("text/uri-list");
      if (urlList) {
        text2 = this.normalizeURIList(urlList);
      }
    }
    const files = Array.from(e.clipboardData?.files || []);
    if (!html && files.length > 0) {
      this.quill.uploader.upload(range, files);
      return;
    }
    if (html && files.length > 0) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      if (doc.body.childElementCount === 1 && doc.body.firstElementChild?.tagName === "IMG") {
        this.quill.uploader.upload(range, files);
        return;
      }
    }
    this.onPaste(range, {
      html,
      text: text2
    });
  }
  onCopy(range) {
    const text2 = this.quill.getText(range);
    const html = this.quill.getSemanticHTML(range);
    return {
      html,
      text: text2
    };
  }
  onPaste(range, _ref3) {
    let {
      text: text2,
      html
    } = _ref3;
    const formats = this.quill.getFormat(range.index);
    const pastedDelta = this.convert({
      text: text2,
      html
    }, formats);
    debug6.log("onPaste", pastedDelta, {
      text: text2,
      html
    });
    const delta = new import_quill_delta6.default().retain(range.index).delete(range.length).concat(pastedDelta);
    this.quill.updateContents(delta, Quill.sources.USER);
    this.quill.setSelection(delta.length() - range.length, Quill.sources.SILENT);
    this.quill.scrollSelectionIntoView();
  }
  prepareMatching(container, nodeMatches) {
    const elementMatchers = [];
    const textMatchers = [];
    this.matchers.forEach((pair) => {
      const [selector, matcher] = pair;
      switch (selector) {
        case Node.TEXT_NODE:
          textMatchers.push(matcher);
          break;
        case Node.ELEMENT_NODE:
          elementMatchers.push(matcher);
          break;
        default:
          Array.from(container.querySelectorAll(selector)).forEach((node) => {
            if (nodeMatches.has(node)) {
              const matches = nodeMatches.get(node);
              matches?.push(matcher);
            } else {
              nodeMatches.set(node, [matcher]);
            }
          });
          break;
      }
    });
    return [elementMatchers, textMatchers];
  }
};
function applyFormat(delta, format2, value2, scroll) {
  if (!scroll.query(format2)) {
    return delta;
  }
  return delta.reduce((newDelta, op) => {
    if (!op.insert)
      return newDelta;
    if (op.attributes && op.attributes[format2]) {
      return newDelta.push(op);
    }
    const formats = value2 ? {
      [format2]: value2
    } : {};
    return newDelta.insert(op.insert, {
      ...formats,
      ...op.attributes
    });
  }, new import_quill_delta6.default());
}
function deltaEndsWith(delta, text2) {
  let endText = "";
  for (let i = delta.ops.length - 1; i >= 0 && endText.length < text2.length; --i) {
    const op = delta.ops[i];
    if (typeof op.insert !== "string")
      break;
    endText = op.insert + endText;
  }
  return endText.slice(-1 * text2.length) === text2;
}
function isLine2(node, scroll) {
  if (!(node instanceof Element))
    return false;
  const match2 = scroll.query(node);
  if (match2 && match2.prototype instanceof EmbedBlot$1)
    return false;
  return ["address", "article", "blockquote", "canvas", "dd", "div", "dl", "dt", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "iframe", "li", "main", "nav", "ol", "output", "p", "pre", "section", "table", "td", "tr", "ul", "video"].includes(node.tagName.toLowerCase());
}
function isBetweenInlineElements(node, scroll) {
  return node.previousElementSibling && node.nextElementSibling && !isLine2(node.previousElementSibling, scroll) && !isLine2(node.nextElementSibling, scroll);
}
var preNodes = /* @__PURE__ */ new WeakMap();
function isPre(node) {
  if (node == null)
    return false;
  if (!preNodes.has(node)) {
    if (node.tagName === "PRE") {
      preNodes.set(node, true);
    } else {
      preNodes.set(node, isPre(node.parentNode));
    }
  }
  return preNodes.get(node);
}
function traverse(scroll, node, elementMatchers, textMatchers, nodeMatches) {
  if (node.nodeType === node.TEXT_NODE) {
    return textMatchers.reduce((delta, matcher) => {
      return matcher(node, delta, scroll);
    }, new import_quill_delta6.default());
  }
  if (node.nodeType === node.ELEMENT_NODE) {
    return Array.from(node.childNodes || []).reduce((delta, childNode) => {
      let childrenDelta = traverse(scroll, childNode, elementMatchers, textMatchers, nodeMatches);
      if (childNode.nodeType === node.ELEMENT_NODE) {
        childrenDelta = elementMatchers.reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
        childrenDelta = (nodeMatches.get(childNode) || []).reduce((reducedDelta, matcher) => {
          return matcher(childNode, reducedDelta, scroll);
        }, childrenDelta);
      }
      return delta.concat(childrenDelta);
    }, new import_quill_delta6.default());
  }
  return new import_quill_delta6.default();
}
function createMatchAlias(format2) {
  return (_node, delta, scroll) => {
    return applyFormat(delta, format2, true, scroll);
  };
}
function matchAttributor(node, delta, scroll) {
  const attributes = Attributor.keys(node);
  const classes = ClassAttributor$1.keys(node);
  const styles = StyleAttributor$1.keys(node);
  const formats = {};
  attributes.concat(classes).concat(styles).forEach((name) => {
    let attr = scroll.query(name, Scope.ATTRIBUTE);
    if (attr != null) {
      formats[attr.attrName] = attr.value(node);
      if (formats[attr.attrName])
        return;
    }
    attr = ATTRIBUTE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      formats[attr.attrName] = attr.value(node) || void 0;
    }
    attr = STYLE_ATTRIBUTORS[name];
    if (attr != null && (attr.attrName === name || attr.keyName === name)) {
      attr = STYLE_ATTRIBUTORS[name];
      formats[attr.attrName] = attr.value(node) || void 0;
    }
  });
  return Object.entries(formats).reduce((newDelta, _ref4) => {
    let [name, value2] = _ref4;
    return applyFormat(newDelta, name, value2, scroll);
  }, delta);
}
function matchBlot(node, delta, scroll) {
  const match2 = scroll.query(node);
  if (match2 == null)
    return delta;
  if (match2.prototype instanceof EmbedBlot$1) {
    const embed = {};
    const value2 = match2.value(node);
    if (value2 != null) {
      embed[match2.blotName] = value2;
      return new import_quill_delta6.default().insert(embed, match2.formats(node, scroll));
    }
  } else {
    if (match2.prototype instanceof BlockBlot$1 && !deltaEndsWith(delta, "\n")) {
      delta.insert("\n");
    }
    if ("blotName" in match2 && "formats" in match2 && typeof match2.formats === "function") {
      return applyFormat(delta, match2.blotName, match2.formats(node, scroll), scroll);
    }
  }
  return delta;
}
function matchBreak(node, delta) {
  if (!deltaEndsWith(delta, "\n")) {
    delta.insert("\n");
  }
  return delta;
}
function matchCodeBlock(node, delta, scroll) {
  const match2 = scroll.query("code-block");
  const language = match2 && "formats" in match2 && typeof match2.formats === "function" ? match2.formats(node, scroll) : true;
  return applyFormat(delta, "code-block", language, scroll);
}
function matchIgnore() {
  return new import_quill_delta6.default();
}
function matchIndent(node, delta, scroll) {
  const match2 = scroll.query(node);
  if (match2 == null || // @ts-expect-error
  match2.blotName !== "list" || !deltaEndsWith(delta, "\n")) {
    return delta;
  }
  let indent = -1;
  let parent = node.parentNode;
  while (parent != null) {
    if (["OL", "UL"].includes(parent.tagName)) {
      indent += 1;
    }
    parent = parent.parentNode;
  }
  if (indent <= 0)
    return delta;
  return delta.reduce((composed, op) => {
    if (!op.insert)
      return composed;
    if (op.attributes && typeof op.attributes.indent === "number") {
      return composed.push(op);
    }
    return composed.insert(op.insert, {
      indent,
      ...op.attributes || {}
    });
  }, new import_quill_delta6.default());
}
function matchList(node, delta, scroll) {
  const element = node;
  let list = element.tagName === "OL" ? "ordered" : "bullet";
  const checkedAttr = element.getAttribute("data-checked");
  if (checkedAttr) {
    list = checkedAttr === "true" ? "checked" : "unchecked";
  }
  return applyFormat(delta, "list", list, scroll);
}
function matchNewline(node, delta, scroll) {
  if (!deltaEndsWith(delta, "\n")) {
    if (isLine2(node, scroll) && (node.childNodes.length > 0 || node instanceof HTMLParagraphElement)) {
      return delta.insert("\n");
    }
    if (delta.length() > 0 && node.nextSibling) {
      let nextSibling = node.nextSibling;
      while (nextSibling != null) {
        if (isLine2(nextSibling, scroll)) {
          return delta.insert("\n");
        }
        const match2 = scroll.query(nextSibling);
        if (match2 && match2.prototype instanceof BlockEmbed) {
          return delta.insert("\n");
        }
        nextSibling = nextSibling.firstChild;
      }
    }
  }
  return delta;
}
function matchStyles(node, delta, scroll) {
  const formats = {};
  const style2 = node.style || {};
  if (style2.fontStyle === "italic") {
    formats.italic = true;
  }
  if (style2.textDecoration === "underline") {
    formats.underline = true;
  }
  if (style2.textDecoration === "line-through") {
    formats.strike = true;
  }
  if (style2.fontWeight?.startsWith("bold") || // @ts-expect-error Fix me later
  parseInt(style2.fontWeight, 10) >= 700) {
    formats.bold = true;
  }
  delta = Object.entries(formats).reduce((newDelta, _ref5) => {
    let [name, value2] = _ref5;
    return applyFormat(newDelta, name, value2, scroll);
  }, delta);
  if (parseFloat(style2.textIndent || 0) > 0) {
    return new import_quill_delta6.default().insert("	").concat(delta);
  }
  return delta;
}
function matchTable(node, delta, scroll) {
  const table = node.parentElement?.tagName === "TABLE" ? node.parentElement : node.parentElement?.parentElement;
  if (table != null) {
    const rows = Array.from(table.querySelectorAll("tr"));
    const row = rows.indexOf(node) + 1;
    return applyFormat(delta, "table", row, scroll);
  }
  return delta;
}
function matchText(node, delta, scroll) {
  let text2 = node.data;
  if (node.parentElement?.tagName === "O:P") {
    return delta.insert(text2.trim());
  }
  if (!isPre(node)) {
    if (text2.trim().length === 0 && text2.includes("\n") && !isBetweenInlineElements(node, scroll)) {
      return delta;
    }
    const replacer = (collapse, match2) => {
      const replaced = match2.replace(/[^\u00a0]/g, "");
      return replaced.length < 1 && collapse ? " " : replaced;
    };
    text2 = text2.replace(/\r\n/g, " ").replace(/\n/g, " ");
    text2 = text2.replace(/\s\s+/g, replacer.bind(replacer, true));
    if (node.previousSibling == null && node.parentElement != null && isLine2(node.parentElement, scroll) || node.previousSibling instanceof Element && isLine2(node.previousSibling, scroll)) {
      text2 = text2.replace(/^\s+/, replacer.bind(replacer, false));
    }
    if (node.nextSibling == null && node.parentElement != null && isLine2(node.parentElement, scroll) || node.nextSibling instanceof Element && isLine2(node.nextSibling, scroll)) {
      text2 = text2.replace(/\s+$/, replacer.bind(replacer, false));
    }
  }
  return delta.insert(text2);
}

// ../../node_modules/quill/modules/history.js
var History = class extends module_default {
  static DEFAULTS = {
    delay: 1e3,
    maxStack: 100,
    userOnly: false
  };
  lastRecorded = 0;
  ignoreChange = false;
  stack = {
    undo: [],
    redo: []
  };
  currentRange = null;
  constructor(quill, options) {
    super(quill, options);
    this.quill.on(Quill.events.EDITOR_CHANGE, (eventName, value2, oldValue, source) => {
      if (eventName === Quill.events.SELECTION_CHANGE) {
        if (value2 && source !== Quill.sources.SILENT) {
          this.currentRange = value2;
        }
      } else if (eventName === Quill.events.TEXT_CHANGE) {
        if (!this.ignoreChange) {
          if (!this.options.userOnly || source === Quill.sources.USER) {
            this.record(value2, oldValue);
          } else {
            this.transform(value2);
          }
        }
        this.currentRange = transformRange(this.currentRange, value2);
      }
    });
    this.quill.keyboard.addBinding({
      key: "z",
      shortKey: true
    }, this.undo.bind(this));
    this.quill.keyboard.addBinding({
      key: ["z", "Z"],
      shortKey: true,
      shiftKey: true
    }, this.redo.bind(this));
    if (/Win/i.test(navigator.platform)) {
      this.quill.keyboard.addBinding({
        key: "y",
        shortKey: true
      }, this.redo.bind(this));
    }
    this.quill.root.addEventListener("beforeinput", (event) => {
      if (event.inputType === "historyUndo") {
        this.undo();
        event.preventDefault();
      } else if (event.inputType === "historyRedo") {
        this.redo();
        event.preventDefault();
      }
    });
  }
  change(source, dest) {
    if (this.stack[source].length === 0)
      return;
    const item = this.stack[source].pop();
    if (!item)
      return;
    const base = this.quill.getContents();
    const inverseDelta = item.delta.invert(base);
    this.stack[dest].push({
      delta: inverseDelta,
      range: transformRange(item.range, inverseDelta)
    });
    this.lastRecorded = 0;
    this.ignoreChange = true;
    this.quill.updateContents(item.delta, Quill.sources.USER);
    this.ignoreChange = false;
    this.restoreSelection(item);
  }
  clear() {
    this.stack = {
      undo: [],
      redo: []
    };
  }
  cutoff() {
    this.lastRecorded = 0;
  }
  record(changeDelta, oldDelta) {
    if (changeDelta.ops.length === 0)
      return;
    this.stack.redo = [];
    let undoDelta = changeDelta.invert(oldDelta);
    let undoRange = this.currentRange;
    const timestamp = Date.now();
    if (
      // @ts-expect-error Fix me later
      this.lastRecorded + this.options.delay > timestamp && this.stack.undo.length > 0
    ) {
      const item = this.stack.undo.pop();
      if (item) {
        undoDelta = undoDelta.compose(item.delta);
        undoRange = item.range;
      }
    } else {
      this.lastRecorded = timestamp;
    }
    if (undoDelta.length() === 0)
      return;
    this.stack.undo.push({
      delta: undoDelta,
      range: undoRange
    });
    if (this.stack.undo.length > this.options.maxStack) {
      this.stack.undo.shift();
    }
  }
  redo() {
    this.change("redo", "undo");
  }
  transform(delta) {
    transformStack(this.stack.undo, delta);
    transformStack(this.stack.redo, delta);
  }
  undo() {
    this.change("undo", "redo");
  }
  restoreSelection(stackItem) {
    if (stackItem.range) {
      this.quill.setSelection(stackItem.range, Quill.sources.USER);
    } else {
      const index = getLastChangeIndex(this.quill.scroll, stackItem.delta);
      this.quill.setSelection(index, Quill.sources.USER);
    }
  }
};
function transformStack(stack, delta) {
  let remoteDelta = delta;
  for (let i = stack.length - 1; i >= 0; i -= 1) {
    const oldItem = stack[i];
    stack[i] = {
      delta: remoteDelta.transform(oldItem.delta, true),
      range: oldItem.range && transformRange(oldItem.range, remoteDelta)
    };
    remoteDelta = oldItem.delta.transform(remoteDelta);
    if (stack[i].delta.length() === 0) {
      stack.splice(i, 1);
    }
  }
}
function endsWithNewlineChange(scroll, delta) {
  const lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null)
    return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === "string" && lastOp.insert.endsWith("\n");
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some((attr) => {
      return scroll.query(attr, Scope.BLOCK) != null;
    });
  }
  return false;
}
function getLastChangeIndex(scroll, delta) {
  const deleteLength = delta.reduce((length2, op) => {
    return length2 + (op.delete || 0);
  }, 0);
  let changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}
function transformRange(range, delta) {
  if (!range)
    return range;
  const start2 = delta.transformPosition(range.index);
  const end = delta.transformPosition(range.index + range.length);
  return {
    index: start2,
    length: end - start2
  };
}

// ../../node_modules/quill/modules/uploader.js
var import_quill_delta7 = __toESM(require_Delta(), 1);
var Uploader = class extends module_default {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener("drop", (e) => {
      e.preventDefault();
      let native = null;
      if (document.caretRangeFromPoint) {
        native = document.caretRangeFromPoint(e.clientX, e.clientY);
      } else if (document.caretPositionFromPoint) {
        const position = document.caretPositionFromPoint(e.clientX, e.clientY);
        native = document.createRange();
        native.setStart(position.offsetNode, position.offset);
        native.setEnd(position.offsetNode, position.offset);
      }
      const normalized = native && quill.selection.normalizeNative(native);
      if (normalized) {
        const range = quill.selection.normalizedToRange(normalized);
        if (e.dataTransfer?.files) {
          this.upload(range, e.dataTransfer.files);
        }
      }
    });
  }
  upload(range, files) {
    const uploads = [];
    Array.from(files).forEach((file) => {
      if (file && this.options.mimetypes?.includes(file.type)) {
        uploads.push(file);
      }
    });
    if (uploads.length > 0) {
      this.options.handler.call(this, range, uploads);
    }
  }
};
Uploader.DEFAULTS = {
  mimetypes: ["image/png", "image/jpeg"],
  handler(range, files) {
    if (!this.quill.scroll.query("image")) {
      return;
    }
    const promises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then((images) => {
      const update3 = images.reduce((delta, image) => {
        return delta.insert({
          image
        });
      }, new import_quill_delta7.default().retain(range.index).delete(range.length));
      this.quill.updateContents(update3, emitter_default.sources.USER);
      this.quill.setSelection(range.index + images.length, emitter_default.sources.SILENT);
    });
  }
};
var uploader_default = Uploader;

// ../../node_modules/quill/core.js
var import_quill_delta9 = __toESM(require_Delta(), 1);

// ../../node_modules/quill/modules/input.js
var import_quill_delta8 = __toESM(require_Delta(), 1);
var INSERT_TYPES = ["insertText", "insertReplacementText"];
var Input = class extends module_default {
  constructor(quill, options) {
    super(quill, options);
    quill.root.addEventListener("beforeinput", (event) => {
      this.handleBeforeInput(event);
    });
    if (!/Android/i.test(navigator.userAgent)) {
      quill.on(Quill.events.COMPOSITION_BEFORE_START, () => {
        this.handleCompositionStart();
      });
    }
  }
  deleteRange(range) {
    deleteRange({
      range,
      quill: this.quill
    });
  }
  replaceText(range) {
    let text2 = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    if (range.length === 0)
      return false;
    if (text2) {
      const formats = this.quill.getFormat(range.index, 1);
      this.deleteRange(range);
      this.quill.updateContents(new import_quill_delta8.default().retain(range.index).insert(text2, formats), Quill.sources.USER);
    } else {
      this.deleteRange(range);
    }
    this.quill.setSelection(range.index + text2.length, 0, Quill.sources.SILENT);
    return true;
  }
  handleBeforeInput(event) {
    if (this.quill.composition.isComposing || event.defaultPrevented || !INSERT_TYPES.includes(event.inputType)) {
      return;
    }
    const staticRange = event.getTargetRanges ? event.getTargetRanges()[0] : null;
    if (!staticRange || staticRange.collapsed === true) {
      return;
    }
    const text2 = getPlainTextFromInputEvent(event);
    if (text2 == null) {
      return;
    }
    const normalized = this.quill.selection.normalizeNative(staticRange);
    const range = normalized ? this.quill.selection.normalizedToRange(normalized) : null;
    if (range && this.replaceText(range, text2)) {
      event.preventDefault();
    }
  }
  handleCompositionStart() {
    const range = this.quill.getSelection();
    if (range) {
      this.replaceText(range);
    }
  }
};
function getPlainTextFromInputEvent(event) {
  if (typeof event.data === "string") {
    return event.data;
  }
  if (event.dataTransfer?.types.includes("text/plain")) {
    return event.dataTransfer.getData("text/plain");
  }
  return null;
}
var input_default = Input;

// ../../node_modules/quill/modules/uiNode.js
var isMac = /Mac/i.test(navigator.platform);
var TTL_FOR_VALID_SELECTION_CHANGE = 100;
var canMoveCaretBeforeUINode = (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight" || // RTL scripts or moving from the end of the previous line
  event.key === "ArrowUp" || event.key === "ArrowDown" || event.key === "Home") {
    return true;
  }
  if (isMac && event.key === "a" && event.ctrlKey === true) {
    return true;
  }
  return false;
};
var UINode = class extends module_default {
  isListening = false;
  selectionChangeDeadline = 0;
  constructor(quill, options) {
    super(quill, options);
    this.handleArrowKeys();
    this.handleNavigationShortcuts();
  }
  handleArrowKeys() {
    this.quill.keyboard.addBinding({
      key: ["ArrowLeft", "ArrowRight"],
      offset: 0,
      shiftKey: null,
      handler(range, _ref) {
        let {
          line,
          event
        } = _ref;
        if (!(line instanceof ParentBlot$1) || !line.uiNode) {
          return true;
        }
        const isRTL = getComputedStyle(line.domNode)["direction"] === "rtl";
        if (isRTL && event.key !== "ArrowRight" || !isRTL && event.key !== "ArrowLeft") {
          return true;
        }
        this.quill.setSelection(range.index - 1, range.length + (event.shiftKey ? 1 : 0), Quill.sources.USER);
        return false;
      }
    });
  }
  handleNavigationShortcuts() {
    this.quill.root.addEventListener("keydown", (event) => {
      if (!event.defaultPrevented && canMoveCaretBeforeUINode(event)) {
        this.ensureListeningToSelectionChange();
      }
    });
  }
  /**
   * We only listen to the `selectionchange` event when
   * there is an intention of moving the caret to the beginning using shortcuts.
   * This is primarily implemented to prevent infinite loops, as we are changing
   * the selection within the handler of a `selectionchange` event.
   */
  ensureListeningToSelectionChange() {
    this.selectionChangeDeadline = Date.now() + TTL_FOR_VALID_SELECTION_CHANGE;
    if (this.isListening)
      return;
    this.isListening = true;
    const listener = () => {
      this.isListening = false;
      if (Date.now() <= this.selectionChangeDeadline) {
        this.handleSelectionChange();
      }
    };
    document.addEventListener("selectionchange", listener, {
      once: true
    });
  }
  handleSelectionChange() {
    const selection = document.getSelection();
    if (!selection)
      return;
    const range = selection.getRangeAt(0);
    if (range.collapsed !== true || range.startOffset !== 0)
      return;
    const line = this.quill.scroll.find(range.startContainer);
    if (!(line instanceof ParentBlot$1) || !line.uiNode)
      return;
    const newRange = document.createRange();
    newRange.setStartAfter(line.uiNode);
    newRange.setEndAfter(line.uiNode);
    selection.removeAllRanges();
    selection.addRange(newRange);
  }
};
var uiNode_default = UINode;

// ../../node_modules/quill/core.js
Quill.register({
  "blots/block": Block,
  "blots/block/embed": BlockEmbed,
  "blots/break": break_default,
  "blots/container": container_default,
  "blots/cursor": cursor_default,
  "blots/embed": embed_default,
  "blots/inline": inline_default,
  "blots/scroll": scroll_default,
  "blots/text": Text2,
  "modules/clipboard": Clipboard,
  "modules/history": History,
  "modules/keyboard": Keyboard,
  "modules/uploader": uploader_default,
  "modules/input": input_default,
  "modules/uiNode": uiNode_default
});
var core_default = Quill;

// build/dev/javascript/novdom/quill_ffi.mjs
var blobs = [
  class BoldBlot extends inline_default {
    static blotName = "bold";
    static tagName = "strong";
    static defaultKey = ["b", "B"];
  },
  class ItalicBlot extends inline_default {
    static blotName = "italic";
    static tagName = "em";
    static defaultKey = ["i", "I"];
  },
  class UnderlineBlot extends inline_default {
    static blotName = "underline";
    static tagName = "u";
    static defaultKey = ["u", "U"];
  }
];
blobs.forEach((blob) => core_default.register(blob));
var bindings = blobs.reduce((acc, blob) => {
  acc[blob.blotName] = {
    key: blob.defaultKey[0],
    handler: () => {
    }
  };
  return acc;
}, {});
function init4(comp) {
  const elem = get_element(comp);
  const quill = new core_default(elem, {
    modules: {
      keyboard: {
        bindings
        // Remove all default bindings
      }
    }
  });
  quill.setContents(new import_quill_delta9.default());
  return quill;
}
function format(store2, format2) {
  const format_value = format2.constructor.name.toLowerCase();
  const is_set = store2.quill.getFormat()[format_value];
  return store2.quill.format(format_value, !is_set);
}

// build/dev/javascript/novdom/novdom/rich_text.mjs
var RichTextStore = class extends CustomType {
  constructor(quill, component2) {
    super();
    this.quill = quill;
    this.component = component2;
  }
};
var Bold = class extends CustomType {
};
var Italic = class extends CustomType {
};
function editor(store2) {
  return store2.component;
}
function store() {
  let comp = component("div", toList([]));
  let quill = init4(comp);
  return new RichTextStore(quill, comp);
}

// build/dev/javascript/app/app.mjs
function main() {
  return start(
    () => {
      configure_ids(
        toList([
          [
            "bold",
            toList([
              new Hotkey("KeyB", toList([new Short()])),
              new Hotkey("KeyB", toList([new Short(), new Shift()])),
              new Hotkey("KeyB", toList([new Short(), new Alt()]))
            ])
          ],
          [
            "italic",
            toList([
              new Hotkey("KeyI", toList([new Short()])),
              new Hotkey("KeyB", toList([new Short(), new Alt()]))
            ])
          ],
          ["underline", toList([new Hotkey("KeyU", toList([new Short()]))])]
        ])
      );
      let store2 = store();
      return div(
        toList([class$("p-5 bg-blue-100")]),
        toList([
          editor(store2),
          div(
            toList([
              class$("p-5 bg-blue-100 select-none"),
              onclick(
                with_hotkey(
                  new Id("bold"),
                  (_) => {
                    format(store2, new Bold());
                    return void 0;
                  }
                )
              ),
              onkeydown((_) => {
                return println("keydown");
              })
            ]),
            toList([text("Bold")])
          ),
          div(
            toList([
              class$("p-5 bg-blue-100 select-none"),
              onclick(
                with_hotkey(
                  new Id("italic"),
                  (_) => {
                    format(store2, new Italic());
                    return void 0;
                  }
                )
              ),
              onkeydown((_) => {
                return println("keydown");
              })
            ]),
            toList([text("Italic")])
          )
        ])
      );
    }
  );
}

// build/.lustre/entry.mjs
main();
/*! Bundled license information:

lodash-es/lodash.js:
  (**
   * @license
   * Lodash (Custom Build) <https://lodash.com/>
   * Build: `lodash modularize exports="es" -o ./`
   * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
   * Released under MIT license <https://lodash.com/license>
   * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
   * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
   *)
*/
