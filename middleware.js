function validateContentType(req, res, next) {
    const contentType = req.header('Content-Type');
  
    if (contentType !== 'application/json') {
      return res.status(415).send('Unsupported Media Type');
    }
  
    next();
  }

module.exports = validateContentType;