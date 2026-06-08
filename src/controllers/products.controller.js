import prisma from '../lib/prisma.js'

// GET /products
export const getProducts = async (req, res) => {
  try {
    const { category, sort } = req.query

    const where = category && category !== 'all' ? { category } : {}

    let orderBy = { createdAt: 'desc' }
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    if (sort === 'price-desc') orderBy = { price: 'desc' }
    if (sort === 'rating') orderBy = { rating: 'desc' }

    const products = await prisma.product.findMany({ where, orderBy })
    res.json(products)
  } catch (err) {
    console.error('Get products error:', err)
    res.status(500).json({ error: 'Failed to fetch products.' })
  }
}

// GET /products/:id
export const getProduct = async (req, res) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) }
    })
    if (!product) return res.status(404).json({ error: 'Product not found.' })
    res.json(product)
  } catch (err) {
    console.error('Get product error:', err)
    res.status(500).json({ error: 'Failed to fetch product.' })
  }
}

// POST /products (admin only)
export const createProduct = async (req, res) => {
  try {
    const product = await prisma.product.create({ data: req.body })
    res.status(201).json(product)
  } catch (err) {
    console.error('Create product error:', err)
    res.status(500).json({ error: 'Failed to create product.' })
  }
}

// PUT /products/:id (admin only)
export const updateProduct = async (req, res) => {
  try {
    const product = await prisma.product.update({
      where: { id: Number(req.params.id) },
      data: req.body
    })
    res.json(product)
  } catch (err) {
    console.error('Update product error:', err)
    res.status(500).json({ error: 'Failed to update product.' })
  }
}

// DELETE /products/:id (admin only)
export const deleteProduct = async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: Number(req.params.id) } })
    res.json({ message: 'Product deleted.' })
  } catch (err) {
    console.error('Delete product error:', err)
    res.status(500).json({ error: 'Failed to delete product.' })
  }
}
