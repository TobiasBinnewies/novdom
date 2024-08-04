import * as $list from "../../gleam_stdlib/gleam/list.mjs";
import { toList, prepend as listPrepend, CustomType as $CustomType } from "../gleam.mjs";
import * as $attribute from "../novdom/attribute.mjs";
import { style } from "../novdom/attribute.mjs";
import * as $component from "../novdom/component.mjs";
import * as $html from "../novdom/html.mjs";
import { div } from "../novdom/html.mjs";

export class Top extends $CustomType {}

export class Bottom extends $CustomType {}

export class Left extends $CustomType {}

export class Right extends $CustomType {}

export class Center extends $CustomType {}

export class TopLeft extends $CustomType {}

export class TopRight extends $CustomType {}

export class BottomLeft extends $CustomType {}

export class BottomRight extends $CustomType {}

export class Gap extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class NoSpacing extends $CustomType {}

export class EvenSpacing extends $CustomType {}

export class BetweenSpacing extends $CustomType {}

export class AroundSpacing extends $CustomType {}

export class VerticalDirection extends $CustomType {}

export class HorizontalDirection extends $CustomType {}

export class VerticalScroll extends $CustomType {}

export class HorizontalScroll extends $CustomType {}

export class Scroll extends $CustomType {}

export class NoScroll extends $CustomType {}

export function zstack(alignment, children) {
  let position = (() => {
    if (alignment instanceof Top) {
      return toList([["left", "50%"], ["transform", "translateX(-50%)"]]);
    } else if (alignment instanceof Bottom) {
      return toList([
        ["left", "50%"],
        ["bottom", "0"],
        ["transform", "translateX(-50%)"],
      ]);
    } else if (alignment instanceof Left) {
      return toList([["top", "50%"], ["transform", "translateY(-50%)"]]);
    } else if (alignment instanceof Right) {
      return toList([
        ["top", "50%"],
        ["right", "0"],
        ["transform", "translateY(-50%)"],
      ]);
    } else if (alignment instanceof Center) {
      return toList([
        ["top", "50%"],
        ["left", "50%"],
        ["transform", "translate(-50%, -50%)"],
      ]);
    } else if (alignment instanceof TopLeft) {
      return toList([]);
    } else if (alignment instanceof TopRight) {
      return toList([["right", "0"]]);
    } else if (alignment instanceof BottomLeft) {
      return toList([["bottom", "0"]]);
    } else {
      return toList([["bottom", "0"], ["right", "0"]]);
    }
  })();
  let children$1 = $list.map(
    children,
    (c) => {
      return div(
        toList([
          style(
            listPrepend(
              ["position", "absolute"],
              listPrepend(
                ["min-width", "max-content"],
                listPrepend(
                  ["min-height", "max-content"],
                  listPrepend(["overflow", "hidden"], position),
                ),
              ),
            ),
          ),
        ]),
        toList([c]),
      );
    },
  );
  return div(
    toList([
      style(
        toList([
          ["display", "block"],
          ["position", "relative"],
          ["height", "100%"],
          ["width", "100%"],
        ]),
      ),
    ]),
    children$1,
  );
}

export function stack(direction, alignment, spacing, scrolling, children) {
  let spacing$1 = (() => {
    if (spacing instanceof Gap) {
      let value = spacing[0];
      return ["gap", value];
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
  let $ = (() => {
    if (direction instanceof VerticalDirection) {
      return [
        "column",
        (() => {
          if (alignment instanceof Left) {
            return "flex-start";
          } else if (alignment instanceof Right) {
            return "flex-end";
          } else {
            return "center";
          }
        })(),
      ];
    } else {
      return [
        "row",
        (() => {
          if (alignment instanceof Top) {
            return "flex-start";
          } else if (alignment instanceof Bottom) {
            return "flex-end";
          } else {
            return "center";
          }
        })(),
      ];
    }
  })();
  let direction$1 = $[0];
  let align = $[1];
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
  return div(
    toList([
      style(
        toList([
          ["height", "100%"],
          ["width", "100%"],
          ["display", "flex"],
          ["flex-direction", direction$1],
          ["align-items", align],
          overflow,
          spacing$1,
        ]),
      ),
    ]),
    children,
  );
}

export function vstack(alignment, spacing, children) {
  return stack(
    new VerticalDirection(),
    alignment,
    spacing,
    new NoScroll(),
    children,
  );
}

export function vscroll(alignment, spacing, children) {
  return stack(
    new VerticalDirection(),
    alignment,
    spacing,
    new VerticalScroll(),
    children,
  );
}

export function hstack(alignment, spacing, children) {
  return stack(
    new HorizontalDirection(),
    alignment,
    spacing,
    new NoScroll(),
    children,
  );
}

export function hscroll(alignment, spacing, children) {
  return stack(
    new HorizontalDirection(),
    alignment,
    spacing,
    new HorizontalScroll(),
    children,
  );
}
