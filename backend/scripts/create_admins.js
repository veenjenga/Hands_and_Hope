import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';

dotenv.config();

async function createAdmins() {
  await connectDB();

  const admins = [
    { email: 'admin@handsandhope.com', name: 'Site Admin', password: 'Admin@2024', role: 'admin' },
    { email: 'superadmin@handsandhope.com', name: 'Super Admin', password: 'SuperAdmin@2024', role: 'super-admin' }
  ];

  for (const a of admins) {
    const exists = await User.findOne({ email: a.email });
    if (exists) {
      console.log(`User already exists: ${a.email} (role=${exists.role}), updating password to latest value.`);
      // Overwrite password with plain text and save so the User.pre('save') hook hashes it once
      exists.password = a.password;
      exists.role = a.role;
      await exists.save();
      console.log(`Updated password for existing user: ${a.email}`);
      continue;
    }
    // Create user with plain password and let mongoose pre-save hook hash it once
    const u = new User({ name: a.name, email: a.email, password: a.password, role: a.role });
    await u.save();
    console.log(`Created ${a.role} user: ${a.email}`);
  }

  console.log('Admin creation complete.');
  process.exit(0);
}

createAdmins().catch(err => {
  console.error(err);
  process.exit(1);
});
