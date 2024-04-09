import * as vscode from "vscode";
import { Collection } from "./collection";
import JRPCClient from "../../jrpc-client";
import { AssetWallet } from "../../processes/src/asset-wallet";

export class AssetWallets extends Collection {
  constructor(jrpcClient: JRPCClient) {
    super("Asset Wallets", jrpcClient, vscode.TreeItemCollapsibleState.Expanded);
  }

  public async getChildren(): Promise<vscode.TreeItem[]> {
    return this.jrpcClient.dan_wallets().then((wallets) => {
      for (let id in wallets) {
        if (!this.hasChild(wallets[id].name)) {
          this.addChild(new AssetWallet(this.jrpcClient, wallets[id].name, wallets[id].is_running));
        }
      }
      return this._children;
    });
  }

  public async add() {
    let config = vscode.workspace.getConfiguration("tari");
    let resp = await this.jrpcClient.add_asset_wallet();
    this.addChild(new AssetWallet(this.jrpcClient, resp.name, true));
  }
}
