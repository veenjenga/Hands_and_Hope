import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Inquiry from '../models/Inquiry.js';
import dotenv from 'dotenv';

dotenv.config();

const seedTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hands-and-hope');
    console.log('Connected to MongoDB');

    // Find or create test seller
    let seller = await User.findOne({ email: 'seller@test.com' });
    if (!seller) {
      seller = await User.create({
        name: 'Test Seller',
        email: 'seller@test.com',
        password: 'Test@1234',
        businessName: 'Test Business',
        phone: '0700000000',
        role: 'seller'
      });
      console.log('Created test seller');
    }

    // Create test products
    const existingProducts = await Product.countDocuments({ sellerId: seller._id });
    if (existingProducts === 0) {
      const products = await Product.insertMany([
        {
          sellerId: seller._id,
          name: 'Hand-painted Ceramic Bowl',
          price: 45.00,
          status: 'active',
          category: 'Ceramics',
          description: 'Beautiful handcrafted ceramic bowl',
          viewCount: 12
        },
        {
          sellerId: seller._id,
          name: 'Knitted Winter Scarf',
          price: 35.00,
          status: 'active',
          category: 'Textiles',
          description: 'Warm and cozy winter scarf',
          viewCount: 8
        },
        {
          sellerId: seller._id,
          name: 'Handmade Jewelry Set',
          price: 55.00,
          status: 'active',
          category: 'Jewelry',
          description: 'Elegant handmade jewelry',
          viewCount: 15
        }
      ]);
      console.log(`Created ${products.length} test products`);

      // Create test orders
      let buyer = await User.findOne({ email: 'buyer@test.com' });
      if (!buyer) {
        buyer = await User.create({
          name: 'Test Buyer',
          email: 'buyer@test.com',
          password: 'Test@1234',
          phone: '0700000001',
          role: 'buyer'
        });
      }

      const orders = await Order.insertMany([
        {
          sellerId: seller._id,
          buyerId: buyer._id,
          productId: products[0]._id,
          productName: products[0].name,
          amount: 45.00,
          status: 'completed',
          quantity: 1,
          buyerEmail: buyer.email,
          buyerName: buyer.name,
          rating: 5,
          feedback: 'Beautiful work!',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          sellerId: seller._id,
          buyerId: buyer._id,
          productId: products[1]._id,
          productName: products[1].name,
          amount: 35.00,
          status: 'completed',
          quantity: 1,
          buyerEmail: buyer.email,
          buyerName: buyer.name,
          rating: 4,
          feedback: 'Great quality',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          sellerId: seller._id,
          buyerId: buyer._id,
          productId: products[2]._id,
          productName: products[2].name,
          amount: 55.00,
          status: 'pending',
          quantity: 1,
          buyerEmail: buyer.email,
          buyerName: buyer.name,
          createdAt: new Date() // Today
        }
      ]);
      console.log(`Created ${orders.length} test orders`);

      // Create test inquiries
      const inquiries = await Inquiry.insertMany([
        {
          sellerId: seller._id,
          buyerId: buyer._id,
          productId: products[0]._id,
          productName: products[0].name,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          message: 'Can you ship to my address?',
          status: 'new'
        },
        {
          sellerId: seller._id,
          buyerId: buyer._id,
          productId: products[1]._id,
          productName: products[1].name,
          buyerName: buyer.name,
          buyerEmail: buyer.email,
          message: 'Do you have this in blue?',
          status: 'read'
        }
      ]);
      console.log(`Created ${inquiries.length} test inquiries`);

      // Update seller profile views
      await User.findByIdAndUpdate(seller._id, {
        profileViews: 42,
        totalSales: 2
      });
    }

    console.log('Test data seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedTestData();
