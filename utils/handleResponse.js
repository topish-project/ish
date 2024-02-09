exports.handleResponse = (res, status, result, msg, data = {}, totalCount = 0) => {
  res.status(status).json({
    result,
    msg,
    data,
    totalCount,
  });
};



// handleResponse(
//     res,
//     200,
//     "success",
//     "Barcha sotuvchilar",
//     sellers,
//     sellers.length
//   );