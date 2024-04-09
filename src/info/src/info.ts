import * as vscode from "vscode";
import { TAG, TariTreeItem } from "../../tari-tree-item";

export class Info extends TariTreeItem {
  constructor(public readonly label: string) {
    super(label, vscode.TreeItemCollapsibleState.None, TAG.info);
  }

  public show(): void {
    console.log("show");
  }
}
