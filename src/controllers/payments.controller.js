import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// POST /payments/create-intent
// Creates a Stripe PaymentIntent and returns the client_secret
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body // amount in dollars

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount.' })
    }

    // Stripe works in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      metadata: { userId: req.user.id.toString() }
    })

    res.json({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: 'Failed to create payment intent.' })
  }
}

// POST /payments/webhook
// Stripe calls this automatically after successful payment
export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature error:', err)
    return res.status(400).json({ error: 'Webhook signature verification failed.' })
  }

  // Handle events
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log('✅ Payment succeeded:', event.data.object.id)
      // Here you could update order status to CONFIRMED
      break
    case 'payment_intent.payment_failed':
      console.log('❌ Payment failed:', event.data.object.id)
      break
    default:
      console.log('Unhandled event type:', event.type)
  }

  res.json({ received: true })
}
