import * as $process from "../../../gleam_erlang/gleam/erlang/process.mjs";
import { Abnormal } from "../../../gleam_erlang/gleam/erlang/process.mjs";
import * as $actor from "../../../gleam_otp/gleam/otp/actor.mjs";
import * as $supervisor from "../../../gleam_otp/gleam/otp/supervisor.mjs";
import * as $function from "../../../gleam_stdlib/gleam/function.mjs";
import * as $iterator from "../../../gleam_stdlib/gleam/iterator.mjs";
import * as $option from "../../../gleam_stdlib/gleam/option.mjs";
import { None } from "../../../gleam_stdlib/gleam/option.mjs";
import * as $result from "../../../gleam_stdlib/gleam/result.mjs";
import { CustomType as $CustomType } from "../../gleam.mjs";
import * as $handler from "../../glisten/internal/handler.mjs";
import { Handler, Internal, Ready } from "../../glisten/internal/handler.mjs";
import * as $logger from "../../glisten/internal/logger.mjs";
import * as $socket from "../../glisten/socket.mjs";
import * as $transport from "../../glisten/transport.mjs";

export class AcceptConnection extends $CustomType {
  constructor(x0) {
    super();
    this[0] = x0;
  }
}

export class AcceptError extends $CustomType {}

export class HandlerError extends $CustomType {}

export class ControlError extends $CustomType {}

export class AcceptorState extends $CustomType {
  constructor(sender, socket, transport) {
    super();
    this.sender = sender;
    this.socket = socket;
    this.transport = transport;
  }
}

export class Pool extends $CustomType {
  constructor(listener_socket, handler, pool_count, on_init, on_close, transport) {
    super();
    this.listener_socket = listener_socket;
    this.handler = handler;
    this.pool_count = pool_count;
    this.on_init = on_init;
    this.on_close = on_close;
    this.transport = transport;
  }
}
