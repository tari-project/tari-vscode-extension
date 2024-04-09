import * as vscode from "vscode";
import { Collection } from "./collection";
import JRPCClient from "../../jrpc-client";
import { Indexer } from "../../processes/src/indexer";

export class Indexers extends Collection {
  constructor(jrpcClient: JRPCClient) {
    super("Indexers", jrpcClient, vscode.TreeItemCollapsibleState.Expanded);
  }

  public async getChildren(): Promise<vscode.TreeItem[]> {
    return this.jrpcClient.indexers().then((indexers) => {
      this._children = [];
      for (let id in indexers) {
        if (!this.hasChild(indexers[id].name)) {
          this.addChild(new Indexer(this.jrpcClient, indexers[id].name, indexers[id].is_running));
        }
      }
      return this._children;
    });
  }

  public async add() {
    let config = vscode.workspace.getConfiguration("tari");
    let resp = await this.jrpcClient.add_indexer();
    this.addChild(new Indexer(this.jrpcClient, resp.name, true));
  }
}
