import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000';

const accounts = [
  {
    name: 'Alice Seller',
    email: 'alice.seller@example.com',
    phone: '+254700000001',
    password: 'Password123!',
    role: 'seller',
    businessName: 'Alice Crafts',
    disabilityId: 'D-12345',
    documents: [
      {
        url: '/uploads/1700000000-123456789-my-certificate.pdf',
        filename: 'my-certificate.pdf',
        mimeType: 'application/pdf',
        size: 23456,
        uploadedAt: '2025-11-30T12:00:00.000Z'
      }
    ]
  },
  {
    name: 'John Teacher',
    email: 'john.teacher@example.com',
    phone: '+254700000002',
    password: 'Password123!',
    role: 'teacher',
    subject: 'Mathematics',
    staffId: 'T-9876',
    schoolName: 'Hope Academy for Special Education',
    documents: [
      {
        url: '/uploads/1700000000-222222222-teacher-id.jpg',
        filename: 'teacher-id.jpg',
        mimeType: 'image/jpeg',
        size: 12345,
        uploadedAt: '2025-11-30T12:05:00.000Z'
      }
    ]
  },
  {
    name: 'Mary Student',
    email: 'mary.student@example.com',
    phone: '+254700000003',
    password: 'Password123!',
    role: 'student',
    studentId: 'S-1122',
    disabilityId: 'DIS-4433',
    schoolName: 'Bright Futures School',
    documents: [
      {
        url: '/uploads/1700000000-333333333-student-id.png',
        filename: 'student-id.png',
        mimeType: 'image/png',
        size: 54321,
        uploadedAt: '2025-11-30T12:10:00.000Z'
      }
    ]
  },
  {
    name: 'Principal Admin',
    email: 'admin@sunshine.school',
    phone: '+254700000004',
    password: 'AdminPass123!',
    role: 'school',
    schoolName: 'Sunshine Learning Center',
    registrationNumber: 'REG-9988',
    schoolAddress: '123 School Lane, Nairobi',
    schoolDocuments: [
      {
        url: '/uploads/1700000000-444444444-license.pdf',
        filename: 'license.pdf',
        mimeType: 'application/pdf',
        size: 99999,
        uploadedAt: '2025-11-30T12:15:00.000Z'
      }
    ]
  },
  {
    name: 'Grace Caregiver',
    email: 'grace.caregiver@example.com',
    phone: '+254700000005',
    password: 'CaregiverPass123!',
    role: 'caregiver',
    documents: [
      {
        url: '/uploads/1700000000-555555555-caregiver-cert.pdf',
        filename: 'caregiver-cert.pdf',
        mimeType: 'application/pdf',
        size: 45678,
        uploadedAt: '2025-11-30T12:20:00.000Z'
      }
    ]
  }
];

async function createAccounts() {
  console.log('🚀 Creating Test Accounts for Hands & Hope...');
  console.log('==================================================');

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    console.log(`\n${i + 1}️⃣  Creating ${account.role} account (${account.name})...`);
    
    try {
      const response = await fetch(`${BASE_URL}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(account)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${account.role} account created successfully!`);
        console.log(`   Email: ${account.email}`);
        console.log(`   Token: ${data.token.substring(0, 20)}...`);
      } else {
        console.log(`❌ Error: ${data.error || 'Failed to create account'}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }

  console.log('\n==================================================');
  console.log('✅ All account creation attempts completed!');
  console.log('==================================================');
  console.log('\nYou can now login with these credentials:');
  console.log('  1. alice.seller@example.com / Password123!');
  console.log('  2. john.teacher@example.com / Password123!');
  console.log('  3. mary.student@example.com / Password123!');
  console.log('  4. admin@sunshine.school / AdminPass123!');
  console.log('  5. grace.caregiver@example.com / CaregiverPass123!');
}

createAccounts();
