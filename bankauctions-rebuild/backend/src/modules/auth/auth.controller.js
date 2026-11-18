import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../services/db.js';
import { config } from '../../config/index.js';
import { logAuditEvent } from '../../services/audit.service.js';
import { loginSchema, registerSchema } from '../../../../shared/schemas/auctionSchemas.js';

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

export async function login(req, res, next) {
  try {
    const portal = req.body.portal || 'BUYER';
    if (!['BUYER','CHECKER','ADMIN','ENGINEER','ADVOCATE','MARKETING'].includes(portal)) return res.status(400).json({success:false,message:'Choose a valid login portal.'});
    const validated = loginSchema.parse(req.body);
    const user = await db.user.findUnique({ where: { email: validated.email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been suspended by administration.' });
    }

    const isMatch = await bcrypt.compare(validated.password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (user.role !== portal) return res.status(403).json({success:false,message:`This account cannot sign in to the ${portal.toLowerCase()} portal. Use the login page for your assigned role.`});
    const token = generateToken(user);
    await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    await logAuditEvent({
      actorId: user.id,
      actorName: user.fullName,
      actorRole: user.role,
      action: 'USER_LOGIN',
      entityType: 'USER',
      entityId: user.id,
      ipAddress: req.ip
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { passwordHash, ...userClean } = user;
    userClean.name = userClean.fullName || userClean.name;
    return res.json({
      success: true,
      message: 'Signed in successfully',
      token,
      user: userClean
    });
  } catch (err) {
    next(err);
  }
}

export async function register(req, res, next) {
  try {
    const payload = {
      ...req.body,
      fullName: String(req.body.fullName || req.body.name || '').trim(),
      email: String(req.body.email || '').trim().toLowerCase(),
      phone: String(req.body.phone || '').replace(/[\s()-]/g, '').replace(/^\+91(?=\d{10}$)/, '')
    };
    const validated = registerSchema.parse(payload);

    const existingEmail = await db.user.findUnique({ where: { email: validated.email } });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validated.password, salt);

    const newUser = await db.user.create({
      data: {
        email: validated.email,
        phone: validated.phone,
        fullName: validated.fullName,
        passwordHash,
        role: 'BUYER',
        isActive: true,
        planTier: 'FREE',
        unlocksRemaining: 3,
        city: 'chennai'
      }
    });

    const token = generateToken(newUser);

    await logAuditEvent({
      actorId: newUser.id,
      actorName: newUser.fullName,
      actorRole: newUser.role,
      action: 'BUYER_REGISTERED',
      entityType: 'USER',
      entityId: newUser.id,
      ipAddress: req.ip
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: config.env === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const { passwordHash: _, ...clean } = newUser;
    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: clean
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res) {
  const { passwordHash, ...userClean } = req.user;
  return res.json({
    success: true,
    user: userClean
  });
}

export async function logout(req, res) {
  res.clearCookie('token');
  return res.json({ success: true, message: 'Logged out successfully' });
}
