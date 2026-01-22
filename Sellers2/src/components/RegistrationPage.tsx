import React, { useState } from 'react';
import communityImage from '../assets/be213fd3afb7194e83fe4ac6405c70d913f7a4df.png';
import handsHopeLogo from '../assets/972a6bc015fa5c98ddeb2bc3d5985f42623eb1bb.png';
import { Eye, EyeOff, Accessibility, CheckCircle, Plus, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { AccessibilityPanel } from './AccessibilityPanel';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { ScreenReaderProvider } from '../contexts/ScreenReaderContext';
import { useAuth } from '../contexts/AuthContext';

type UserRole = 'seller' | 'teacher' | 'student' | 'school';
type AccountTab = 'individual' | 'school-institution' | 'school-admin';

interface RegistrationPageProps {
  onRegister: (role: UserRole) => void;
  onNavigateToLogin: () => void;
}

// Mock list of schools
const EXISTING_SCHOOLS = [
  { id: '1', name: 'Hope Academy for Special Education' },
  { id: '2', name: 'Bright Futures School' },
  { id: '3', name: 'Sunshine Learning Center' },
  { id: '4', name: 'Rainbow Special Needs School' },
  { id: '5', name: 'Liberty School for the Disabled' },
];

export function RegistrationPage({ onRegister, onNavigateToLogin }: RegistrationPageProps) {
  const { login: authLogin } = useAuth();
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(false); // Disabled by default on registration page
  
  // Current active tab
  const [activeTab, setActiveTab] = useState('individual');
  
  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [showNewSchoolDialog, setShowNewSchoolDialog] = useState(false);
  const [studentTeacherType, setStudentTeacherType] = useState('student');
  const [disabilityFiles, setDisabilityFiles] = useState([] as File[]);
  const [schoolFiles, setSchoolFiles] = useState([] as File[]);
  const [adminFiles, setAdminFiles] = useState([] as File[]);
  const [isLoading, setIsLoading] = useState(false);

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : '';

  let API_URL = ((import.meta as any).env?.VITE_API_URL as string) || '';
  // If API_URL is empty, use relative paths to leverage Vite proxy
  const useRelativePaths = !API_URL || API_URL === '';
  if (!API_URL || !API_URL.startsWith('http')) API_URL = 'http://localhost:5000';

  const uploadFiles = async (fileInputIdOrFiles: string | File[]) => {
    let filesArr: File[] = [];
    if (typeof fileInputIdOrFiles === 'string') {
      const input = document.getElementById(fileInputIdOrFiles) as HTMLInputElement | null;
      if (!input || !input.files || input.files.length === 0) return [];
      filesArr = Array.from(input.files);
    } else {
      filesArr = fileInputIdOrFiles;
      if (!filesArr || filesArr.length === 0) return [];
    }

    const form = new FormData();
    filesArr.forEach((f) => form.append('files', f));
    const res = await fetch(useRelativePaths ? '/api/uploads' : `${API_URL}/api/uploads`, { method: 'POST', body: form });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || 'Upload failed');
    }
    const json = await res.json();
    return json.files || [];
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Common helpers to read values
      const get = (id: string) => (document.getElementById(id) as HTMLInputElement | null)?.value || '';

      if (activeTab === 'individual') {
        const name = get('fullName');
        const email = get('email');
        const phone = get('phone');
        const disabilityId = get('disabilityId');
        const password = get('password');
        const confirm = get('confirmPassword');
        if (password !== confirm) return alert('Passwords do not match');

        // upload certificate (use selected files state)
        const files = await uploadFiles(disabilityFiles);

        const payload = {
          name,
          email,
          phone,
          password,
          role: 'seller',
          disabilityId,
          documents: files,
        };

        const res = await fetch(useRelativePaths ? '/api/auth/signup' : `${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log('Signup response', data);
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        // Store user and token in auth context
        authLogin(data.user, data.token);
        onRegister('seller');
      } else if (activeTab === 'school-institution') {
        const name = get('fullNameSchool');
        const email = get('emailSchool');
        const phone = get('phoneSchool');
        const password = get('passwordSchool');
        const confirm = get('confirmPasswordSchool');
        if (password !== confirm) return alert('Passwords do not match');

        const schoolId = selectedSchool === 'request-new' ? undefined : selectedSchool;
        const schoolNameFromSelect = selectedSchool && selectedSchool !== 'request-new' ? (EXISTING_SCHOOLS.find(s => s.id === selectedSchool)?.name) : undefined;
        const studentDisabilityId = get('studentDisabilityId');

        const files = await uploadFiles(schoolFiles);

        const payload = {
          name,
          email,
          phone,
          password,
          role: studentTeacherType,
          schoolId,
          schoolName: schoolNameFromSelect,
          studentId: studentTeacherType === 'student' ? get('studentDisabilityId') : undefined,
          disabilityId: studentTeacherType === 'student' ? studentDisabilityId : undefined,
          documents: files,
        };

        const res = await fetch(useRelativePaths ? '/api/auth/signup' : `${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log('Signup response', data);
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        // Store user and token in auth context
        authLogin(data.user, data.token);
        onRegister(studentTeacherType);
      } else if (activeTab === 'school-admin') {
        const name = get('adminName');
        const email = get('adminEmail');
        const schoolName = get('schoolName');
        const registrationNumber = get('registrationNumber');
        const adminPhone = get('adminPhone');
        const schoolAddress = get('schoolAddress');
        const password = get('passwordAdmin');
        const confirm = get('confirmPasswordAdmin');
        if (password !== confirm) return alert('Passwords do not match');

        const files = await uploadFiles(adminFiles);

        const payload = {
          name,
          email,
          phone: adminPhone,
          password,
          role: 'school',
          schoolName,
          registrationNumber,
          schoolAddress,
          schoolDocuments: files,
        };

        const res = await fetch(useRelativePaths ? '/api/auth/signup' : `${API_URL}/api/auth/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        console.log('Signup response', data);
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        // Store user and token in auth context
        authLogin(data.user, data.token);
        onRegister('school');
      }
    } catch (err: any) {
      console.error('Registration error', err);
      alert(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenReaderProvider enabled={screenReader}>
    <div className={`min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gradient-to-br from-blue-50 to-green-50'} ${fontSizeClass}`}>
      {/* Accessibility Button */}
      <button
        onClick={() => setShowAccessibility(!showAccessibility)}
        className="fixed right-6 top-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-600"
        aria-label="Toggle accessibility options"
        aria-expanded={showAccessibility}
      >
        <Accessibility className="h-8 w-8 text-gray-900" aria-hidden="true" />
      </button>

      {/* Accessibility Panel */}
      {showAccessibility && (
        <AccessibilityPanel
          fontSize={fontSize}
          setFontSize={setFontSize}
          highContrast={highContrast}
          setHighContrast={setHighContrast}
          screenReader={screenReader}
          setScreenReader={setScreenReader}
          voiceNavigation={voiceNavigation}
          setVoiceNavigation={setVoiceNavigation}
          onClose={() => setShowAccessibility(false)}
          onNavigate={(page) => {
            if (page === 'login' || page === 'signin' || page === 'sign in') {
              onNavigateToLogin();
            }
          }}
        />
      )}

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-12">
        <div className="grid w-full max-w-7xl gap-8 lg:grid-cols-3">
          {/* Left Side - Community Image */}
          <div className="hidden lg:flex lg:flex-col lg:justify-center">
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl shadow-2xl">
                <img 
                  src={communityImage} 
                  alt="Diverse community including people with disabilities and service animals" 
                  className="w-full"
                />
              </div>
              <div className={`rounded-2xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-white shadow-lg'} p-6`}>
                <h3 className={`mb-2 ${highContrast ? 'text-white' : 'text-gray-900'}`}>
                  Join Our Community
                </h3>
                <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Connect with thousands of talented individuals, share your skills, and empower your journey with Hands & Hope.
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="lg:col-span-2">
            <Card className={`w-full ${highContrast ? 'border-4 border-white bg-black' : 'shadow-2xl'}`}>
              <CardHeader className="space-y-4 text-center">
                <div className="mx-auto mb-2">
                  <img 
                    src={handsHopeLogo} 
                    alt="Hands and Hope Logo" 
                    className="h-12 w-auto"
                  />
                </div>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription className={highContrast ? 'text-gray-300' : ''}>
                  Select your account type and fill in your information
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Account Type Tabs */}
                <div className="mb-8">
                  <div className={`grid grid-cols-3 gap-0 rounded-xl overflow-hidden ${highContrast ? 'border-2 border-white' : 'bg-gray-100'}`}>
                    <button
                      onClick={() => setActiveTab('individual')}
                      className={`py-4 px-4 text-center transition-all ${
                        activeTab === 'individual'
                          ? highContrast
                            ? 'bg-white text-black font-bold'
                            : 'bg-white text-blue-600 font-semibold shadow-lg'
                          : highContrast
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Individual Seller
                    </button>
                    <button
                      onClick={() => setActiveTab('school-institution')}
                      className={`py-4 px-4 text-center transition-all border-x ${
                        activeTab === 'school-institution'
                          ? highContrast
                            ? 'bg-white text-black font-bold border-white'
                            : 'bg-white text-blue-600 font-semibold shadow-lg border-transparent'
                          : highContrast
                          ? 'bg-black text-white border-white'
                          : 'text-gray-700 hover:bg-gray-200 border-gray-300'
                      }`}
                    >
                      School / Institution
                    </button>
                    <button
                      onClick={() => setActiveTab('school-admin')}
                      className={`py-4 px-4 text-center transition-all ${
                        activeTab === 'school-admin'
                          ? highContrast
                            ? 'bg-white text-black font-bold'
                            : 'bg-white text-blue-600 font-semibold shadow-lg'
                          : highContrast
                          ? 'bg-black text-white'
                          : 'text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      School Admin
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* INDIVIDUAL SELLER FORM */}
                  {activeTab === 'individual' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input
                            id="fullName"
                            placeholder="Enter your full name"
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="disabilityId">Disability ID *</Label>
                        <Input
                          id="disabilityId"
                          placeholder="Enter your disability ID number"
                          className="h-12"
                          required
                        />
                        <p className="text-sm text-gray-500">
                          This will be verified during the approval process
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Disability Certificate *</Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${highContrast ? 'border-white' : 'border-gray-300'}`}>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (Max 5MB)</p>
                          <Input
                            type="file"
                            accept=".pdf,image/jpeg,image/png"
                            className="hidden"
                            id="disabilityCert"
                            onChange={(e: any) => setDisabilityFiles(Array.from(e.target.files || []))}
                          />
                          <Button type="button" variant="outline" className="mt-3" onClick={() => document.getElementById('disabilityCert')?.click()}>
                            Choose File
                          </Button>
                          {disabilityFiles.length > 0 && (
                            <div className="mt-2 text-sm text-gray-700">
                              Selected: {disabilityFiles.map(f => f.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password *</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              className="h-12 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm Password *</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              className="h-12 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SCHOOL/INSTITUTION FORM (for Students & Teachers) */}
                  {activeTab === 'school-institution' && (
                    <>
                      <div className="space-y-2">
                        <Label>I am a *</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setStudentTeacherType('student')}
                            className={`py-4 px-6 rounded-lg border-2 transition-all ${
                              studentTeacherType === 'student'
                                ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            Student
                          </button>
                          <button
                            type="button"
                            onClick={() => setStudentTeacherType('teacher')}
                            className={`py-4 px-6 rounded-lg border-2 transition-all ${
                              studentTeacherType === 'teacher'
                                ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                          >
                            Teacher
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="fullNameSchool">Full Name *</Label>
                          <Input
                            id="fullNameSchool"
                            placeholder="Enter your full name"
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emailSchool">Email Address *</Label>
                          <Input
                            id="emailSchool"
                            type="email"
                            placeholder="your.email@example.com"
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneSchool">Phone Number *</Label>
                        <Input
                          id="phoneSchool"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="school">Select Your School *</Label>
                        <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                          <SelectTrigger className="h-12">
                            <SelectValue placeholder="Choose your school" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXISTING_SCHOOLS.map((school) => (
                              <SelectItem key={school.id} value={school.id}>
                                {school.name}
                              </SelectItem>
                            ))}
                            <SelectItem value="request-new">
                              <span className="flex items-center gap-2 font-semibold text-blue-600">
                                <Plus className="h-4 w-4" />
                                Request New School
                              </span>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {selectedSchool === 'request-new' && (
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full mt-2"
                            onClick={() => setShowNewSchoolDialog(true)}
                          >
                            Submit School Request
                          </Button>
                        )}
                      </div>

                      {studentTeacherType === 'student' && (
                        <div className="space-y-2">
                          <Label htmlFor="studentDisabilityId">Disability ID *</Label>
                          <Input
                            id="studentDisabilityId"
                            placeholder="Enter your disability ID number"
                            className="h-12"
                            required
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label>Upload Documents *</Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${highContrast ? 'border-white' : 'border-gray-300'}`}>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">
                            {studentTeacherType === 'student' ? 'Student ID & Disability Certificate' : 'Teacher ID & Credentials'}
                          </p>
                          <Input
                            type="file"
                            accept=".pdf,image/jpeg,image/png"
                            className="hidden"
                            id="schoolDocs"
                            multiple
                            onChange={(e: any) => setSchoolFiles(Array.from(e.target.files || []))}
                          />
                          <Button type="button" variant="outline" className="mt-3" onClick={() => document.getElementById('schoolDocs')?.click()}>
                            Choose Files
                          </Button>
                          {schoolFiles.length > 0 && (
                            <div className="mt-2 text-sm text-gray-700">
                              Selected: {schoolFiles.map(f => f.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="passwordSchool">Password *</Label>
                          <div className="relative">
                            <Input
                              id="passwordSchool"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              className="h-12 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPasswordSchool">Confirm Password *</Label>
                          <div className="relative">
                            <Input
                              id="confirmPasswordSchool"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              className="h-12 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* SCHOOL ADMIN FORM */}
                  {activeTab === 'school-admin' && (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="adminName">Administrator Name *</Label>
                          <Input
                            id="adminName"
                            placeholder="Enter full name"
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminEmail">Email Address *</Label>
                          <Input
                            id="adminEmail"
                            type="email"
                            placeholder="admin@school.edu"
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schoolName">School/Institution Name *</Label>
                        <Input
                          id="schoolName"
                          placeholder="Enter school name"
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="registrationNumber">Registration Number *</Label>
                          <Input
                            id="registrationNumber"
                            placeholder="School registration number"
                            className="h-12"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="adminPhone">Phone Number *</Label>
                          <Input
                            id="adminPhone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="h-12"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="schoolAddress">School Address *</Label>
                        <Input
                          id="schoolAddress"
                          placeholder="Full address"
                          className="h-12"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Documents *</Label>
                        <div className={`border-2 border-dashed rounded-lg p-6 text-center ${highContrast ? 'border-white' : 'border-gray-300'}`}>
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">School License & Registration Certificate</p>
                          <Input
                            type="file"
                            accept=".pdf,image/jpeg,image/png"
                            className="hidden"
                            id="adminDocs"
                            multiple
                            onChange={(e: any) => setAdminFiles(Array.from(e.target.files || []))}
                          />
                          <Button type="button" variant="outline" className="mt-3" onClick={() => document.getElementById('adminDocs')?.click()}>
                            Choose Files
                          </Button>
                          {adminFiles.length > 0 && (
                            <div className="mt-2 text-sm text-gray-700">
                              Selected: {adminFiles.map(f => f.name).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="passwordAdmin">Password *</Label>
                          <div className="relative">
                            <Input
                              id="passwordAdmin"
                              type={showPassword ? 'text' : 'password'}
                              placeholder="Create a password"
                              className="h-12 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPasswordAdmin">Confirm Password *</Label>
                          <div className="relative">
                            <Input
                              id="confirmPasswordAdmin"
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="Confirm your password"
                              className="h-12 pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Submit Button */}
                  <div className="space-y-4 pt-4">
                    <Button type="submit" size="lg" className="w-full h-14 text-lg">
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Create Account
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        onClick={onNavigateToLogin}
                        className="text-base"
                      >
                        Already have an account? Sign In
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* New School Request Dialog */}
      <Dialog open={showNewSchoolDialog} onOpenChange={setShowNewSchoolDialog}>
        <DialogContent className={highContrast ? 'bg-black border-2 border-white' : ''}>
          <DialogHeader>
            <DialogTitle className={highContrast ? 'text-white' : ''}>Request New School</DialogTitle>
            <DialogDescription className={highContrast ? 'text-gray-300' : ''}>
              Submit a request to add a new school to our system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newSchoolName">School Name *</Label>
              <Input id="newSchoolName" placeholder="Enter school name" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newSchoolLocation">Location *</Label>
              <Input id="newSchoolLocation" placeholder="City, State" className="h-12" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewSchoolDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              alert('School request submitted for admin approval');
              setShowNewSchoolDialog(false);
            }}>
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </ScreenReaderProvider>
  );
}