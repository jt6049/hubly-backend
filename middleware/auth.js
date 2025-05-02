const jwt=require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
    try {
      const token = req.headers.authorization; //tokens are stored in headers of http.
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY); //verifying the token
      req.user = decoded; //contains the payload information.
      next();
    } catch (err) {
      next(err);
    }
  };
  exports.authMiddleware=authMiddleware;