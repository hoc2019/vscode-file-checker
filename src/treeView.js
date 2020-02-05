const vscode = require("vscode");

let imageList = [];
let unusedImageList = [];

const differenceWith = (arr, val, comp) =>
  arr.filter(a => val.findIndex(b => comp(a, b)) === -1);

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
class UnusedTreeViewProvider {
  getTreeItem(element) {
    return element;
  }
  getChildren() {
    return unusedImageList.map(
      item => new Dependency(item, vscode.TreeItemCollapsibleState.None)
    );
  }
}

function updateTreeView(useList, fileList) {
  initAllTreeView(fileList);
  initUnusedTreeView(useList, fileList);
}

function initAllTreeView(fileList) {
  imageList = fileList;
  vscode.window.registerTreeDataProvider("all-file", new TreeViewProvider());
}

function initUnusedTreeView(useList, fileList) {
  const useImageList = [...new Set(useList)];
  unusedImageList = differenceWith(fileList, useImageList, (a, b) => a === b);
  vscode.window.registerTreeDataProvider(
    "unused-file",
    new UnusedTreeViewProvider()
  );
}

module.exports = { initAllTreeView, initUnusedTreeView, updateTreeView };
