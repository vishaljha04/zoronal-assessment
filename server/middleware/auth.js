const { verifyToken } = require('../utils/jwt');
const User = require('../models/User');

const getTokenFromRequest = (req) => {
  const cookieToken = req.cookies?.token;
  if (cookieToken) return cookieToken;

  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) return header.substring(7);

  return null;
};

const protect = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      res.status(401);
      throw new Error('Not authorized');
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      res.status(401);
      throw new Error('Not authorized');
    }

    req.user = user;
    next();
  } catch (err) {
    if (!res.statusCode || res.statusCode < 400) res.status(401);
    next(err);
  }
};

module.exports = { protect };

