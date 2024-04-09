import * as vscode from "vscode";
import { type Info } from "../../info";
import type JRPCClient from "../../jrpc-client";
import { TAG, TariTreeItem } from "../../tari-tree-item";

export class Process extends TariTreeItem {
  public children: Info[] = [];

  constructor(
    public readonly jrpcClient: JRPCClient,
    public readonly label: string,
    is_running: boolean,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None
  ) {
    super(label, collapsibleState, TAG.process);
    if (is_running) {
      this.addTag(TAG.is_running);
    }
  }

  public async stop() {
    await this.jrpcClient.stop(this.label);
    this.removeTag(TAG.is_running);
  }
  public async start() {
    await this.jrpcClient.start(this.label);
    this.addTag(TAG.is_running);
  }
  public async is_running() {
    await this.jrpcClient.is_running(this.label);
  }
  public async webui() {}
  public async logs() {
    return await this.jrpcClient.get_logs(this.label);
  }
}
