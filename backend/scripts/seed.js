#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import mongoose from 'mongoose';

import User from '../models/User.js';
import Buyer from '../models/Buyer.js';
import Product from '../models/Product.js';

dotenv.config();

/*
Usage:
  node scripts/seed.js                # insert built-in sample data
  node scripts/seed.js data.json      # insert data from JSON file
  node scripts/seed.js data.json --drop   # drop collections before inserting

JSON file format example:
{
  "users": [ {..}, ... ],
  "buyers": [ {..}, ... ],
  "products": [ {..}, ... ]
}

This script connects to the MongoDB defined in MONGO_URI and inserts documents.
*/

const argv = process.argv.slice(2);
const fileArg = argv.find(a => !a.startsWith('--'));
const dropFlag = argv.includes('--drop');

const sampleData = {
  users: [
    {
      name: 'Seller One',
      email: 'seller1@example.com',
      password: 'Password123!',
      businessName: 'Seller Co',
      phone: '1234567890',
      role: 'seller'
    }
  ],
  buyers: [
    {
      name: 'Alice Buyer',
      email: 'alice@example.com',
      password: 'Password123!',
      phoneNumber: '0987654321'
    }
  ],
  products: [
    {
      name: 'Handmade Scarf',
      price: 25.0,
      category: 'Clothing',
      color: 'Blue',
      image: 'https://via.placeholder.com/300'
    }
  ]
};

async function loadJsonFile(filePath) {
  const full = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  const data = await fs.promises.readFile(full, 'utf8');
  return JSON.parse(data);
}

async function run() {
  try {
    await connectDB();

    let data = sampleData;
    if (fileArg) {
      console.log('Reading JSON file:', fileArg);
      data = await loadJsonFile(fileArg);
    } else {
      console.log('No JSON file provided — using built-in sample data.');
    }

    if (dropFlag) {
      console.log('Dropping collections: users, buyers, products');
      await Promise.all([
        User.deleteMany({}),
        Buyer.deleteMany({}),
        Product.deleteMany({})
      ]);
    }

    // Insert users (sellers/admin)
    if (Array.isArray(data.users) && data.users.length) {
      for (const u of data.users) {
        const exists = await User.findOne({ email: u.email });
        if (exists) {
          console.log('User exists, skipping:', u.email);
          continue;
        }
        const user = new User(u);
        await user.save();
        console.log('Inserted user:', user.email);
      }
    }

    // Insert buyers
    if (Array.isArray(data.buyers) && data.buyers.length) {
      for (const b of data.buyers) {
        const exists = await Buyer.findOne({ email: b.email });
        if (exists) {
          console.log('Buyer exists, skipping:', b.email);
          continue;
        }
        const buyer = new Buyer(b);
        await buyer.save();
        console.log('Inserted buyer:', buyer.email);
      }
    }

    // Insert products — try to attach to a seller if provided (sellerEmail)
    if (Array.isArray(data.products) && data.products.length) {
      for (const p of data.products) {
        let sellerId = p.sellerId || null;
        if (!sellerId && p.sellerEmail) {
          const seller = await User.findOne({ email: p.sellerEmail });
          if (seller) sellerId = seller._id;
        }
        // If still no seller, pick the first seller in DB
        if (!sellerId) {
          const anySeller = await User.findOne({ role: 'seller' });
          if (anySeller) sellerId = anySeller._id;
        }

        const productDoc = {
          sellerId: sellerId,
          name: p.name,
          price: p.price || 0,
          status: p.status || 'Active',
          category: p.category || 'Uncategorized',
          color: p.color || '',
          image: p.image || ''
        };

        const prod = new Product(productDoc);
        await prod.save();
        console.log('Inserted product:', prod.name);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

run();
