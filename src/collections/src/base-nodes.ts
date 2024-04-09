import * as vscode from "vscode";
import { Collection } from "./collection";
import { BaseNode } from "../../processes/src/base-node";
import JRPCClient from "../../jrpc-client";

export class BaseNodes extends Collection {
  constructor(jrpcClient: JRPCClient) {
    super("Base Nodes", jrpcClient, vscode.TreeItemCollapsibleState.Expanded);
  }

  public async getChildren(): Promise<vscode.TreeItem[]> {
    return this.jrpcClient.base_nodes().then((base_nodes) => {
      for (let id in base_nodes) {
        if (!this.hasChild(base_nodes[id].name)) {
          this.addChild(new BaseNode(this.jrpcClient, base_nodes[id].name, base_nodes[id].is_running));
        }
      }
      return this._children;
    });
  }

  public async add() {
    let config = vscode.workspace.getConfiguration("tari");
    let resp = await this.jrpcClient.add_base_node();
    this.addChild(new BaseNode(this.jrpcClient, resp.name, true));
  }
}
