import * as $bit_array from "../../../../gleam_stdlib/gleam/bit_array.mjs";
import * as $list from "../../../../gleam_stdlib/gleam/list.mjs";
import * as $option from "../../../../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../../../../gleam_stdlib/gleam/option.mjs";
import * as $result from "../../../../gleam_stdlib/gleam/result.mjs";
import * as $logging from "../../../../logging/logging.mjs";
import {
  Ok,
  Error,
  toList,
  CustomType as $CustomType,
  makeError,
  toBitArray,
  sizedInt,
} from "../../../gleam.mjs";

class StreamIdentifier extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class HeaderPriority extends $CustomType {
  constructor(exclusive, stream_dependency, weight) {
    super();
    this.exclusive = exclusive;
    this.stream_dependency = stream_dependency;
    this.weight = weight;
  }
}

export class Complete extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Continued extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Enabled extends $CustomType {}

export class Disabled extends $CustomType {}

export class HeaderTableSize extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class ServerPush extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class MaxConcurrentStreams extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class InitialWindowSize extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class MaxFrameSize extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class MaxHeaderListSize extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Data extends $CustomType {
  constructor(data, end_stream, identifier) {
    super();
    this.data = data;
    this.end_stream = end_stream;
    this.identifier = identifier;
  }
}

export class Header extends $CustomType {
  constructor(data, end_stream, identifier, priority) {
    super();
    this.data = data;
    this.end_stream = end_stream;
    this.identifier = identifier;
    this.priority = priority;
  }
}

export class Priority extends $CustomType {
  constructor(exclusive, identifier, stream_dependency, weight) {
    super();
    this.exclusive = exclusive;
    this.identifier = identifier;
    this.stream_dependency = stream_dependency;
    this.weight = weight;
  }
}

export class Termination extends $CustomType {
  constructor(error, identifier) {
    super();
    this.error = error;
    this.identifier = identifier;
  }
}

export class Settings extends $CustomType {
  constructor(ack, settings) {
    super();
    this.ack = ack;
    this.settings = settings;
  }
}

export class PushPromise extends $CustomType {
  constructor(data, identifier, promised_stream_id) {
    super();
    this.data = data;
    this.identifier = identifier;
    this.promised_stream_id = promised_stream_id;
  }
}

export class Ping extends $CustomType {
  constructor(ack, data) {
    super();
    this.ack = ack;
    this.data = data;
  }
}

export class GoAway extends $CustomType {
  constructor(data, error, last_stream_id) {
    super();
    this.data = data;
    this.error = error;
    this.last_stream_id = last_stream_id;
  }
}

export class WindowUpdate extends $CustomType {
  constructor(amount, identifier) {
    super();
    this.amount = amount;
    this.identifier = identifier;
  }
}

export class Continuation extends $CustomType {
  constructor(data, identifier) {
    super();
    this.data = data;
    this.identifier = identifier;
  }
}

export class NoError extends $CustomType {}

export class ProtocolError extends $CustomType {}

export class InternalError extends $CustomType {}

export class FlowControlError extends $CustomType {}

export class SettingsTimeout extends $CustomType {}

export class StreamClosed extends $CustomType {}

export class FrameSizeError extends $CustomType {}

export class RefusedStream extends $CustomType {}

export class Cancel extends $CustomType {}

export class CompressionError extends $CustomType {}

export class ConnectError extends $CustomType {}

export class EnhanceYourCalm extends $CustomType {}

export class InadequateSecurity extends $CustomType {}

export class Http11Required extends $CustomType {}

export class Unsupported extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export function stream_identifier(value) {
  return new StreamIdentifier(value);
}

export function get_stream_identifier(identifier) {
  let value = identifier[0];
  return value;
}

function parse_priority(identifier, flags, length, payload) {
  let $ = toBitArray([flags.buffer, payload.buffer]);
  if (length === 5 && $.length == 5 && (identifier !== 0)) {
    let exclusive = $.intFromSlice(1, 1);
    let dependency = $.intFromSlice(1, 4);
    let weight = $.intFromSlice(4, 5);
    return new Ok(
      new Priority(
        exclusive === 1,
        stream_identifier(identifier),
        stream_identifier(dependency),
        weight,
      ),
    );
  } else if (length === 5) {
    return new Error(new ProtocolError());
  } else {
    return new Error(new FrameSizeError());
  }
}

function parse_window_update(identifier, flags, length, payload) {
  let $ = toBitArray([flags.buffer, payload.buffer]);
  if (length === 4 && $.length == 4 && ($.intFromSlice(1, 4) !== 0)) {
    let window_size = $.intFromSlice(1, 4);
    return new Ok(new WindowUpdate(window_size, stream_identifier(identifier)));
  } else if (length === 4) {
    return new Error(new FrameSizeError());
  } else {
    return new Error(new ProtocolError());
  }
}

function get_error(value) {
  if (value === 0) {
    return new NoError();
  } else if (value === 1) {
    return new ProtocolError();
  } else if (value === 2) {
    return new InternalError();
  } else if (value === 3) {
    return new FlowControlError();
  } else if (value === 4) {
    return new SettingsTimeout();
  } else if (value === 5) {
    return new StreamClosed();
  } else if (value === 6) {
    return new FrameSizeError();
  } else if (value === 7) {
    return new RefusedStream();
  } else if (value === 8) {
    return new Cancel();
  } else if (value === 9) {
    return new CompressionError();
  } else if (value === 10) {
    return new ConnectError();
  } else if (value === 11) {
    return new EnhanceYourCalm();
  } else if (value === 12) {
    return new InadequateSecurity();
  } else if (value === 13) {
    return new Http11Required();
  } else {
    let n = value;
    return new Unsupported(n);
  }
}

function parse_termination(identifier, flags, length, payload) {
  let $ = toBitArray([flags.buffer, payload.buffer]);
  if (length === 4 && $.length == 5 && (identifier !== 0)) {
    let error = $.intFromSlice(1, 5);
    return new Ok(
      new Termination(get_error(error), stream_identifier(identifier)),
    );
  } else if (length === 4) {
    return new Error(new ProtocolError());
  } else {
    return new Error(new FrameSizeError());
  }
}

function get_setting(identifier, value) {
  if (identifier === 1) {
    return new Ok(new HeaderTableSize(value));
  } else if (identifier === 2) {
    return new Ok(
      new ServerPush(
        (() => {
          if (value === 0) {
            return new Disabled();
          } else if (value === 1) {
            return new Enabled();
          } else {
            throw makeError(
              "panic",
              "mist/internal/http2/frame",
              638,
              "get_setting",
              "Somehow a bit was neither 0 nor 1",
              {}
            )
          }
        })(),
      ),
    );
  } else if (identifier === 3) {
    return new Ok(new MaxConcurrentStreams(value));
  } else if (identifier === 4) {
    if (value > 2_147_483_647) {
      let n = value;
      return new Error(new FlowControlError());
    } else {
      return new Ok(new InitialWindowSize(value));
    }
  } else if (identifier === 5) {
    if (value > 16_777_215) {
      let n = value;
      return new Error(new ProtocolError());
    } else {
      return new Ok(new MaxFrameSize(value));
    }
  } else if (identifier === 6) {
    return new Ok(new MaxHeaderListSize(value));
  } else {
    return new Error(new ProtocolError());
  }
}

function from_bool(bool) {
  if (bool) {
    return 1;
  } else {
    return 0;
  }
}

function encode_priority(priority) {
  if (priority instanceof Some &&
  priority[0] instanceof HeaderPriority &&
  priority[0].stream_dependency instanceof StreamIdentifier) {
    let exclusive = priority[0].exclusive;
    let dependency = priority[0].stream_dependency[0];
    let weight = priority[0].weight;
    let exclusive$1 = from_bool(exclusive);
    return toBitArray([
      sizedInt(exclusive$1, 1),
      sizedInt(dependency, 31),
      sizedInt(weight, 8),
    ]);
  } else {
    return toBitArray([]);
  }
}

function encode_data(data) {
  if (data instanceof Complete) {
    let data$1 = data[0];
    return [1, data$1];
  } else {
    let data$1 = data[0];
    return [0, data$1];
  }
}

function encode_error(error) {
  if (error instanceof NoError) {
    return 0;
  } else if (error instanceof ProtocolError) {
    return 1;
  } else if (error instanceof InternalError) {
    return 2;
  } else if (error instanceof FlowControlError) {
    return 3;
  } else if (error instanceof SettingsTimeout) {
    return 4;
  } else if (error instanceof StreamClosed) {
    return 5;
  } else if (error instanceof FrameSizeError) {
    return 6;
  } else if (error instanceof RefusedStream) {
    return 7;
  } else if (error instanceof Cancel) {
    return 8;
  } else if (error instanceof CompressionError) {
    return 9;
  } else if (error instanceof ConnectError) {
    return 10;
  } else if (error instanceof EnhanceYourCalm) {
    return 11;
  } else if (error instanceof InadequateSecurity) {
    return 12;
  } else if (error instanceof Http11Required) {
    return 13;
  } else {
    return 69;
  }
}

function encode_settings(settings) {
  return $list.fold(
    settings,
    toBitArray([]),
    (acc, setting) => {
      if (setting instanceof HeaderTableSize) {
        let value = setting[0];
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(1, 16), sizedInt(value, 32)]),
        );
      } else if (setting instanceof ServerPush && setting[0] instanceof Enabled) {
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(2, 16), sizedInt(1, 32)]),
        );
      } else if (setting instanceof ServerPush && setting[0] instanceof Disabled) {
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(2, 16), sizedInt(0, 32)]),
        );
      } else if (setting instanceof MaxConcurrentStreams) {
        let value = setting[0];
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(3, 16), sizedInt(value, 32)]),
        );
      } else if (setting instanceof InitialWindowSize) {
        let value = setting[0];
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(4, 16), sizedInt(value, 32)]),
        );
      } else if (setting instanceof MaxFrameSize) {
        let value = setting[0];
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(5, 16), sizedInt(value, 32)]),
        );
      } else {
        let value = setting[0];
        return $bit_array.append(
          acc,
          toBitArray([sizedInt(6, 16), sizedInt(value, 32)]),
        );
      }
    },
  );
}

export function encode(frame) {
  if (frame instanceof Data && frame.identifier instanceof StreamIdentifier) {
    let data = frame.data;
    let end_stream = frame.end_stream;
    let identifier = frame.identifier[0];
    let length = $bit_array.byte_size(data);
    let end = from_bool(end_stream);
    return toBitArray([
      sizedInt(length, 24),
      sizedInt(0, 8),
      sizedInt(0, 4),
      sizedInt(0, 1),
      sizedInt(0, 2),
      sizedInt(end, 1),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      data.buffer,
    ]);
  } else if (frame instanceof Header &&
  frame.identifier instanceof StreamIdentifier) {
    let data = frame.data;
    let end_stream = frame.end_stream;
    let identifier = frame.identifier[0];
    let priority = frame.priority;
    let $ = encode_data(data);
    let end_header = $[0];
    let data$1 = $[1];
    let length = $bit_array.byte_size(data$1);
    let end = from_bool(end_stream);
    let priority_flags = encode_priority(priority);
    let has_priority = from_bool($option.is_some(priority));
    return toBitArray([
      sizedInt(length, 24),
      sizedInt(1, 8),
      sizedInt(0, 2),
      sizedInt(has_priority, 1),
      sizedInt(0, 1),
      sizedInt(0, 1),
      sizedInt(end_header, 1),
      sizedInt(0, 1),
      sizedInt(end, 1),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      priority_flags.buffer,
      data$1.buffer,
    ]);
  } else if (frame instanceof Priority &&
  frame.identifier instanceof StreamIdentifier &&
  frame.stream_dependency instanceof StreamIdentifier) {
    let exclusive = frame.exclusive;
    let identifier = frame.identifier[0];
    let dependency = frame.stream_dependency[0];
    let weight = frame.weight;
    let exclusive$1 = from_bool(exclusive);
    return toBitArray([
      sizedInt(5, 24),
      sizedInt(2, 2),
      sizedInt(0, 8),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      sizedInt(exclusive$1, 1),
      sizedInt(dependency, 31),
      sizedInt(weight, 8),
    ]);
  } else if (frame instanceof Termination &&
  frame.identifier instanceof StreamIdentifier) {
    let error = frame.error;
    let identifier = frame.identifier[0];
    let error_code = encode_error(error);
    return toBitArray([
      sizedInt(4, 24),
      sizedInt(3, 8),
      sizedInt(0, 8),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      sizedInt(error_code, 32),
    ]);
  } else if (frame instanceof Settings) {
    let ack = frame.ack;
    let settings = frame.settings;
    let ack$1 = from_bool(ack);
    let settings$1 = encode_settings(settings);
    let length = $bit_array.byte_size(settings$1);
    return toBitArray([
      sizedInt(length, 24),
      sizedInt(4, 8),
      sizedInt(0, 7),
      sizedInt(ack$1, 1),
      sizedInt(0, 1),
      sizedInt(0, 31),
      settings$1.buffer,
    ]);
  } else if (frame instanceof PushPromise &&
  frame.identifier instanceof StreamIdentifier &&
  frame.promised_stream_id instanceof StreamIdentifier) {
    let data = frame.data;
    let identifier = frame.identifier[0];
    let promised_identifier = frame.promised_stream_id[0];
    let $ = encode_data(data);
    let end_headers = $[0];
    let data$1 = $[1];
    return toBitArray([
      sizedInt(0, 24),
      sizedInt(5, 8),
      sizedInt(0, 4),
      sizedInt(0, 0),
      sizedInt(end_headers, 1),
      sizedInt(0, 2),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      sizedInt(0, 1),
      sizedInt(promised_identifier, 31),
      data$1.buffer,
    ]);
  } else if (frame instanceof Ping) {
    let ack = frame.ack;
    let data = frame.data;
    let ack$1 = from_bool(ack);
    return toBitArray([
      sizedInt(0, 24),
      sizedInt(6, 8),
      sizedInt(0, 7),
      sizedInt(ack$1, 1),
      sizedInt(0, 1),
      sizedInt(0, 31),
      data.buffer,
    ]);
  } else if (frame instanceof GoAway &&
  frame.last_stream_id instanceof StreamIdentifier) {
    let data = frame.data;
    let error = frame.error;
    let last_stream_id = frame.last_stream_id[0];
    let error$1 = encode_error(error);
    let payload_size = $bit_array.byte_size(data);
    return toBitArray([
      sizedInt(payload_size, 24),
      sizedInt(7, 8),
      sizedInt(0, 8),
      sizedInt(0, 1),
      sizedInt(0, 31),
      sizedInt(0, 1),
      sizedInt(last_stream_id, 31),
      sizedInt(error$1, 32),
      data.buffer,
    ]);
  } else if (frame instanceof WindowUpdate &&
  frame.identifier instanceof StreamIdentifier) {
    let amount = frame.amount;
    let identifier = frame.identifier[0];
    return toBitArray([
      sizedInt(4, 24),
      sizedInt(8, 8),
      sizedInt(0, 8),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      sizedInt(0, 1),
      sizedInt(amount, 31),
    ]);
  } else {
    let data = frame.data;
    let identifier = frame.identifier[0];
    let $ = encode_data(data);
    let end_headers = $[0];
    let data$1 = $[1];
    let payload_size = $bit_array.byte_size(data$1);
    return toBitArray([
      sizedInt(payload_size, 24),
      sizedInt(9, 8),
      sizedInt(0, 5),
      sizedInt(end_headers, 1),
      sizedInt(0, 2),
      sizedInt(0, 1),
      sizedInt(identifier, 31),
      data$1.buffer,
    ]);
  }
}

export function settings_ack() {
  return new Settings(true, toList([]));
}
