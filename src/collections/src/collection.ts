import * as vscode from "vscode";
import * as os from "os";
import type JRPCClient from "../../jrpc-client";
import { TAG, TariTreeItem } from "../../tari-tree-item";

export abstract class Collection extends TariTreeItem {
  protected _children: vscode.TreeItem[];

  constructor(
    public readonly label: string,
    public readonly jrpcClient: JRPCClient,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState
  ) {
    super(label, collapsibleState, TAG.collection);
    this._children = [];
  }

  public async add() {}

  public abstract getChildren(): Promise<vscode.TreeItem[]>;

  public getPath(): string {
    return os.homedir();
  }

  protected addChild(child: vscode.TreeItem): void {
    this._children.push(child);
  }

  protected hasChild(name: string): boolean {
    for (let child of this._children) {
      if (child.label === name) {
        return true;
      }
    }
    return false;
  }
}
