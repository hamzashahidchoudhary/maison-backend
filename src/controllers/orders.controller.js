import prisma from '../lib/prisma.js'
import { sendOrderConfirmationEmail } from '../lib/email.js'

// POST /orders
export const createOrder = async (req, res) => {
  try {
    const { items, subtotal, shipping, total, address, stripeId } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must have at least one item.' })
    }

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        subtotal,
        shipping,
        total,
        stripeId,
        name: address.name,
        email: address.email,
        address: address.address,
        city: address.city,
        postcode: address.postcode,
        country: address.country,
        status: 'CONFIRMED',
        items: {
          create: items.map(item => ({
            productId: item.id,
            qty: item.qty,
            price: item.price,
          }))
        }
      },
      include: {
        items: { include: { product: true } }
      }
    })

    // Send confirmation email — don't block the response on this
    sendOrderConfirmationEmail(order)

    res.status(201).json(order)
  } catch (err) {
    console.error('Create order error:', err)
    res.status(500).json({ error: 'Failed to create order.' })
  }
}

// GET /orders (current user's orders)
export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    })
    res.json(orders)
  } catch (err) {
    console.error('Get orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders.' })
  }
}

// GET /orders/:id
export const getOrder = async (req, res) => {
  try {
    const order = await prisma.order.findFirst({
      where: { id: Number(req.params.id), userId: req.user.id },
      include: { items: { include: { product: true } } }
    })
    if (!order) return res.status(404).json({ error: 'Order not found.' })
    res.json(order)
  } catch (err) {
    console.error('Get order error:', err)
    res.status(500).json({ error: 'Failed to fetch order.' })
  }
}

// GET /admin/orders (admin: all orders)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(orders)
  } catch (err) {
    console.error('Get all orders error:', err)
    res.status(500).json({ error: 'Failed to fetch orders.' })
  }
}

// PUT /admin/orders/:id/status (admin: update order status)
const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(', ')}` })
    }

    const order = await prisma.order.update({
      where: { id: Number(req.params.id) },
      data: { status },
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } }
      }
    })

    res.json(order)
  } catch (err) {
    console.error('Update order status error:', err)
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Order not found.' })
    }
    res.status(500).json({ error: 'Failed to update order status.' })
  }
}
