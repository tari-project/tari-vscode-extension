import * as vscode from "vscode";

// Do not add tags with spaces, the tags are joined with spaces to the contextValue
export enum TAG {
  process = "process",
  collection = "collection",
  info = "info",
  is_running = "is_running",
  webui = "web_ui",
}

export class TariTreeItem extends vscode.TreeItem {
  private tags: string[];
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None,
    initialTag: TAG
  ) {
    super(label, collapsibleState);
    this.tags = [initialTag];
    this.setContextValue();
  }

  private setContextValue() {
    this.contextValue = this.tags.join(" ");
  }

  public addTag(tag: TAG) {
    this.tags.push(tag);
    this.setContextValue();
  }

  public removeTag(tag: TAG) {
    this.tags = this.tags.filter((value) => value !== tag);
    this.setContextValue();
  }
}
