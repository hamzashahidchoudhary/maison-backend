// prisma/seed.js
// Run: node prisma/seed.js
// Seeds the database with initial products

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@maison.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@maison.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Seed products
  const products = [
    {
      name: 'Stoneware Mug Set',
      category: 'ceramics',
      price: 48,
      emoji: '☕',
      badge: 'new',
      bg: '#F0EAE0',
      description: 'Handcrafted stoneware mugs with a natural matte glaze. Each set includes 2 mugs in complementary earth tones. Microwave and dishwasher safe.',
      details: ['Set of 2 mugs', '350ml capacity each', 'Matte stoneware glaze', 'Dishwasher safe', 'Made in Portugal'],
      rating: 4.9, reviews: 142, stock: 50,
    },
    {
      name: 'Linen Throw Blanket',
      category: 'textiles',
      price: 120, oldPrice: 160,
      emoji: '🧶',
      badge: 'sale',
      bg: '#EDE8E0',
      description: 'A luxuriously soft linen-cotton blend throw. Pre-washed for an instantly relaxed feel. Perfect for layering on beds or draped over sofas.',
      details: ['130 × 170 cm', '55% linen, 45% cotton', 'Pre-washed for softness', 'Machine washable', 'Available in 4 colours'],
      rating: 4.8, reviews: 89, stock: 30,
    },
    {
      name: 'Ceramic Vase, Tall',
      category: 'ceramics',
      price: 75,
      emoji: '🏺',
      bg: '#E8E0D5',
      description: 'A statement piece for any room. This tall ceramic vase features a subtly textured surface and a warm terracotta-toned glaze.',
      details: ['Height: 32cm', 'Opening diameter: 8cm', 'Terracotta glaze', 'Waterproof interior', 'Handmade'],
      rating: 4.7, reviews: 56, stock: 25,
    },
    {
      name: 'Beeswax Candle Trio',
      category: 'decor',
      price: 38,
      emoji: '🕯️',
      badge: 'new',
      bg: '#F5EED8',
      description: 'Three pure beeswax pillar candles in graduating heights. Natural honey scent, slow-burning, and completely soot-free.',
      details: ['Set of 3 candles', 'Heights: 10cm, 15cm, 20cm', '100% pure beeswax', '40+ hour burn time each', 'Natural honey scent'],
      rating: 4.9, reviews: 203, stock: 80,
    },
    {
      name: 'Woven Table Runner',
      category: 'textiles',
      price: 55,
      emoji: '🪡',
      bg: '#EDE5D8',
      description: 'Hand-woven by artisans in Oaxaca, this table runner adds texture and warmth to any dining table.',
      details: ['40 × 180 cm', '100% natural cotton', 'Hand-woven', 'Natural plant dyes', 'Spot clean recommended'],
      rating: 4.6, reviews: 34, stock: 40,
    },
    {
      name: 'Terracotta Planter',
      category: 'ceramics',
      price: 42,
      emoji: '🪴',
      bg: '#EAE0D0',
      description: 'A classic terracotta planter with a modern matte finish. Drainage hole included.',
      details: ['Diameter: 18cm', 'Height: 15cm', 'Drainage hole', 'Matte terracotta finish', 'Includes saucer'],
      rating: 4.8, reviews: 78, stock: 60,
    },
    {
      name: 'Brass Candleholder',
      category: 'decor',
      price: 65,
      emoji: '✨',
      badge: 'new',
      bg: '#F2E8D0',
      description: 'A sculptural brass candleholder with an organic, hand-formed shape. The brushed brass finish develops a beautiful patina over time.',
      details: ['Height: 22cm', 'Solid brass', 'Brushed finish', 'Fits standard taper candles', 'Handcrafted'],
      rating: 4.9, reviews: 61, stock: 20,
    },
    {
      name: 'Merino Cushion Cover',
      category: 'textiles',
      price: 88, oldPrice: 110,
      emoji: '🛋️',
      badge: 'sale',
      bg: '#E5DDD0',
      description: 'A supremely soft cushion cover in 100% extra-fine merino wool. Hidden zip closure.',
      details: ['50 × 50 cm', '100% extra-fine merino', 'Hidden zip closure', 'Ribbed texture', 'Dry clean recommended'],
      rating: 4.7, reviews: 47, stock: 35,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: products.indexOf(product) + 1 },
      update: {},
      create: product,
    })
  }
  console.log('✅ Products seeded:', products.length)
  console.log('🎉 Database seeded successfully!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
