# Hands & Hope - Account Creation Script (PowerShell)
# Run this script to create test accounts

$BASE_URL = "http://localhost:5000"

Write-Host "🚀 Creating Test Accounts for Hands & Hope..." -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan

# 1. Create Seller Account
Write-Host "`n1️⃣  Creating Seller Account (Alice)..." -ForegroundColor Yellow
$sellerData = @{
    name = "Alice Seller"
    email = "alice.seller@example.com"
    phone = "+254700000001"
    password = "Password123!"
    role = "seller"
    businessName = "Alice Crafts"
    disabilityId = "D-12345"
    documents = @(
        @{
            url = "/uploads/1700000000-123456789-my-certificate.pdf"
            filename = "my-certificate.pdf"
            mimeType = "application/pdf"
            size = 23456
            uploadedAt = "2025-11-30T12:00:00.000Z"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/auth/signup" -Method Post -ContentType "application/json" -Body $sellerData | ConvertTo-Json | Write-Host

# 2. Create Teacher Account
Write-Host "`n2️⃣  Creating Teacher Account (John)..." -ForegroundColor Yellow
$teacherData = @{
    name = "John Teacher"
    email = "john.teacher@example.com"
    phone = "+254700000002"
    password = "Password123!"
    role = "teacher"
    subject = "Mathematics"
    staffId = "T-9876"
    schoolName = "Hope Academy for Special Education"
    documents = @(
        @{
            url = "/uploads/1700000000-222222222-teacher-id.jpg"
            filename = "teacher-id.jpg"
            mimeType = "image/jpeg"
            size = 12345
            uploadedAt = "2025-11-30T12:05:00.000Z"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/auth/signup" -Method Post -ContentType "application/json" -Body $teacherData | ConvertTo-Json | Write-Host

# 3. Create Student Account
Write-Host "`n3️⃣  Creating Student Account (Mary)..." -ForegroundColor Yellow
$studentData = @{
    name = "Mary Student"
    email = "mary.student@example.com"
    phone = "+254700000003"
    password = "Password123!"
    role = "student"
    studentId = "S-1122"
    disabilityId = "DIS-4433"
    schoolName = "Bright Futures School"
    documents = @(
        @{
            url = "/uploads/1700000000-333333333-student-id.png"
            filename = "student-id.png"
            mimeType = "image/png"
            size = 54321
            uploadedAt = "2025-11-30T12:10:00.000Z"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/auth/signup" -Method Post -ContentType "application/json" -Body $studentData | ConvertTo-Json | Write-Host

# 4. Create School Account
Write-Host "`n4️⃣  Creating School Account (Principal Admin)..." -ForegroundColor Yellow
$schoolData = @{
    name = "Principal Admin"
    email = "admin@sunshine.school"
    phone = "+254700000004"
    password = "AdminPass123!"
    role = "school"
    schoolName = "Sunshine Learning Center"
    registrationNumber = "REG-9988"
    schoolAddress = "123 School Lane, Nairobi"
    schoolDocuments = @(
        @{
            url = "/uploads/1700000000-444444444-license.pdf"
            filename = "license.pdf"
            mimeType = "application/pdf"
            size = 99999
            uploadedAt = "2025-11-30T12:15:00.000Z"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/auth/signup" -Method Post -ContentType "application/json" -Body $schoolData | ConvertTo-Json | Write-Host

# 5. Create Caregiver Account
Write-Host "`n5️⃣  Creating Caregiver Account (Grace)..." -ForegroundColor Yellow
$caregiverData = @{
    name = "Grace Caregiver"
    email = "grace.caregiver@example.com"
    phone = "+254700000005"
    password = "CaregiverPass123!"
    role = "caregiver"
    documents = @(
        @{
            url = "/uploads/1700000000-555555555-caregiver-cert.pdf"
            filename = "caregiver-cert.pdf"
            mimeType = "application/pdf"
            size = 45678
            uploadedAt = "2025-11-30T12:20:00.000Z"
        }
    )
} | ConvertTo-Json

Invoke-RestMethod -Uri "$BASE_URL/api/auth/signup" -Method Post -ContentType "application/json" -Body $caregiverData | ConvertTo-Json | Write-Host

Write-Host "`n✅ All accounts created successfully!" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "You can now login with these credentials:" -ForegroundColor Green
Write-Host "  1. alice.seller@example.com / Password123!" -ForegroundColor White
Write-Host "  2. john.teacher@example.com / Password123!" -ForegroundColor White
Write-Host "  3. mary.student@example.com / Password123!" -ForegroundColor White
Write-Host "  4. admin@sunshine.school / AdminPass123!" -ForegroundColor White
Write-Host "  5. grace.caregiver@example.com / CaregiverPass123!" -ForegroundColor White
Write-Host "==================================================" -ForegroundColor Cyan
