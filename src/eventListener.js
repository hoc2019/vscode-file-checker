/*
 * @Author: wangzongyu
 * @Date: 2020-02-05 17:59:25
 * @LastEditors  : wangzongyu
 * @LastEditTime : 2020-02-06 02:26:40
 * @Description:
 * @FilePath: \file-checker\src\listener.js
 */
const vscode = require("vscode");
const { updateConfig } = require("./handleConfig");

function initListener({
  context,
  activeEditor,
  updateActiveEditor,
  workspace,
  triggerUpdateDecorations,
  updateFileList,
  targetDir
}) {
  //切换编辑页面事件，会触发样式更新
  vscode.window.onDidChangeActiveTextEditor(
    editor => {
      updateActiveEditor(editor);
      if (editor) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );
  //编辑页面中的内容变化，会触发样式更新
  workspace.onDidChangeTextDocument(
    event => {
      if (activeEditor && event.document === activeEditor.document) {
        triggerUpdateDecorations();
      }
    },
    null,
    context.subscriptions
  );

  //更改选项中的设置会重新获取样式信息
  workspace.onDidChangeConfiguration(updateConfig);

  let watcher = vscode.workspace.createFileSystemWatcher(
    new vscode.RelativePattern(targetDir, "**/*.{jpg,png}"),
    false,
    true,
    false
  );
  watcher.onDidDelete(updateFileList);
  watcher.onDidCreate(updateFileList);
}

module.exports = { initListener };
