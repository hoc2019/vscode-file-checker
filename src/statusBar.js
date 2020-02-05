/*
 * @Author: wangzongyu
 * @Date: 2020-02-05 17:22:28
 * @LastEditors  : wangzongyu
 * @LastEditTime : 2020-02-05 17:27:52
 * @Description:
 * @FilePath: \file-checker\src\statusBar.js
 */
const vscode = require("vscode");

const myStatusBarItem = vscode.window.createStatusBarItem(
  vscode.StatusBarAlignment.Right,
  100
);

//状态栏展示异常标点统计
function updateStatusBarItem(num) {
  if (num < 0) {
    return;
  }
  myStatusBarItem.text = `${num}个资源未找到`;
  myStatusBarItem.show();
}

function getMyStatusBarItem() {
  return myStatusBarItem;
}

module.exports = { updateStatusBarItem, getMyStatusBarItem };
