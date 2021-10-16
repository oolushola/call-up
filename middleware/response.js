  /**
   * @description successful response for * status codes
   * @param { Number } statusCode 
   * @param { Object } res 
   * @param { * } data || data could be of any type
   * @param { String } msg 
   * @returns { Object }
   */
  exports.response = async (res, statusCode, data, msg) => {
    res.status(statusCode).json({
      data,
      message: msg
    })
  }
  