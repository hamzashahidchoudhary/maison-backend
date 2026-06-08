import jwt from 'jsonwebtoken'
import prisma from '../lib/prisma.js'

export const protect = async (req, res, next) => {
  try {
    // 1. Get token from header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Not authorized. No token provided.' })
    }

    const token = authHeader.split(' ')[1]

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // 3. Find user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, role: true }
    })

    if (!user) {
      return res.status(401).json({ error: 'User no longer exists.' })
    }

    // 4. Attach user to request
    req.user = user
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}

// Admin only middleware (use after protect)
export const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required.' })
  }
  next()
}
