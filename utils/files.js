/*
 * @Author: wangzongyu
 * @Date: 2020-02-05 13:05:39
 * @LastEditors  : wangzongyu
 * @LastEditTime : 2020-02-05 15:09:30
 * @Description:
 * @FilePath: \file-checker\utils\files.js
 */
const fs = require("fs");
const path = require("path");
let imgFileList = [];

function displayFile(p) {
  const param = path.resolve(p);
  try {
    const stats = fs.statSync(param);
    if (stats.isDirectory()) {
      const file = fs.readdirSync(param);
      file.forEach(e => {
        let absolutePath = path.resolve(path.join(param, e));
        displayFile(absolutePath);
      });
    } else {
      // 如果不是目录，打印文件信息
      imgFileList.push(path.basename(param));
    }
  } catch (error) {
    console.log(error);
  }
}

function getImagesList(rootPath, targetDir) {
  const p = path.resolve(rootPath, targetDir);
  console.log(p);
  imgFileList = [];
  displayFile(p);
  return imgFileList;
}

module.exports = getImagesList;
