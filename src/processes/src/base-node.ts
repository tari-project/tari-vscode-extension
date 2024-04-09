import * as vscode from "vscode";
import { Process } from "./process";
import type JRPCClient from "../../jrpc-client";

export class BaseNode extends Process {
  constructor(public jrpcClient: JRPCClient, public readonly label: string, is_running: boolean) {
    super(jrpcClient, label, is_running);
  }
}
