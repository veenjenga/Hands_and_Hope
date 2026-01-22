import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Seller from '../models/Seller.js';

dotenv.config();

async function migrate() {
  await connectDB();
  const sellers = await User.find({ role: 'seller' });
  console.log(`Found ${sellers.length} users with role=seller`);
  let created = 0;
  for (const u of sellers) {
    const existing = await Seller.findOne({ user: u._id });
    if (existing) continue;
    const s = new Seller({ user: u._id, businessName: u.businessName, phone: u.phone, documents: u.documents || [] });
    await s.save();
    created++;
    console.log(`Created seller doc ${s._id} for user ${u._id}`);
  }
  console.log(`Migration complete. Created ${created} seller documents.`);
  process.exit(0);
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
