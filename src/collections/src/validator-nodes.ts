import * as vscode from "vscode";
import { Collection } from "./collection";
import JRPCClient from "../../jrpc-client";
import { ValidatorNode } from "../../processes/src/validator-node";

export class ValidatorNodes extends Collection {
  constructor(jrpcClient: JRPCClient) {
    super("Validator Nodes", jrpcClient, vscode.TreeItemCollapsibleState.Expanded);
  }

  public async getChildren(): Promise<vscode.TreeItem[]> {
    return this.jrpcClient.vns().then((vns) => {
      for (let id in vns) {
        if (!this.hasChild(vns[id].name)) {
          this.addChild(new ValidatorNode(this.jrpcClient, vns[id].name, vns[id].is_running));
        }
      }
      return this._children;
    });
  }

  public async add() {
    let config = vscode.workspace.getConfiguration("tari");
    let resp = await this.jrpcClient.add_validator_node();
    this.addChild(new ValidatorNode(this.jrpcClient, resp.name, true));
  }
}
