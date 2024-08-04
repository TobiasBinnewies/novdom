import * as $atom from "../../../gleam_erlang/gleam/erlang/atom.mjs";
import * as $dict from "../../../gleam_stdlib/gleam/dict.mjs";
import * as $dynamic from "../../../gleam_stdlib/gleam/dynamic.mjs";
import * as $list from "../../../gleam_stdlib/gleam/list.mjs";
import * as $pair from "../../../gleam_stdlib/gleam/pair.mjs";
import { toList, CustomType as $CustomType } from "../../gleam.mjs";

export class Binary extends $CustomType {}

export class Once extends $CustomType {}

export class Passive extends $CustomType {}

export class Count extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Active extends $CustomType {}

export class Backlog extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Nodelay extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Linger extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class SendTimeout extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class SendTimeoutClose extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Reuseaddr extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class ActiveMode extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Mode extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Certfile extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Keyfile extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class AlpnPreferredProtocols extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Inet6 extends $CustomType {}

export const default_options = toList([
  new Backlog(1024),
  new Nodelay(true),
  new SendTimeout(30_000),
  new SendTimeoutClose(true),
  new Reuseaddr(true),
  new Mode(new Binary()),
  new ActiveMode(new Passive()),
]);
