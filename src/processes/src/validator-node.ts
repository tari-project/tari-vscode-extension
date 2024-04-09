import * as vscode from "vscode";
import { Process } from "./process";
import type JRPCClient from "../../jrpc-client";
import { TAG } from "../../tari-tree-item";

export class ValidatorNode extends Process {
  constructor(public jrpcClient: JRPCClient, public readonly label: string, is_running: boolean) {
    super(jrpcClient, label, is_running);
    this.addTag(TAG.webui);
  }

  public async webui() {
    let url = await this.jrpcClient.http(this.label);
    vscode.env.openExternal(vscode.Uri.parse(url));
  }
}
