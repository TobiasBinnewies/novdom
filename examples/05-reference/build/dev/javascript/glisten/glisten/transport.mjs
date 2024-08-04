import * as $atom from "../../gleam_erlang/gleam/erlang/atom.mjs";
import * as $process from "../../gleam_erlang/gleam/erlang/process.mjs";
import * as $bytes_builder from "../../gleam_stdlib/gleam/bytes_builder.mjs";
import * as $dict from "../../gleam_stdlib/gleam/dict.mjs";
import * as $dynamic from "../../gleam_stdlib/gleam/dynamic.mjs";
import { CustomType as $CustomType } from "../gleam.mjs";
import * as $socket from "../glisten/socket.mjs";
import * as $options from "../glisten/socket/options.mjs";
import * as $ssl from "../glisten/ssl.mjs";
import * as $tcp from "../glisten/tcp.mjs";

export class Tcp extends $CustomType {}

export class Ssl extends $CustomType {}
