exports.getInfoListAsync = function(params) {
  return new Promise((resolve, reject) => {
    __syno.fs.getInfoList(params, (error, data) => {
      if (error) return reject(error);
      else return resolve(data);
    });
  });
};

exports.startCopyMoveAsync = function(params) {
  return new Promise((resolve, reject) => {
    __syno.fs.startCopyMove(params, (error, data) => {
      if (error) return reject(error);
      else return resolve(data);
    });
  });
};
