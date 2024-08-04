import * as $process from "../gleam_erlang/gleam/erlang/process.mjs";
import * as $actor from "../gleam_otp/gleam/otp/actor.mjs";
import * as $supervisor from "../gleam_otp/gleam/otp/supervisor.mjs";
import * as $bytes_builder from "../gleam_stdlib/gleam/bytes_builder.mjs";
import * as $dynamic from "../gleam_stdlib/gleam/dynamic.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { None, Some } from "../gleam_stdlib/gleam/option.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import { CustomType as $CustomType } from "./gleam.mjs";
import * as $acceptor from "./glisten/internal/acceptor.mjs";
import { Pool } from "./glisten/internal/acceptor.mjs";
import * as $handler from "./glisten/internal/handler.mjs";
import * as $socket from "./glisten/socket.mjs";
import { Closed, Timeout } from "./glisten/socket.mjs";
import * as $options from "./glisten/socket/options.mjs";
import { Certfile, Keyfile } from "./glisten/socket/options.mjs";
import * as $ssl from "./glisten/ssl.mjs";
import * as $tcp from "./glisten/tcp.mjs";
import * as $transport from "./glisten/transport.mjs";

export class ListenerClosed extends $CustomType {}

export class ListenerTimeout extends $CustomType {}

export class AcceptorTimeout extends $CustomType {}

export class AcceptorFailed extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class AcceptorCrashed extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class SystemError extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Packet extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class User extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class Connection extends $CustomType {
  constructor(client_ip, socket, transport, subject) {
    super();
    this.client_ip = client_ip;
    this.socket = socket;
    this.transport = transport;
    this.subject = subject;
  }
}

class Handler extends $CustomType {
  constructor(on_init, loop, on_close, pool_size) {
    super();
    this.on_init = on_init;
    this.loop = loop;
    this.on_close = on_close;
    this.pool_size = pool_size;
  }
}

function convert_on_init(on_init) {
  return (conn) => {
    let connection = new Connection(
      conn.client_ip,
      conn.socket,
      conn.transport,
      conn.sender,
    );
    return on_init(connection);
  };
}

export function handler(on_init, loop) {
  return new Handler(on_init, loop, new None(), 10);
}

export function with_close(handler, on_close) {
  return handler.withFields({ on_close: new Some(on_close) });
}

export function with_pool_size(handler, size) {
  return handler.withFields({ pool_size: size });
}
