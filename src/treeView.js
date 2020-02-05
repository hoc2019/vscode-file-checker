const vscode = require("vscode");

let imageList = [];
let unusedImageList = [];

const differenceWith = (arr, val, comp) =>
  arr.filter(a => val.findIndex(b => comp(a, b)) === -1);

class Dependency extends vscode.TreeItem {
  constructor(label, collapsibleState) {
    super(label, collapsibleState);
  }
  get tooltip() {
    return `删除 ${this.label}`;
  }
  get command() {
    return {
      title: this.label, // 标题
      command: "itemClick", // 命令 ID
      tooltip: this.label, // 鼠标覆盖时的小小提示框
      arguments: [
        // 向 registerCommand 传递的参数。
        this.label // 目前这里我们只传递一个 label
      ]
    };
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
  initUnusedTreeView(useList, fileList);
}

function initUnusedTreeView(useList, fileList) {
  const useImageList = [...new Set(useList)];
  unusedImageList = differenceWith(fileList, useImageList, (a, b) => a === b);
  vscode.window.registerTreeDataProvider(
    "unused-file",
    new UnusedTreeViewProvider()
  );
}

function getUnusedList() {
  return unusedImageList;
}

module.exports = {
  initUnusedTreeView,
  updateTreeView,
  getUnusedList
};
