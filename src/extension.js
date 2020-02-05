/*
 * @Author: wangzongyu
 * @Date: 2020-02-05 10:53:35
 * @LastEditors  : wangzongyu
 * @LastEditTime : 2020-02-05 19:17:06
 * @Description:
 * @FilePath: \file-checker\extension.js
 */
const vscode = require("vscode");
const { updateStatusBarItem, getMyStatusBarItem } = require("./statusBar");
const { initListener } = require("./eventListener");
const { getDecorationType, getConfig } = require("./handleConfig");
const getImagesList = require("./files");

function activate(context) {
  const workspace = vscode.workspace;
  const rootPath = workspace.workspaceFolders[0].uri.fsPath;
  //创建问题诊断集合
  const collection = vscode.languages.createDiagnosticCollection("fileChecker");
  let myStatusBarItem = getMyStatusBarItem();
  let activeEditor = vscode.window.activeTextEditor;
  let timeout = null;
  let updateTimeout = null;
  let { prefix, fileDir, dataFile } = getConfig();
  let fileList = [];
  //获取配置样式
  // let decorationType = getDecorationType();
  console.log("插件加载成功");
  function updateDecorations() {
    const uri = activeEditor.document.uri;
    //如果没有编辑中页面直接退出
    const isTargetFile = activeEditor && uri.path.includes(dataFile);
    if (!isTargetFile) {
      return;
    }
    if (fileList.length === 0) {
      getFileList();
    }
    const textRegEx = /(['"`])@I-[\s\S]*?\1/g;
    //获取编辑中页面的文本信息
    const text = activeEditor.document.getText();
    //装饰集（这里就是需要被修改样式的异常中文标点）
    const filesDecoration = [];
    //异常诊断信息列表
    const diagnosticList = [];
    //匹配到的图片字符串
    let match;
    while ((match = textRegEx.exec(text))) {
      // 图片字符串其实位置
      const startIndex = match.index;
      // 图片字符串
      const initialText = match[0];
      // 图片名称
      const fileName = initialText.slice(1, -1).replace(prefix, "");
      if (fileList.includes(fileName)) {
        continue;
      }
      // 图片字符串长度
      const initialTextLength = initialText.length;
      //异常中文标点的开始位置
      const startPos = activeEditor.document.positionAt(startIndex);
      //异常中文标点结束位置，这几个要检测的标点只占一个位置，加1即可
      const endPos = activeEditor.document.positionAt(
        startIndex + initialTextLength
      );
      //异常中文标点的诊断信息，问题诊断面版要用到
      diagnosticList.push({
        message: `${fileName} 资源不存在`, //问题诊断面版展示的说明信息
        range: new vscode.Range(startPos, endPos), //问题诊断面版展示位置信息，点击可跳转相应位置
        severity: vscode.DiagnosticSeverity.Warning //问题类型
      });
      //异常中文标点的范围
      const decoration = {
        range: new vscode.Range(startPos, endPos)
      };
      //对异常中文标点的范围应用设定好的修饰样式
      filesDecoration.push(decoration);
    }
    //问题诊断面版添加异常中文标点相关信息
    collection.set(activeEditor.document.uri, diagnosticList);
    //更新状态栏统计异常中文标点个数
    updateStatusBarItem(filesDecoration.length);
    //激活中的编辑页面中文异常标点位置添加样式
    activeEditor.setDecorations(getDecorationType(), filesDecoration);
  }
  //获取新的图片资源列表并刷新样式
  function getFileList() {
    console.log("更新图片资源");
    //资源文件列表
    fileList = getImagesList(rootPath, fileDir);
    updateDecorations();
  }
  //更新文件资源列表
  function updateFileList() {
    //防抖
    clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      getFileList();
    }, 1000);
  }
  //触发页面样式更新
  function triggerUpdateDecorations() {
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(updateDecorations, 500);
  }
  //初始化事件监听
  initListener({
    context,
    activeEditor,
    workspace,
    triggerUpdateDecorations,
    updateFileList,
    rootPath,
    fileDir
  });
  //启动时存在打开的编辑页面触发一次样式更新
  if (activeEditor) {
    console.log(111);
    triggerUpdateDecorations();
  }
  context.subscriptions.push(myStatusBarItem);
}

exports.activate = activate;
module.exports = {
  activate
};
