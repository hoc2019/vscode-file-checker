/*
 * @Author: wangzongyu
 * @Date: 2020-02-05 17:35:01
 * @LastEditors  : wangzongyu
 * @LastEditTime : 2020-02-05 19:18:33
 * @Description:
 * @FilePath: \file-checker\src\getDecorationType.js
 */
const vscode = require("vscode");
// let decorationType = null;
let config = {};

updateConfig();

// 获取最新用户设置
function updateConfig() {
  config = vscode.workspace.getConfiguration().fileChecker;
}
// 获取当前样式设置
function getDecorationType() {
  return vscode.window.createTextEditorDecorationType({
    backgroundColor: config.bgColor
  });
}

function getConfig() {
  return config;
}

module.exports = { getDecorationType, getConfig, updateConfig };
