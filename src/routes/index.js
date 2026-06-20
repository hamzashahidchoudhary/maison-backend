import { Router } from 'express'
import { register, login, getMe } from '../controllers/auth.controller.js'
import { getProducts, getProduct, createProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import { createOrder, getOrders, getOrder, getAllOrders, updateOrderStatus } from '../controllers/orders.controller.js'
import { getProductReviews, createReview, deleteReview } from '../controllers/reviews.controller.js'
import { createPaymentIntent, stripeWebhook } from '../controllers/payments.controller.js'
import { protect, adminOnly } from '../middleware/auth.js'

const router = Router()

// ─── Auth ───────────────────────────────────────────
router.post('/auth/register', register)
router.post('/auth/login', login)
router.get('/auth/me', protect, getMe)

// ─── Products ────────────────────────────────────────
router.get('/products', getProducts)
router.get('/products/:id', getProduct)
router.post('/products', protect, adminOnly, createProduct)
router.put('/products/:id', protect, adminOnly, updateProduct)
router.delete('/products/:id', protect, adminOnly, deleteProduct)

// ─── Reviews ─────────────────────────────────────────
router.get('/products/:id/reviews', getProductReviews)
router.post('/products/:id/reviews', protect, createReview)
router.delete('/products/:id/reviews/:reviewId', protect, deleteReview)

// ─── Orders ──────────────────────────────────────────
router.post('/orders', protect, createOrder)
router.get('/orders', protect, getOrders)
router.get('/orders/:id', protect, getOrder)
router.get('/admin/orders', protect, adminOnly, getAllOrders)
router.put('/admin/orders/:id/status', protect, adminOnly, updateOrderStatus)

// ─── Payments ────────────────────────────────────────
router.post('/payments/create-intent', protect, createPaymentIntent)
router.post('/payments/webhook', stripeWebhook) // No auth — Stripe calls this

export default router
