const User = require('../models/User');

async function ensureAdmin() {
  try {
    const bootstrap = String(process.env.ADMIN_BOOTSTRAP || 'false').toLowerCase() === 'true';
    if (!bootstrap) {
      console.log('[ensureAdmin] Skipped: ADMIN_BOOTSTRAP is not true');
      return;
    }

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      console.log('[ensureAdmin] Skipped: ADMIN_EMAIL or ADMIN_PASSWORD not set');
      return;
    }

    let user = await User.findOne({ email }).select('+password');

    if (!user) {
      user = await User.create({
        firstName: 'Admin',
        lastName: 'User',
        email,
        password,
        role: 'admin',
        isEmailVerified: true,
      });
      console.log(`[ensureAdmin] Created admin user: ${email}`);
      console.log('[ensureAdmin] Tip: set ADMIN_BOOTSTRAP=false after initial setup.');
      return;
    }

    // Ensure role is admin, but do not reset password (set-once behavior)
    if (user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
      console.log(`[ensureAdmin] Ensured admin role for: ${email}`);
    } else {
      console.log(`[ensureAdmin] Admin exists and role confirmed: ${email}`);
    }
  } catch (err) {
    console.error('[ensureAdmin] Error ensuring admin:', err.message);
  }
}

module.exports = ensureAdmin;
