const fs = require("fs");

module.exports = class Fragmentation {
  constructor(options) {
    this.options = options
  }

  /**
   * 合并分片文件
   *
   * @param {*} { token, filename, chunkCount, upLoadFolder, fileFolder }
   * @return {*}
   * @memberof Fragmentation
   */
  merge({ token, filename, chunkCount, upLoadFolder, fileFolder }) {
    let writeStream = fs.createWriteStream(`${fileFolder}/${filename}`);
    let cindex = 0;
    function fnMergeFile() {
      let fname = `${upLoadFolder}${cindex}-${token}`;
      let readStream = fs.createReadStream(fname);
      readStream.pipe(writeStream, { end: false });
      readStream.on("end", function () {
        fs.unlink(fname, function (err) {
          if (err) {
            throw err;
          }
        });
        if (cindex + 1 < chunkCount) {
          cindex += 1;
          fnMergeFile();
        }
      });
    }
    fnMergeFile();
    return "merge ok";
  }

  /**
   * 上传分片
   *
   * @param {*} { token, index, files }
   * @return {*}
   * @memberof Fragmentation
   */
  upload({ token, index, files }) {

    if (files && !Array.isArray(files)) {
      //单文件上传容错
      files = [files];
    }

    files &&
      files.forEach((item) => {
        let path = item.path;
        let fname = item.name;
        let nextPath =
          path.slice(0, path.lastIndexOf("\\") + 1) + index + "-" + token;
        if (item.size > 0 && path) {
          let extArr = fname.split(".");
          fs.renameSync(path, nextPath);
        }
      });

    return "upload ok";
  }
};
