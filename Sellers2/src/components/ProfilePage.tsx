import { useEffect, useRef, useState } from 'react';
import { Camera, Mail, Phone, MapPin, Calendar, User, Building, GraduationCap, Briefcase, Save, Edit2, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface ProfilePageProps {
  userRole: 'seller' | 'student' | 'teacher' | 'school';
  highContrast: boolean;
}

// Mock profile data based on user role
const getProfileDataForRole = (role: string) => {
  switch (role) {
    case 'seller':
      return {
        name: 'John Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main Street, New York, NY 10001',
        joinDate: 'January 15, 2024',
        disabilityId: 'DIS-2024-12345',
        bio: 'Passionate artist specializing in handmade pottery and ceramics. I love creating unique pieces that bring joy to people\'s homes.',
        skills: ['Pottery', 'Ceramics', 'Painting'],
        profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=johndoe',
      };
    case 'student':
      return {
        name: 'Emma Johnson',
        email: 'emma.johnson@school.edu',
        phone: '+1 (555) 234-5678',
        address: '456 Oak Avenue, Brooklyn, NY 11201',
        joinDate: 'September 1, 2024',
        school: 'Hope Academy for Special Education',
        teacher: 'Dr. Sarah Williams',
        disabilityId: 'DIS-2024-67890',
        bio: 'Student artist learning to create beautiful clay sculptures and handmade crafts.',
        skills: ['Sculpture', 'Crafts', 'Drawing'],
        profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emmajohnson',
      };
    case 'teacher':
      return {
        name: 'Dr. Sarah Williams',
        email: 'sarah.williams@school.edu',
        phone: '+1 (555) 345-6789',
        address: '789 Elm Street, Queens, NY 11375',
        joinDate: 'August 15, 2023',
        school: 'Hope Academy for Special Education',
        department: 'Art & Crafts Department',
        students: 8,
        bio: 'Dedicated educator with 12 years of experience in special education and art therapy. Passionate about helping students discover their creative talents.',
        specialization: 'Art Therapy & Special Education',
        profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarahwilliams',
      };
    case 'school':
      return {
        name: 'Hope Academy for Special Education',
        email: 'admin@hopeacademy.edu',
        phone: '+1 (555) 456-7890',
        address: '1000 Education Boulevard, Manhattan, NY 10023',
        joinDate: 'March 1, 2023',
        schoolId: 'SCH-2023-001',
        totalTeachers: 3,
        totalStudents: 26,
        bio: 'A premier institution dedicated to providing quality education and vocational training for students with disabilities.',
        accreditation: 'State Board of Education Certified',
        profilePhoto: 'https://api.dicebear.com/7.x/shapes/svg?seed=hopeacademy',
      };
    default:
      return null;
  }
};

export function ProfilePage({ userRole, highContrast }: ProfilePageProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [formData, setFormData] = useState<any>(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const API_URL = ((import.meta as any).env?.VITE_API_URL as string) || 'http://localhost:5000';

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}/api/dashboard/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();

        let profile = data.profile || getProfileDataForRole(userRole);
        if (profile?.joinDate) {
          profile.joinDate = new Date(profile.joinDate).toLocaleDateString();
        }

        // Construct full URL for profile photo if it's a relative path
        let photoUrl = profile?.profilePhoto;
        if (photoUrl && !photoUrl.startsWith('http')) {
          photoUrl = `${API_URL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
        }

        setProfileData(profile);
        setFormData(profile);
        setProfilePhoto(photoUrl || '');
        setSkillsInput(Array.isArray(profile?.skills) ? profile.skills.join(', ') : '');
        console.log('Profile loaded. Photo URL:', photoUrl);
      } catch (error) {
        console.error('Error loading profile:', error);
        const fallback = getProfileDataForRole(userRole);
        setProfileData(fallback);
        setFormData(fallback);
        setProfilePhoto(fallback?.profilePhoto || '');
        setSkillsInput(Array.isArray(fallback?.skills) ? fallback.skills.join(', ') : '');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [API_URL, userRole]);

  if (isLoading) {
    return (
      <div className={`flex min-h-[300px] items-center justify-center ${highContrast ? 'bg-black text-white' : 'bg-gray-50'}`}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (!profileData || !formData) return null;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      // Create a preview URL for the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      let uploadedPhoto = formData.profilePhoto;

      // Step 1: Upload photo if selected
      if (photoFile) {
        const form = new FormData();
        form.append('files', photoFile);
        const uploadRes = await fetch(`${API_URL}/api/uploads`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: form
        });
        if (!uploadRes.ok) {
          const errorData = await uploadRes.json();
          throw new Error(`Upload failed: ${errorData.error || uploadRes.statusText}`);
        }
        const uploadData = await uploadRes.json();
        // Get the URL from the upload response
        const photoUrl = uploadData.files?.[0]?.url || uploadData.url;
        if (!photoUrl) {
          throw new Error('No URL returned from upload');
        }
        // Construct full URL - if relative, prepend API_URL
        uploadedPhoto = photoUrl.startsWith('http') 
          ? photoUrl 
          : `${API_URL}${photoUrl.startsWith('/') ? '' : '/'}${photoUrl}`;
        console.log('Photo uploaded successfully. URL:', uploadedPhoto);
      }

      // Step 2: Update profile with photo URL
      console.log('Saving profile with photo URL:', uploadedPhoto);
      const updateRes = await fetch(`${API_URL}/api/dashboard/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          bio: formData.bio,
          skills: skillsInput,
          profilePhoto: uploadedPhoto,
          disabilityId: formData.disabilityId
        })
      });

      if (!updateRes.ok) {
        const errorData = await updateRes.json();
        throw new Error(`Profile update failed: ${errorData.error || updateRes.statusText}`);
      }

      const updateResponse = await updateRes.json();
      console.log('Profile update response:', updateResponse);

      // Step 3: Fetch the updated profile to confirm it was saved
      const getRes = await fetch(`${API_URL}/api/dashboard/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedData = await getRes.json();
      const savedProfile = updatedData.profile;
      console.log('Fetched profile from database. Photo URL:', savedProfile?.profilePhoto);

      // Step 4: Update UI with the saved data from database
      const updatedProfile = {
        ...savedProfile,
        skills: Array.isArray(savedProfile?.skills) ? savedProfile.skills : skillsInput.split(',').map(s => s.trim()).filter(Boolean)
      };
      
      setProfileData(updatedProfile);
      // Construct full URL for display
      const displayPhoto = savedProfile?.profilePhoto?.startsWith('http')
        ? savedProfile.profilePhoto
        : `${API_URL}${savedProfile?.profilePhoto?.startsWith('/') ? '' : '/'}${savedProfile?.profilePhoto}`;
      setProfilePhoto(displayPhoto || '');
      setFormData(updatedProfile);
      setPhotoFile(null);
      setIsEditing(false);
      console.log('Profile saved and verified. Displaying photo from:', displayPhoto);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Save profile error:', error);
      alert(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'seller':
        return Briefcase;
      case 'student':
        return GraduationCap;
      case 'teacher':
        return GraduationCap;
      case 'school':
        return Building;
      default:
        return User;
    }
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={highContrast ? 'text-white' : 'text-gray-900'}>Profile</h1>
          <p className={`text-lg ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
            Manage your account information
          </p>
        </div>
        {!isEditing ? (
          <Button size="lg" onClick={() => setIsEditing(true)} className="gap-2">
            <Edit2 className="h-5 w-5" />
            Edit Profile
          </Button>
        ) : (
          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button size="lg" onClick={handleSave} className="gap-2">
              <Save className="h-5 w-5" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Photo Card */}
        <Card className={`lg:col-span-1 ${highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}`}>
          <CardHeader>
            <CardTitle className={highContrast ? 'text-white' : 'text-gray-900'}>
              Profile Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-40 w-40">
                  <AvatarImage src={profilePhoto} alt={`${profileData.name}'s profile photo`} />
                  <AvatarFallback className="text-4xl">
                    {profileData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"
                    aria-label="Upload new photo"
                  >
                    <Camera className="h-6 w-6" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  aria-label="Upload profile photo"
                />
              </div>
              <div className="text-center">
                <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>
                  {profileData.name}
                </h3>
                <Badge variant="secondary" className="mt-2 gap-2">
                  <RoleIcon className="h-4 w-4" />
                  {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                </Badge>
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2"
                >
                  <Upload className="h-5 w-5" />
                  Upload New Photo
                </Button>
              )}
            </div>

            {/* Quick Stats */}
            <div className={`space-y-3 border-t pt-6 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Calendar className={`h-5 w-5 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`} />
                <div>
                  <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                    Member since
                  </p>
                  <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                    {profileData.joinDate}
                  </p>
                </div>
              </div>
              {(userRole === 'seller' || userRole === 'student') && 'disabilityId' in profileData && (
                <div className="flex items-center gap-3">
                  <User className={`h-5 w-5 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Disability ID
                    </p>
                    <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                      {profileData.disabilityId}
                    </p>
                  </div>
                </div>
              )}
              {userRole === 'teacher' && 'students' in profileData && (
                <div className="flex items-center gap-3">
                  <GraduationCap className={`h-5 w-5 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`} />
                  <div>
                    <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                      Total Students
                    </p>
                    <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                      {profileData.students}
                    </p>
                  </div>
                </div>
              )}
              {userRole === 'school' && 'totalTeachers' in profileData && (
                <>
                  <div className="flex items-center gap-3">
                    <GraduationCap className={`h-5 w-5 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Teachers
                      </p>
                      <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                        {profileData.totalTeachers}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className={`h-5 w-5 ${highContrast ? 'text-gray-400' : 'text-gray-600'}`} />
                    <div>
                      <p className={`text-sm ${highContrast ? 'text-gray-400' : 'text-gray-600'}`}>
                        Total Students
                      </p>
                      <p className={highContrast ? 'text-white' : 'text-gray-900'}>
                        {profileData.totalStudents}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Information Card */}
        <Card className={`lg:col-span-2 ${highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}`}>
          <CardHeader>
            <CardTitle className={highContrast ? 'text-white' : 'text-gray-900'}>
              Account Information
            </CardTitle>
            <CardDescription className={highContrast ? 'text-gray-300' : ''}>
              Update your personal details and contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-12">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="additional">Additional Details</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6 pt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name" className={highContrast ? 'text-gray-300' : ''}>
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className={highContrast ? 'text-gray-300' : ''}>
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className={highContrast ? 'text-gray-300' : ''}>
                      Phone Number
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="joinDate" className={highContrast ? 'text-gray-300' : ''}>
                      Join Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="joinDate"
                        value={formData.joinDate || ''}
                        disabled
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className={highContrast ? 'text-gray-300' : ''}>
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="address"
                        value={formData.address || ''}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!isEditing}
                        className="pl-10 h-12"
                      />
                    </div>
                  </div>

                  {(userRole === 'seller' || userRole === 'student') && (
                    <div className="space-y-2">
                      <Label htmlFor="disabilityId" className={highContrast ? 'text-gray-300' : ''}>
                        Disability ID
                      </Label>
                      <Input
                        id="disabilityId"
                        value={formData.disabilityId || ''}
                        onChange={(e) => setFormData({ ...formData, disabilityId: e.target.value })}
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                  )}

                  {userRole === 'student' && 'school' in profileData && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="school" className={highContrast ? 'text-gray-300' : ''}>
                          School
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="school"
                            value={formData.school || ''}
                            disabled
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacher" className={highContrast ? 'text-gray-300' : ''}>
                          Teacher
                        </Label>
                        <div className="relative">
                          <GraduationCap className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="teacher"
                            value={formData.teacher || ''}
                            disabled
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {userRole === 'teacher' && 'school' in profileData && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="school" className={highContrast ? 'text-gray-300' : ''}>
                          School
                        </Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                          <Input
                            id="school"
                            value={formData.school || ''}
                            disabled
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department" className={highContrast ? 'text-gray-300' : ''}>
                          Department
                        </Label>
                        <Input
                          id="department"
                          value={formData.department || ''}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          disabled={!isEditing}
                          className="h-12"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-6 pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="bio" className={highContrast ? 'text-gray-300' : ''}>
                      Bio
                    </Label>
                    <Textarea
                      id="bio"
                      value={formData.bio || ''}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      disabled={!isEditing}
                      rows={4}
                      className="resize-none"
                    />
                  </div>

                  {(userRole === 'seller' || userRole === 'student') && 'skills' in profileData && (
                    <div className="space-y-2">
                      <Label htmlFor="skills" className={highContrast ? 'text-gray-300' : ''}>
                        Skills & Interests
                      </Label>
                      {isEditing ? (
                        <Input
                          id="skills"
                          value={skillsInput}
                          onChange={(e) => setSkillsInput(e.target.value)}
                          placeholder="e.g. Pottery, Ceramics, Painting"
                          className="h-12"
                        />
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(profileData.skills || []).map((skill: string, index: number) => (
                            <Badge key={index} variant="secondary" className="px-4 py-2">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {userRole === 'teacher' && 'specialization' in profileData && (
                    <div className="space-y-2">
                      <Label htmlFor="specialization" className={highContrast ? 'text-gray-300' : ''}>
                        Specialization
                      </Label>
                      <Input
                        id="specialization"
                        value={formData.specialization || ''}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        disabled={!isEditing}
                        className="h-12"
                      />
                    </div>
                  )}

                  {userRole === 'school' && 'accreditation' in profileData && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="schoolId" className={highContrast ? 'text-gray-300' : ''}>
                          School ID
                        </Label>
                        <Input
                          id="schoolId"
                          value={formData.schoolId || ''}
                          disabled
                          className="h-12"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accreditation" className={highContrast ? 'text-gray-300' : ''}>
                          Accreditation
                        </Label>
                        <Input
                          id="accreditation"
                          value={formData.accreditation || ''}
                          onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                          disabled={!isEditing}
                          className="h-12"
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
