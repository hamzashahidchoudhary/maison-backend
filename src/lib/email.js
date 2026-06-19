import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Generates the HTML for an order confirmation email
const buildOrderEmailHtml = (order) => {
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <div style="font-weight: 600; font-size: 14px; color: #1A1814;">${item.product.name}</div>
        <div style="font-size: 12px; color: #7A7570;">Qty: ${item.qty} × $${item.price}</div>
      </td>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; font-weight: 500;">
        $${(item.qty * item.price).toFixed(2)}
      </td>
    </tr>
  `).join('')

  return `
  <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #F7F4EF; padding: 40px 24px;">
    <div style="text-align: center; margin-bottom: 32px;">
      <h1 style="font-size: 22px; color: #1A1814; margin: 0;">Ma<span style="color: #C8A96E;">is</span>on</h1>
    </div>

    <div style="background: white; border-radius: 16px; padding: 32px; margin-bottom: 24px;">
      <h2 style="font-size: 20px; color: #1A1814; margin: 0 0 8px;">Thank you for your order!</h2>
      <p style="font-family: Arial, sans-serif; font-size: 14px; color: #7A7570; margin: 0 0 24px;">
        Hi ${order.name}, we've received your order and it's being prepared.
      </p>

      <div style="background: #F7F4EF; border-radius: 10px; padding: 16px; margin-bottom: 24px; font-family: Arial, sans-serif;">
        <div style="font-size: 12px; color: #7A7570; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;">Order Number</div>
        <div style="font-size: 16px; font-weight: 700; color: #1A1814;">#${String(order.id).padStart(6, '0')}</div>
      </div>

      <table style="width: 100%; font-family: Arial, sans-serif; border-collapse: collapse;">
        ${itemsHtml}
      </table>

      <div style="margin-top: 16px; font-family: Arial, sans-serif;">
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #7A7570; margin-bottom: 6px;">
          <span>Subtotal</span><span>$${order.subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 13px; color: #7A7570; margin-bottom: 6px;">
          <span>Shipping</span><span>${order.shipping === 0 ? 'Free' : '$' + order.shipping.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 700; color: #1A1814; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
          <span>Total</span><span>$${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div style="background: white; border-radius: 16px; padding: 24px; font-family: Arial, sans-serif;">
      <div style="font-size: 12px; color: #C8A96E; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px;">Shipping To</div>
      <div style="font-size: 14px; color: #1A1814;">${order.address}, ${order.city} ${order.postcode}</div>
      <div style="font-size: 14px; color: #1A1814;">${order.country}</div>
    </div>

    <p style="text-align: center; font-family: Arial, sans-serif; font-size: 12px; color: #7A7570; margin-top: 32px;">
      💵 Payment Method: Cash on Delivery<br/>
      Pay when your order arrives at your door.
    </p>

    <p style="text-align: center; font-family: Arial, sans-serif; font-size: 11px; color: #ABA59C; margin-top: 24px;">
      © ${new Date().getFullYear()} Maison. All rights reserved.
    </p>
  </div>
  `
}

export const sendOrderConfirmationEmail = async (order) => {
  try {
    await resend.emails.send({
      from: 'Maison <onboarding@resend.dev>',
      to: order.email,
      subject: `Order Confirmed — #${String(order.id).padStart(6, '0')}`,
      html: buildOrderEmailHtml(order),
    })
    console.log(`✅ Confirmation email sent to ${order.email}`)
  } catch (err) {
    // Don't throw — email failure shouldn't break order creation
    console.error('❌ Failed to send confirmation email:', err)
  }
}
