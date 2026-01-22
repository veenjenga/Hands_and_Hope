import http from 'http';

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

function createAccount(accountData) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(accountData);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function createAccounts() {
  console.log('🚀 Creating Test Accounts for Hands & Hope...');
  console.log('==================================================');

  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    console.log(`\n${i + 1}️⃣  Creating ${account.role} account (${account.name})...`);
    
    try {
      const result = await createAccount(account);
      
      if (result.status === 201 || result.status === 200) {
        console.log(`✅ ${account.role} account created successfully!`);
        console.log(`   Email: ${account.email}`);
        if (result.data.token) {
          console.log(`   Token: ${result.data.token.substring(0, 20)}...`);
        }
      } else {
        console.log(`❌ Error (${result.status}): ${result.data.error || 'Failed to create account'}`);
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
