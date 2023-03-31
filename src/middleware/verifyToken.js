const jwt = 'jsonwebtoken';
const responseResolver = '../utils/responseResolver';

export  verifyToken = (req, res, next) => {
   authHeader = req.headers['authorization'];
   token = authHeader && authHeader.split(' ')[1];
  if (token == null) return responseResolver({}, 401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return responseResolver({}, 403);
    req.email = decoded.email;
    next();
  });
};

export  verifyTokenAdmin = (req, res, next) => {
   authHeader = req.headers['authorization'];
   token = authHeader && authHeader.split(' ')[1];
  if (token == null) return responseResolver({}, 401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return responseResolver({}, 403);
    req.adminId = decoded.adminId;
    req.username = decoded.username;
    next();
  });
};

export  verfiyTokenDefault = (req, res, next) => {
  // DEFAULT_TOKEN
   authHeader = req.headers['authorization'];
   token = authHeader && authHeader.split(' ')[1];
  if (token == null) return responseResolver({}, 401);
  if (token == process.env.DEFAULT_TOKEN) {
    next();
  } else {
    return responseResolver({}, 401);
  }
};
