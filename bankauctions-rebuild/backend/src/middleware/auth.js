import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { db } from '../services/db.js';

export async function requireAuth(req, res, next) {
  try {
    let token = null;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication token required. Please sign in.'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await db.user.findUnique({ where: { id: decoded.id } });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or suspended.'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token.'
    });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden. Requires one of [${allowedRoles.join(', ')}] permissions.`
      });
    }

    next();
  };
}

export async function optionalAuth(req, res, next) {
  try {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await db.user.findUnique({ where: { id: decoded.id } });
      if (user && user.isActive) {
        req.user = user;
      }
    }
  } catch (e) {
    // optional token invalid, ignore and proceed unauthenticated
  }
  next();
}
