#!/bin/bash

# Hands & Hope - Account Creation Script
# Run these curl commands to create test accounts

BASE_URL="http://localhost:5000"

echo "🚀 Creating Test Accounts for Hands & Hope..."
echo "=================================================="

# 1. Create Seller Account
echo -e "\n1️⃣  Creating Seller Account (Alice)..."
curl -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Seller",
    "email": "alice.seller@example.com",
    "phone": "+254700000001",
    "password": "Password123!",
    "role": "seller",
    "businessName": "Alice Crafts",
    "disabilityId": "D-12345",
    "documents": [
      {
        "url": "/uploads/1700000000-123456789-my-certificate.pdf",
        "filename": "my-certificate.pdf",
        "mimeType": "application/pdf",
        "size": 23456,
        "uploadedAt": "2025-11-30T12:00:00.000Z"
      }
    ]
  }'

# 2. Create Teacher Account
echo -e "\n\n2️⃣  Creating Teacher Account (John)..."
curl -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Teacher",
    "email": "john.teacher@example.com",
    "phone": "+254700000002",
    "password": "Password123!",
    "role": "teacher",
    "subject": "Mathematics",
    "staffId": "T-9876",
    "schoolName": "Hope Academy for Special Education",
    "documents": [
      {
        "url": "/uploads/1700000000-222222222-teacher-id.jpg",
        "filename": "teacher-id.jpg",
        "mimeType": "image/jpeg",
        "size": 12345,
        "uploadedAt": "2025-11-30T12:05:00.000Z"
      }
    ]
  }'

# 3. Create Student Account
echo -e "\n\n3️⃣  Creating Student Account (Mary)..."
curl -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mary Student",
    "email": "mary.student@example.com",
    "phone": "+254700000003",
    "password": "Password123!",
    "role": "student",
    "studentId": "S-1122",
    "disabilityId": "DIS-4433",
    "schoolName": "Bright Futures School",
    "documents": [
      {
        "url": "/uploads/1700000000-333333333-student-id.png",
        "filename": "student-id.png",
        "mimeType": "image/png",
        "size": 54321,
        "uploadedAt": "2025-11-30T12:10:00.000Z"
      }
    ]
  }'

# 4. Create School Account
echo -e "\n\n4️⃣  Creating School Account (Principal Admin)..."
curl -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Principal Admin",
    "email": "admin@sunshine.school",
    "phone": "+254700000004",
    "password": "AdminPass123!",
    "role": "school",
    "schoolName": "Sunshine Learning Center",
    "registrationNumber": "REG-9988",
    "schoolAddress": "123 School Lane, Nairobi",
    "schoolDocuments": [
      {
        "url": "/uploads/1700000000-444444444-license.pdf",
        "filename": "license.pdf",
        "mimeType": "application/pdf",
        "size": 99999,
        "uploadedAt": "2025-11-30T12:15:00.000Z"
      }
    ]
  }'

# 5. Create Caregiver Account
echo -e "\n\n5️⃣  Creating Caregiver Account (Grace)..."
curl -X POST "$BASE_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Grace Caregiver",
    "email": "grace.caregiver@example.com",
    "phone": "+254700000005",
    "password": "CaregiverPass123!",
    "role": "caregiver",
    "documents": [
      {
        "url": "/uploads/1700000000-555555555-caregiver-cert.pdf",
        "filename": "caregiver-cert.pdf",
        "mimeType": "application/pdf",
        "size": 45678,
        "uploadedAt": "2025-11-30T12:20:00.000Z"
      }
    ]
  }'

echo -e "\n\n✅ All accounts created successfully!"
echo "=================================================="
echo "You can now login with these credentials:"
echo "  1. alice.seller@example.com / Password123!"
echo "  2. john.teacher@example.com / Password123!"
echo "  3. mary.student@example.com / Password123!"
echo "  4. admin@sunshine.school / AdminPass123!"
echo "  5. grace.caregiver@example.com / CaregiverPass123!"
echo "=================================================="
