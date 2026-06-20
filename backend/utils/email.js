const { Resend } = require('resend');

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'SK Luxury <orders@srikalacouture.com>';

const BRAND_GOLD = '#C9A84C';
const BRAND_EMERALD = '#0d3b2e';

const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f8f5f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8f5f0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;">
        <tr><td style="background-color:${BRAND_EMERALD};padding:32px;text-align:center;">
          <span style="font-family:Georgia,serif;font-size:36px;color:${BRAND_GOLD};font-weight:600;letter-spacing:2px;">SK</span>
          <p style="font-family:Arial,sans-serif;font-size:10px;color:rgba(255,255,255,0.6);letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Luxury in Every Stitch</p>
        </td></tr>
        <tr><td style="padding:40px 32px;">
          ${content}
        </td></tr>
        <tr><td style="background-color:#f8f5f0;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
          <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0 0 8px;">SK Luxury · 123 Fashion Street, Banjara Hills, Hyderabad – 500034</p>
          <p style="font-family:Arial,sans-serif;font-size:12px;color:#888;margin:0;">
            <a href="mailto:hello@skluxury.in" style="color:${BRAND_GOLD};text-decoration:none;">hello@skluxury.in</a> &nbsp;·&nbsp; +91 98765 43210
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
`;

const formatINR = (amount) => `₹${Number(amount || 0).toLocaleString('en-IN')}`;


async function sendEmail({to, subject, html}) {
  if (!resend) {
    console.log (
      `[Email skipped - no RESEND_API_KEY] To: ${to}, Subject: ${subject}`
    );
    return {skipped: true};
  }

  try {
    console.log ('Sending email to:', to);
    console.log ('Using sender:', FROM_EMAIL);

    const result = await resend.emails.send ({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log ('Resend response:', result);

    return result;
  } catch (error) {
    console.error ('Email send failed:', error);

    return {
      error: error.message,
    };
  }
}



exports.sendOrderConfirmationEmail = async (order) => {
  const recipient = order.shippingAddress?.email || order.guestInfo?.email;
  if (!recipient) return;

  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;">
        <table cellpadding="0" cellspacing="0"><tr>
          <td style="width:60px;"><img src="${item.image}" width="56" height="68" style="object-fit:cover;display:block;" /></td>
          <td style="padding-left:14px;">
            <p style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;margin:0 0 4px;">${item.name}</p>
            <p style="font-family:Arial,sans-serif;font-size:11px;color:#888;margin:0;">Qty: ${item.quantity}${item.size ? ` · Size: ${item.size}` : ''}</p>
          </td>
        </tr></table>
      </td>
      <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#0d3b2e;font-weight:600;">
        ${formatINR(item.price * item.quantity)}
      </td>
    </tr>
  `).join('');

  const estDelivery = order.estimatedDelivery
    ? new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Within 7 business days';

  const content = `
    <p style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin:0 0 4px;">Order Confirmed!</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#888;margin:0 0 24px;">Thank you for shopping with SK Luxury, ${order.shippingAddress?.name || 'valued customer'}.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5f0;padding:16px;margin-bottom:24px;">
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:12px;color:#888;">Order Number</td>
        <td style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;font-weight:600;text-align:right;">#${order.orderNumber}</td>
      </tr>
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:12px;color:#888;padding-top:8px;">Estimated Delivery</td>
        <td style="font-family:Arial,sans-serif;font-size:13px;color:#0d3b2e;font-weight:600;text-align:right;padding-top:8px;">${estDelivery}</td>
      </tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0">${itemsHtml}</table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
      <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#888;padding:4px 0;">Subtotal</td><td style="text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">${formatINR(order.pricing?.subtotal)}</td></tr>
      <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#888;padding:4px 0;">Shipping</td><td style="text-align:right;font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">${order.pricing?.shippingCost === 0 ? 'FREE' : formatINR(order.pricing?.shippingCost)}</td></tr>
      <tr><td style="font-family:Arial,sans-serif;font-size:15px;color:#1a1a1a;font-weight:700;padding:10px 0;border-top:1px solid #eee;">Total</td><td style="text-align:right;font-family:Georgia,serif;font-size:18px;color:#0d3b2e;font-weight:700;padding:10px 0;border-top:1px solid #eee;">${formatINR(order.pricing?.total)}</td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
      <tr><td style="font-family:Arial,sans-serif;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:1px;padding-bottom:8px;">Delivery Address</td></tr>
      <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;line-height:1.6;">
        ${order.shippingAddress?.name}<br/>
        ${order.shippingAddress?.addressLine}<br/>
        ${order.shippingAddress?.city}, ${order.shippingAddress?.state} – ${order.shippingAddress?.pincode}<br/>
        ${order.shippingAddress?.phone}
      </td></tr>
    </table>
    <div style="text-align:center;margin-top:32px;">
      <a href="${process.env.FRONTEND_URL}/order-confirmation/${order._id}" style="display:inline-block;background-color:${BRAND_EMERALD};color:#ffffff;text-decoration:none;padding:14px 32px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Track Your Order</a>
    </div>
  `;

  return sendEmail({ to: recipient, subject: `Order Confirmed - #${order.orderNumber} | SK Luxury`, html: emailWrapper(content) });
};

exports.sendOrderStatusUpdateEmail = async (order, newStatus, message) => {
  const recipient = order.shippingAddress?.email || order.guestInfo?.email;
  if (!recipient) return;

  const statusLabels = {
    confirmed: 'Order Confirmed', processing: 'Being Processed', shipped: 'On Its Way',
    delivered: 'Delivered', cancelled: 'Cancelled', returned: 'Returned'
  };

  const content = `
    <p style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin:0 0 4px;">${statusLabels[newStatus] || 'Order Update'}</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#888;margin:0 0 24px;">Your order #${order.orderNumber} status has been updated.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f5f0;padding:20px;margin-bottom:20px;">
      <tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;">${message || `Your order is now: ${newStatus}`}</td></tr>
      ${order.trackingNumber ? `<tr><td style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;padding-top:10px;">Tracking Number: <strong>${order.trackingNumber}</strong> ${order.courier ? `(${order.courier})` : ''}</td></tr>` : ''}
    </table>
    <div style="text-align:center;margin-top:24px;">
      <a href="${process.env.FRONTEND_URL}/order-confirmation/${order._id}" style="display:inline-block;background-color:${BRAND_EMERALD};color:#ffffff;text-decoration:none;padding:14px 32px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;">View Order Details</a>
    </div>
  `;

  return sendEmail({ to: recipient, subject: `Order ${statusLabels[newStatus] || 'Update'} - #${order.orderNumber} | SK Luxury`, html: emailWrapper(content) });
};

exports.sendPasswordResetEmail = async (user, resetUrl) => {
  const content = `
    <p style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin:0 0 4px;">Reset Your Password</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#888;margin:0 0 24px;">Hi ${user.name}, we received a request to reset your password.</p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;line-height:1.6;margin-bottom:24px;">Click the button below to set a new password. This link will expire in 30 minutes for your security.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${resetUrl}" style="display:inline-block;background-color:${BRAND_EMERALD};color:#ffffff;text-decoration:none;padding:14px 32px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Reset Password</a>
    </div>
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#aaa;margin-top:24px;">If you didn't request this, you can safely ignore this email. Your password will remain unchanged.</p>
    <p style="font-family:Arial,sans-serif;font-size:11px;color:#bbb;word-break:break-all;margin-top:16px;">Or copy this link: ${resetUrl}</p>
  `;

  return sendEmail({ to: user.email, subject: 'Reset Your Password | SK Luxury', html: emailWrapper(content) });
};

exports.sendWelcomeEmail = async (user) => {
  const content = `
    <p style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin:0 0 4px;">Welcome to SK Luxury, ${user.name}!</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#888;margin:0 0 24px;">We're thrilled to have you join our luxury fashion family.</p>
    <p style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;line-height:1.6;">Explore our exclusive collections of premium clothing, designer jewellery, and bespoke bridal wear — each piece crafted with care and timeless elegance.</p>
    <div style="text-align:center;margin:32px 0;">
      <a href="${process.env.FRONTEND_URL}/collections" style="display:inline-block;background-color:${BRAND_EMERALD};color:#ffffff;text-decoration:none;padding:14px 32px;font-family:Arial,sans-serif;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Explore Collections</a>
    </div>
  `;
  return sendEmail({ to: user.email, subject: 'Welcome to SK Luxury', html: emailWrapper(content) });
};

exports.sendOrderCancellationEmail = async (order) => {
  const recipient = order.shippingAddress?.email || order.guestInfo?.email;
  if (!recipient) return;

  const content = `
    <p style="font-family:Georgia,serif;font-size:24px;color:#1a1a1a;margin:0 0 4px;">Order Cancelled</p>
    <p style="font-family:Arial,sans-serif;font-size:14px;color:#888;margin:0 0 24px;">Your order #${order.orderNumber} has been cancelled.</p>
    ${order.cancellationReason ? `<p style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;background:#f8f5f0;padding:16px;">Reason: ${order.cancellationReason}</p>` : ''}
    ${order.paymentInfo?.status === 'paid' ? `<p style="font-family:Arial,sans-serif;font-size:13px;color:#1a1a1a;margin-top:16px;">If you've already been charged, your refund of ${formatINR(order.pricing?.total)} will be processed within 5-7 business days.</p>` : ''}
    <p style="font-family:Arial,sans-serif;font-size:12px;color:#aaa;margin-top:24px;">If you have any questions, feel free to reach out to us anytime.</p>
  `;

  return sendEmail({ to: recipient, subject: `Order Cancelled - #${order.orderNumber} | SK Luxury`, html: emailWrapper(content) });
};
