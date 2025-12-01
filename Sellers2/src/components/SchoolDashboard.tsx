import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { NotificationsPage } from './NotificationsPage';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { AccessibilityPanel } from './AccessibilityPanel';
import { ScreenReaderProvider } from '../contexts/ScreenReaderContext';
import { 
  Accessibility, Plus, Trash2, Edit, Users, GraduationCap, 
  CheckCircle, XCircle, Ban, UserCheck, Activity, MessageSquare,
  Eye, Shield, FileText, Clock, AlertCircle, ChevronDown, ChevronUp,
  Send, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type DashboardPage = 'dashboard' | 'teachers' | 'students' | 'approvals' | 'teacher-activity' | 'messages' | 'notifications' | 'profile' | 'settings' | 'help';

interface SchoolDashboardProps {
  onLogout: () => void;
}

const SCHOOL_NAME = 'Hope Academy for Special Education';

// Mock data
const MOCK_PENDING_TEACHERS = [
  { id: 'pt1', name: 'Dr. Robert Chen', email: 'robert@school.com', department: 'Art & Crafts', requestedDate: '2024-11-14', credentials: 'PhD in Art Education' },
  { id: 'pt2', name: 'Ms. Patricia Green', email: 'patricia@school.com', department: 'Music Therapy', requestedDate: '2024-11-15', credentials: 'MA in Music Therapy' },
];

const MOCK_PENDING_STUDENTS = [
  { id: 'ps1', name: 'Lucas Martinez', email: 'lucas@school.com', disabilityId: 'DIS-2024-101', requestedDate: '2024-11-14', assignedTeacher: 'Dr. Sarah Williams' },
  { id: 'ps2', name: 'Ava Thompson', email: 'ava@school.com', disabilityId: 'DIS-2024-102', requestedDate: '2024-11-15', assignedTeacher: 'Mr. James Miller' },
];

const MOCK_TEACHERS = [
  { id: '1', name: 'Dr. Sarah Williams', email: 'sarah@school.com', department: 'Art & Crafts', students: 8, status: 'active', joinDate: '2023-08-15' },
  { id: '2', name: 'Mr. James Miller', email: 'james@school.com', department: 'Music Therapy', students: 12, status: 'active', joinDate: '2023-09-01' },
  { id: '3', name: 'Mrs. Lisa Anderson', email: 'lisa@school.com', department: 'Vocational Training', students: 6, status: 'active', joinDate: '2024-01-10' },
];

const MOCK_STUDENTS = [
  { id: '1', name: 'Emma Johnson', email: 'emma@school.com', teacher: 'Dr. Sarah Williams', teacherId: '1', products: 3, status: 'active', joinDate: '2024-09-15' },
  { id: '2', name: 'Michael Brown', email: 'michael@school.com', teacher: 'Mr. James Miller', teacherId: '2', products: 1, status: 'active', joinDate: '2024-10-01' },
  { id: '3', name: 'Sophia Davis', email: 'sophia@school.com', teacher: 'Dr. Sarah Williams', teacherId: '1', products: 5, status: 'active', joinDate: '2024-08-20' },
  { id: '4', name: 'Oliver Wilson', email: 'oliver@school.com', teacher: 'Mrs. Lisa Anderson', teacherId: '3', products: 2, status: 'active', joinDate: '2024-09-10' },
];

const MOCK_TEACHER_ACTIVITY = [
  {
    id: 'ta1',
    teacherId: '1',
    teacherName: 'Dr. Sarah Williams',
    action: 'Approved student account',
    details: 'Approved account for Emma Johnson',
    studentAffected: 'Emma Johnson',
    timestamp: '2024-11-16 10:30 AM',
    type: 'account_approval'
  },
  {
    id: 'ta2',
    teacherId: '1',
    teacherName: 'Dr. Sarah Williams',
    action: 'Approved product',
    details: 'Approved "Hand-crafted Jewelry" by Emma Johnson',
    studentAffected: 'Emma Johnson',
    timestamp: '2024-11-16 09:15 AM',
    type: 'product_approval'
  },
  {
    id: 'ta3',
    teacherId: '2',
    teacherName: 'Mr. James Miller',
    action: 'Banned student',
    details: 'Banned Liam Anderson - Reason: Inappropriate product listings',
    studentAffected: 'Liam Anderson',
    timestamp: '2024-11-10 11:45 AM',
    type: 'ban'
  },
  {
    id: 'ta4',
    teacherId: '1',
    teacherName: 'Dr. Sarah Williams',
    action: 'Rejected product',
    details: 'Rejected "Wooden Crafts" by Sophia Davis - Reason: Does not meet quality standards',
    studentAffected: 'Sophia Davis',
    timestamp: '2024-11-09 2:30 PM',
    type: 'product_rejection'
  },
];

export function SchoolDashboard({ onLogout }: SchoolDashboardProps) {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(true);
  const [teachers, setTeachers] = useState(MOCK_TEACHERS);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [pendingTeachers, setPendingTeachers] = useState(MOCK_PENDING_TEACHERS);
  const [pendingStudents, setPendingStudents] = useState(MOCK_PENDING_STUDENTS);
  const [teacherActivity, setTeacherActivity] = useState(MOCK_TEACHER_ACTIVITY);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [expandedTeacher, setExpandedTeacher] = useState<string | null>(null);
  const [selectedTeacherForActivity, setSelectedTeacherForActivity] = useState<string | null>(null);
  const [messageRecipient, setMessageRecipient] = useState<{type: 'teacher' | 'student', id: string, name: string} | null>(null);

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : '';

  // Approval handlers
  const handleApproveTeacher = (id: string) => {
    const teacher = pendingTeachers.find(t => t.id === id);
    if (teacher) {
      setPendingTeachers(pendingTeachers.filter(t => t.id !== id));
      setTeachers([...teachers, {
        id: Date.now().toString(),
        name: teacher.name,
        email: teacher.email,
        department: teacher.department,
        students: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  const handleRejectTeacher = (id: string, reason: string) => {
    if (reason.trim()) {
      setPendingTeachers(pendingTeachers.filter(t => t.id !== id));
    }
  };

  const handleApproveStudent = (id: string) => {
    const student = pendingStudents.find(s => s.id === id);
    if (student) {
      setPendingStudents(pendingStudents.filter(s => s.id !== id));
      const teacherId = teachers.find(t => t.name === student.assignedTeacher)?.id || '1';
      setStudents([...students, {
        id: Date.now().toString(),
        name: student.name,
        email: student.email,
        teacher: student.assignedTeacher,
        teacherId: teacherId,
        products: 0,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
      }]);
    }
  };

  const handleRejectStudent = (id: string, reason: string) => {
    if (reason.trim()) {
      setPendingStudents(pendingStudents.filter(s => s.id !== id));
    }
  };

  const handleBanTeacher = (teacherId: string, reason: string) => {
    if (reason.trim()) {
      setTeachers(teachers.map(t => 
        t.id === teacherId 
          ? { ...t, status: 'banned', banReason: reason, bannedDate: new Date().toISOString().split('T')[0] }
          : t
      ));
    }
  };

  const handleUnbanTeacher = (teacherId: string) => {
    setTeachers(teachers.map(t => 
      t.id === teacherId 
        ? { ...t, status: 'active', banReason: undefined, bannedDate: undefined }
        : t
    ));
  };

  const handleBanStudent = (studentId: string, reason: string) => {
    if (reason.trim()) {
      setStudents(students.map(s => 
        s.id === studentId 
          ? { ...s, status: 'banned', banReason: reason, bannedDate: new Date().toISOString().split('T')[0] }
          : s
      ));
    }
  };

  const handleUnbanStudent = (studentId: string) => {
    setStudents(students.map(s => 
      s.id === studentId 
        ? { ...s, status: 'active', banReason: undefined, bannedDate: undefined }
        : s
    ));
  };

  const handleSendMessage = (message: string) => {
    if (messageRecipient && message.trim()) {
      // In a real app, this would send the message to the backend
      alert(`Message sent to ${messageRecipient.name}: ${message}`);
      setMessageRecipient(null);
    }
  };

  const handleExportTeacherActivity = () => {
    const headers = ['Date/Time', 'Teacher', 'Action', 'Student Affected', 'Details'];
    const csvContent = [
      headers.join(','),
      ...teacherActivity.map(log => [
        `"${log.timestamp}"`,
        `"${log.teacherName}"`,
        `"${log.action}"`,
        `"${log.studentAffected}"`,
        `"${log.details}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `teacher_activity_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleVoiceNavigate = (page: string) => {
    const validPages: DashboardPage[] = ['dashboard', 'teachers', 'students', 'approvals', 'teacher-activity', 'messages', 'notifications', 'profile', 'settings', 'help'];
    if (validPages.includes(page as DashboardPage)) {
      setCurrentPage(page as DashboardPage);
    }
  };

  const getTeacherActivityByTeacher = (teacherId: string) => {
    return teacherActivity.filter(activity => activity.teacherId === teacherId);
  };

  return (
    <ScreenReaderProvider enabled={screenReader}>
    <div className={`flex min-h-screen ${highContrast ? 'bg-black text-white' : 'bg-gray-50'} ${fontSizeClass}`}>
      {/* Accessibility Button */}
      <button
        onClick={() => setShowAccessibility(!showAccessibility)}
        className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-400 shadow-lg transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-yellow-600"
        aria-label="Toggle accessibility options"
      >
        <Accessibility className="h-8 w-8 text-gray-900" />
      </button>

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
          onNavigate={handleVoiceNavigate}
        />
      )}

      <DashboardSidebar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        highContrast={highContrast}
        userRole="school"
      />

      <div className="flex-1">
        <DashboardHeader 
          onLogout={onLogout} 
          highContrast={highContrast} 
          userRole="school"
          onProfileClick={() => setCurrentPage('profile')}
          onNotificationsClick={() => setCurrentPage('notifications')}
        />
        
        <main className="p-6">
          {currentPage === 'notifications' && <NotificationsPage userRole="school" highContrast={highContrast} />}
          {currentPage === 'profile' && <ProfilePage userRole="school" highContrast={highContrast} />}
          {currentPage === 'settings' && <SettingsPage userRole="school" highContrast={highContrast} />}
          {currentPage === 'help' && <HelpPage userRole="school" highContrast={highContrast} />}
          
          {/* Dashboard Overview */}
          {currentPage === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className={`relative overflow-hidden rounded-2xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-gradient-to-r from-green-600 to-teal-600'} p-8 text-white shadow-xl`}>
                <div className="relative z-10">
                  <h1 className="mb-2 text-white">School Administration Dashboard</h1>
                  <p className="text-lg text-white/90">
                    {SCHOOL_NAME}
                  </p>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid gap-6 md:grid-cols-4">
                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div>
                      <p className="text-sm text-blue-100">Total Teachers</p>
                      <h3 className="mt-2 text-white">{teachers.filter(t => t.status === 'active').length}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div>
                      <p className="text-sm text-purple-100">Total Students</p>
                      <h3 className="mt-2 text-white">{students.filter(s => s.status === 'active').length}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div>
                      <p className="text-sm text-amber-100">Pending Approvals</p>
                      <h3 className="mt-2 text-white">{pendingTeachers.length + pendingStudents.length}</h3>
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div>
                      <p className="text-sm text-green-100">Active Products</p>
                      <h3 className="mt-2 text-white">{students.reduce((sum, s) => sum + s.products, 0)}</h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Button 
                      size="lg" 
                      className="h-20 gap-2"
                      onClick={() => setCurrentPage('approvals')}
                    >
                      <CheckCircle className="h-6 w-6" />
                      <div className="text-left">
                        <div>Review Approvals</div>
                        <div className="text-xs opacity-80">{pendingTeachers.length + pendingStudents.length} pending</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-20 gap-2"
                      onClick={() => setCurrentPage('teachers')}
                    >
                      <Plus className="h-6 w-6" />
                      <div className="text-left">
                        <div>Add Teacher</div>
                        <div className="text-xs opacity-80">Create account</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-20 gap-2"
                      onClick={() => setCurrentPage('students')}
                    >
                      <Plus className="h-6 w-6" />
                      <div className="text-left">
                        <div>Add Student</div>
                        <div className="text-xs opacity-80">Create account</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-20 gap-2"
                      onClick={() => setCurrentPage('teacher-activity')}
                    >
                      <Activity className="h-6 w-6" />
                      <div className="text-left">
                        <div>View Activity</div>
                        <div className="text-xs opacity-80">Teacher actions</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Teacher Activity</CardTitle>
                      <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
                        Latest actions by teachers
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentPage('teacher-activity')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {teacherActivity.slice(0, 3).map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-start gap-4 rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          activity.type === 'account_approval' || activity.type === 'product_approval' ? 'bg-green-100' :
                          activity.type === 'ban' ? 'bg-red-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'account_approval' || activity.type === 'product_approval' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           activity.type === 'ban' ? <Ban className="h-5 w-5 text-red-600" /> :
                           <XCircle className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${highContrast ? 'text-white' : 'text-gray-900'}`}>{activity.action}</h4>
                            <Badge variant="outline">{activity.timestamp}</Badge>
                          </div>
                          <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{activity.details}</p>
                          <p className={`mt-1 text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>By: {activity.teacherName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Teachers Management Page */}
          {currentPage === 'teachers' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Teacher Management</h1>
                  <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage all teachers at {SCHOOL_NAME}
                  </p>
                </div>
                <Button size="lg" className="gap-2" onClick={() => setShowAddTeacher(true)}>
                  <Plus className="h-5 w-5" />
                  Add New Teacher
                </Button>
              </div>

              {/* Add Teacher Dialog */}
              <Dialog open={showAddTeacher} onOpenChange={setShowAddTeacher}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Teacher Account</DialogTitle>
                    <DialogDescription>
                      Add a new teacher account for {SCHOOL_NAME}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="teacherName">Teacher Full Name *</Label>
                        <Input id="teacherName" placeholder="Dr. John Smith" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="teacherEmail">Email Address *</Label>
                        <Input id="teacherEmail" type="email" placeholder="teacher@school.com" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department *</Label>
                        <Select>
                          <SelectTrigger id="department" className="h-12">
                            <SelectValue placeholder="Select department" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="art">Art & Crafts</SelectItem>
                            <SelectItem value="music">Music Therapy</SelectItem>
                            <SelectItem value="vocational">Vocational Training</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="credentials">Credentials</Label>
                        <Input id="credentials" placeholder="PhD, MA, etc." className="h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="schoolName">School</Label>
                      <Input id="schoolName" value={SCHOOL_NAME} disabled className="h-12" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button size="lg" className="flex-1">Create Teacher Account</Button>
                      <Button variant="outline" size="lg" onClick={() => setShowAddTeacher(false)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Teachers List */}
              <Tabs defaultValue="active" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="active">Active Teachers ({teachers.filter(t => t.status === 'active').length})</TabsTrigger>
                  <TabsTrigger value="banned">Banned Teachers ({teachers.filter(t => t.status === 'banned').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {teachers.filter(t => t.status === 'active').map((teacher) => (
                    <Card key={teacher.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{teacher.name}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{teacher.email}</p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                {teacher.department} • Joined: {teacher.joinDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedTeacher(expandedTeacher === teacher.id ? null : teacher.id)}
                            >
                              {expandedTeacher === teacher.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              View Details
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessageRecipient({type: 'teacher', id: teacher.id, name: teacher.name})}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Ban className="h-4 w-4 mr-1" />
                                  Ban
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Ban Teacher - {teacher.name}</DialogTitle>
                                  <DialogDescription>
                                    This action will deactivate the teacher's account. Please provide a valid reason.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`ban-teacher-${teacher.id}`}>Reason for Ban *</Label>
                                    <Textarea 
                                      id={`ban-teacher-${teacher.id}`}
                                      placeholder="Explain why this teacher is being banned..."
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <div className="flex gap-3">
                                    <Button 
                                      variant="destructive"
                                      onClick={() => {
                                        const textarea = document.getElementById(`ban-teacher-${teacher.id}`) as HTMLTextAreaElement;
                                        handleBanTeacher(teacher.id, textarea.value);
                                      }}
                                    >
                                      Confirm Ban
                                    </Button>
                                    <Button variant="outline">Cancel</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      {expandedTeacher === teacher.id && (
                        <CardContent className="space-y-4 border-t pt-4">
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                              <Users className="h-8 w-8 text-blue-600 mb-2" />
                              <p className="text-sm text-gray-600">Students Supervised</p>
                              <p className="text-2xl font-bold">{teacher.students}</p>
                            </div>
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                              <Activity className="h-8 w-8 text-purple-600 mb-2" />
                              <p className="text-sm text-gray-600">Total Actions</p>
                              <p className="text-2xl font-bold">{getTeacherActivityByTeacher(teacher.id).length}</p>
                            </div>
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                              <Shield className="h-8 w-8 text-green-600 mb-2" />
                              <p className="text-sm text-gray-600">Status</p>
                              <Badge className="mt-1">Active</Badge>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedTeacherForActivity(teacher.id);
                                setCurrentPage('teacher-activity');
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Activity Log
                            </Button>
                            <Button variant="outline" size="sm">
                              <Users className="h-4 w-4 mr-1" />
                              View Assigned Students
                            </Button>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="banned" className="space-y-4">
                  {teachers.filter(t => t.status === 'banned').map((teacher) => (
                    <Card key={teacher.id} className={`${highContrast ? 'border-2 border-red-500 bg-black' : 'border-red-200 bg-red-50 shadow-md'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 opacity-60">
                              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{teacher.name}</h3>
                                <Badge variant="destructive">BANNED</Badge>
                              </div>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{teacher.email}</p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                Banned on: {teacher.bannedDate}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUnbanTeacher(teacher.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Unban Teacher
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="border-t pt-4">
                        <div className="rounded-lg bg-red-100 border border-red-300 p-4">
                          <p className="text-sm font-semibold text-red-900 mb-1">Ban Reason:</p>
                          <p className="text-sm text-red-800">{teacher.banReason}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {teachers.filter(t => t.status === 'banned').length === 0 && (
                    <Card className="p-12 text-center">
                      <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Banned Teachers</h3>
                      <p className="text-sm text-gray-500 mt-2">All teachers are currently active</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Students Management Page */}
          {currentPage === 'students' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Student Management</h1>
                  <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage all students at {SCHOOL_NAME}
                  </p>
                </div>
                <Button size="lg" className="gap-2" onClick={() => setShowAddStudent(true)}>
                  <Plus className="h-5 w-5" />
                  Add New Student
                </Button>
              </div>

              {/* Add Student Dialog */}
              <Dialog open={showAddStudent} onOpenChange={setShowAddStudent}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create Student Account</DialogTitle>
                    <DialogDescription>
                      Add a new student account for {SCHOOL_NAME}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Full Name *</Label>
                        <Input id="studentName" placeholder="Enter student name" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentEmail">Email Address *</Label>
                        <Input id="studentEmail" type="email" placeholder="student@school.com" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentDisabilityId">Disability ID *</Label>
                        <Input id="studentDisabilityId" placeholder="DIS-2024-XXX" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="assignTeacher">Assign to Teacher *</Label>
                        <Select>
                          <SelectTrigger id="assignTeacher" className="h-12">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.filter(t => t.status === 'active').map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id}>
                                {teacher.name} ({teacher.department})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentSchool">School</Label>
                      <Input id="studentSchool" value={SCHOOL_NAME} disabled className="h-12" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button size="lg" className="flex-1">Create Student Account</Button>
                      <Button variant="outline" size="lg" onClick={() => setShowAddStudent(false)}>Cancel</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Students List */}
              <Tabs defaultValue="active" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="active">Active Students ({students.filter(s => s.status === 'active').length})</TabsTrigger>
                  <TabsTrigger value="banned">Banned Students ({students.filter(s => s.status === 'banned').length})</TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="space-y-4">
                  {students.filter(s => s.status === 'active').map((student) => (
                    <Card key={student.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{student.name}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{student.email}</p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                Teacher: {student.teacher} • Joined: {student.joinDate}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setMessageRecipient({type: 'student', id: student.id, name: student.name})}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Message
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Ban className="h-4 w-4 mr-1" />
                                  Ban
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Ban Student - {student.name}</DialogTitle>
                                  <DialogDescription>
                                    This action will deactivate the student's account. Please provide a valid reason.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`ban-student-${student.id}`}>Reason for Ban *</Label>
                                    <Textarea 
                                      id={`ban-student-${student.id}`}
                                      placeholder="Explain why this student is being banned..."
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <div className="flex gap-3">
                                    <Button 
                                      variant="destructive"
                                      onClick={() => {
                                        const textarea = document.getElementById(`ban-student-${student.id}`) as HTMLTextAreaElement;
                                        handleBanStudent(student.id, textarea.value);
                                      }}
                                    >
                                      Confirm Ban
                                    </Button>
                                    <Button variant="outline">Cancel</Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="banned" className="space-y-4">
                  {students.filter(s => s.status === 'banned').map((student) => (
                    <Card key={student.id} className={`${highContrast ? 'border-2 border-red-500 bg-black' : 'border-red-200 bg-red-50 shadow-md'}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 opacity-60">
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{student.name}</h3>
                                <Badge variant="destructive">BANNED</Badge>
                              </div>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{student.email}</p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                Banned on: {student.bannedDate}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleUnbanStudent(student.id)}
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Unban Student
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="border-t pt-4">
                        <div className="rounded-lg bg-red-100 border border-red-300 p-4">
                          <p className="text-sm font-semibold text-red-900 mb-1">Ban Reason:</p>
                          <p className="text-sm text-red-800">{student.banReason}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {students.filter(s => s.status === 'banned').length === 0 && (
                    <Card className="p-12 text-center">
                      <UserCheck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Banned Students</h3>
                      <p className="text-sm text-gray-500 mt-2">All students are currently active</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Approvals Page */}
          {currentPage === 'approvals' && (
            <div className="space-y-8">
              <div>
                <h1>Pending Approvals</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Review and approve teacher and student sign-in requests
                </p>
              </div>

              <Tabs defaultValue="teachers" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="teachers">
                    Teacher Requests ({pendingTeachers.length})
                  </TabsTrigger>
                  <TabsTrigger value="students">
                    Student Requests ({pendingStudents.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="teachers" className="space-y-4">
                  {pendingTeachers.map((teacher) => (
                    <Card key={teacher.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{teacher.name}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{teacher.email}</p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                Department: {teacher.department} • Requested: {teacher.requestedDate}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Pending Review</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 border-t pt-4">
                        <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                          <p className="text-sm font-semibold mb-2">Credentials:</p>
                          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>{teacher.credentials}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            size="lg"
                            className="flex-1"
                            onClick={() => handleApproveTeacher(teacher.id)}
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Approve Teacher
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="lg" className="flex-1">
                                <XCircle className="h-5 w-5 mr-2" />
                                Reject Teacher
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Teacher Request - {teacher.name}</DialogTitle>
                                <DialogDescription>
                                  Please provide a valid reason for rejecting this teacher application.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`reject-teacher-${teacher.id}`}>Rejection Reason *</Label>
                                  <Textarea 
                                    id={`reject-teacher-${teacher.id}`}
                                    placeholder="Explain why this application is being rejected..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      const textarea = document.getElementById(`reject-teacher-${teacher.id}`) as HTMLTextAreaElement;
                                      handleRejectTeacher(teacher.id, textarea.value);
                                    }}
                                  >
                                    Confirm Rejection
                                  </Button>
                                  <Button variant="outline">Cancel</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {pendingTeachers.length === 0 && (
                    <Card className="p-12 text-center">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Pending Teacher Requests</h3>
                      <p className="text-sm text-gray-500 mt-2">All requests have been reviewed</p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="students" className="space-y-4">
                  {pendingStudents.map((student) => (
                    <Card key={student.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14">
                              <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{student.name}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{student.email}</p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                Assigned Teacher: {student.assignedTeacher} • Requested: {student.requestedDate}
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary">Pending Review</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 border-t pt-4">
                        <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                          <p className="text-sm font-semibold mb-2">Disability ID:</p>
                          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>{student.disabilityId}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            size="lg"
                            className="flex-1"
                            onClick={() => handleApproveStudent(student.id)}
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Approve Student
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="lg" className="flex-1">
                                <XCircle className="h-5 w-5 mr-2" />
                                Reject Student
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Student Request - {student.name}</DialogTitle>
                                <DialogDescription>
                                  Please provide a valid reason for rejecting this student application.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`reject-student-${student.id}`}>Rejection Reason *</Label>
                                  <Textarea 
                                    id={`reject-student-${student.id}`}
                                    placeholder="Explain why this application is being rejected..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      const textarea = document.getElementById(`reject-student-${student.id}`) as HTMLTextAreaElement;
                                      handleRejectStudent(student.id, textarea.value);
                                    }}
                                  >
                                    Confirm Rejection
                                  </Button>
                                  <Button variant="outline">Cancel</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {pendingStudents.length === 0 && (
                    <Card className="p-12 text-center">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Pending Student Requests</h3>
                      <p className="text-sm text-gray-500 mt-2">All requests have been reviewed</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Teacher Activity Page */}
          {currentPage === 'teacher-activity' && (
            <div className="space-y-8">
              <div>
                <h1>Teacher Activity Log</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Monitor all teacher actions on student accounts
                </p>
              </div>

              {/* Filter by Teacher */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="filterTeacher" className="min-w-fit">Filter by Teacher:</Label>
                    <Select 
                      value={selectedTeacherForActivity || 'all'} 
                      onValueChange={(value) => setSelectedTeacherForActivity(value === 'all' ? null : value)}
                    >
                      <SelectTrigger id="filterTeacher" className="h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Teachers</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id}>
                            {teacher.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={handleExportTeacherActivity}>
                      <Download className="h-4 w-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Activity List */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    All Teacher Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(selectedTeacherForActivity 
                      ? getTeacherActivityByTeacher(selectedTeacherForActivity) 
                      : teacherActivity
                    ).map((activity) => (
                      <div
                        key={activity.id}
                        className={`flex items-start gap-4 rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          activity.type === 'account_approval' || activity.type === 'product_approval' ? 'bg-green-100' :
                          activity.type === 'ban' ? 'bg-red-100' :
                          'bg-orange-100'
                        }`}>
                          {activity.type === 'account_approval' || activity.type === 'product_approval' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           activity.type === 'ban' ? <Ban className="h-5 w-5 text-red-600" /> :
                           <XCircle className="h-5 w-5 text-orange-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${highContrast ? 'text-white' : 'text-gray-900'}`}>{activity.action}</h4>
                            <Badge variant="outline">{activity.timestamp}</Badge>
                          </div>
                          <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{activity.details}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                              Teacher: {activity.teacherName}
                            </p>
                            <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                              Student Affected: {activity.studentAffected}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={highContrast ? 'border-2 border-blue-500 bg-black' : 'bg-blue-50 border-blue-200'}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Shield className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Activity Monitoring & Compliance</h4>
                      <p className="text-sm text-blue-800">
                        All teacher actions are automatically logged and tracked for institutional oversight. This includes account approvals, 
                        product approvals/rejections, student bans, and other disciplinary actions. Export reports for compliance and auditing purposes.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Messages Page */}
          {currentPage === 'messages' && (
            <div className="space-y-8">
              <div>
                <h1>Messages</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Communicate with teachers and students
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardHeader>
                    <CardTitle>Message Teachers</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {teachers.filter(t => t.status === 'active').map((teacher) => (
                      <div
                        key={teacher.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className={highContrast ? 'text-white' : 'text-gray-900'}>{teacher.name}</h4>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{teacher.department}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setMessageRecipient({type: 'teacher', id: teacher.id, name: teacher.name})}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                  <CardHeader>
                    <CardTitle>Message Students</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {students.filter(s => s.status === 'active').map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className={highContrast ? 'text-white' : 'text-gray-900'}>{student.name}</h4>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Teacher: {student.teacher}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setMessageRecipient({type: 'student', id: student.id, name: student.name})}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Message Dialog */}
          <Dialog open={messageRecipient !== null} onOpenChange={(open) => !open && setMessageRecipient(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to {messageRecipient?.name}</DialogTitle>
                <DialogDescription>
                  Compose a message to this {messageRecipient?.type}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="messageSubject">Subject</Label>
                  <Input id="messageSubject" placeholder="Message subject" className="h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="messageBody">Message</Label>
                  <Textarea 
                    id="messageBody"
                    placeholder="Type your message here..."
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="lg"
                    onClick={() => {
                      const messageBody = (document.getElementById('messageBody') as HTMLTextAreaElement).value;
                      handleSendMessage(messageBody);
                    }}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => setMessageRecipient(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
    </ScreenReaderProvider>
  );
}
