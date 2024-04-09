import * as vscode from "vscode";
import { Collection } from "./collection";
import * as fs from "fs";
import * as path from "path";
import JRPCClient from "../../jrpc-client";
import { BaseWallet } from "../../processes/src/base-wallet";

export class BaseWallets extends Collection {
  constructor(jrpcClient: JRPCClient) {
    super("Base Wallets", jrpcClient, vscode.TreeItemCollapsibleState.Expanded);
  }

  public async getChildren(): Promise<vscode.TreeItem[]> {
    return this.jrpcClient.base_wallets().then((base_wallets) => {
      this._children = [];
      for (let id in base_wallets) {
        if (!this.hasChild(base_wallets[id].name)) {
          this.addChild(new BaseWallet(this.jrpcClient, base_wallets[id].name, base_wallets[id].is_running));
        }
      }
      return this._children;
    });
  }

  public async add() {
    let config = vscode.workspace.getConfiguration("tari");
    let resp = await this.jrpcClient.add_base_wallet();
    this.addChild(new BaseWallet(this.jrpcClient, resp.name, true));
  }
}
