import * as $atom from "../../../gleam_erlang/gleam/erlang/atom.mjs";
import * as $dict from "../../../gleam_stdlib/gleam/dict.mjs";
import * as $dynamic from "../../../gleam_stdlib/gleam/dynamic.mjs";
import * as $int from "../../../gleam_stdlib/gleam/int.mjs";
import * as $result from "../../../gleam_stdlib/gleam/result.mjs";
import * as $string from "../../../gleam_stdlib/gleam/string.mjs";
import * as $logging from "../../../logging/logging.mjs";
import { toList, CustomType as $CustomType } from "../../gleam.mjs";

export class Start extends $CustomType {}

export class Stop extends $CustomType {}

export class Mist extends $CustomType {}

export class ParseRequest extends $CustomType {}

export class ParseRequest2 extends $CustomType {}

export class DecodePacket extends $CustomType {}

export class ConvertPath extends $CustomType {}

export class ParseMethod extends $CustomType {}

export class ParseHeaders extends $CustomType {}

export class ParseRest extends $CustomType {}

export class ParsePath extends $CustomType {}

export class ParseTransport extends $CustomType {}

export class ParseHost extends $CustomType {}

export class ParsePort extends $CustomType {}

export class BuildRequest extends $CustomType {}

export class ReadData extends $CustomType {}

export class Http1Handler extends $CustomType {}

export class HttpUpgrade extends $CustomType {}

export class Http2Handler extends $CustomType {}

class Native extends $CustomType {}

class Microsecond extends $CustomType {}

export const events = toList([
  toList([new Mist(), new ParseRequest(), new Stop()]),
  toList([new Mist(), new ParseRequest2(), new Stop()]),
  toList([new Mist(), new Http1Handler(), new Stop()]),
  toList([new Mist(), new HttpUpgrade(), new Stop()]),
  toList([new Mist(), new Http2Handler(), new Stop()]),
  toList([new Mist(), new DecodePacket(), new Stop()]),
  toList([new Mist(), new ConvertPath(), new Stop()]),
  toList([new Mist(), new ParseMethod(), new Stop()]),
  toList([new Mist(), new ParseHeaders(), new Stop()]),
  toList([new Mist(), new ParseRest(), new Stop()]),
  toList([new Mist(), new ParsePath(), new Stop()]),
  toList([new Mist(), new ParseTransport(), new Stop()]),
  toList([new Mist(), new ParseHost(), new Stop()]),
  toList([new Mist(), new ParsePort(), new Stop()]),
  toList([new Mist(), new BuildRequest(), new Stop()]),
  toList([new Mist(), new ReadData(), new Stop()]),
]);
