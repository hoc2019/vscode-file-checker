const vscode = require("vscode");
const path = require("path");
const getImagesList = require("./files");

let imageList = [];

class Dependency extends vscode.TreeItem {
  constructor(label, collapsibleState, command) {
    super(label, collapsibleState);
  }
}

class TreeViewProvider {
  getTreeItem(element) {
    return element;
  }
  getChildren() {
    return imageList.map(
      item => new Dependency(item, vscode.TreeItemCollapsibleState.None)
    );
  }
}

function initAllTreeView(rootPath, fileDir) {
  imageList = getImagesList(rootPath, fileDir);
  vscode.window.registerTreeDataProvider("all-file", new TreeViewProvider());
}

module.exports = { initAllTreeView };
