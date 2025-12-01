import { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardHeader } from './DashboardHeader';
import { NotificationsPage } from './NotificationsPage';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { HelpPage } from './HelpPage';
import { AccessibilityPanel } from './AccessibilityPanel';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ScreenReaderProvider } from '../contexts/ScreenReaderContext';
import { 
  Accessibility, Plus, CheckCircle, XCircle, ShoppingBag, TrendingUp, 
  AlertCircle, DollarSign, MessageSquare, Ban, UserCheck, FileText,
  Clock, Eye, Shield, Activity, Award, ChevronDown, ChevronUp, Download
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

type DashboardPage = 'dashboard' | 'students' | 'pending-approvals' | 'products' | 'student-activity' | 'rankings' | 'activity-log' | 'notifications' | 'profile' | 'settings' | 'help';

interface TeacherDashboardProps {
  onLogout: () => void;
}

// Mock data
const TEACHER_SCHOOL = 'Lincoln High School';

const MOCK_PENDING_STUDENTS = [
  { id: 'p1', name: 'James Wilson', email: 'james@school.com', disabilityId: 'DIS-2024-001', requestedDate: '2024-11-14', school: 'Lincoln High School' },
  { id: 'p2', name: 'Olivia Martinez', email: 'olivia@school.com', disabilityId: 'DIS-2024-002', requestedDate: '2024-11-15', school: 'Lincoln High School' },
];

const MOCK_STUDENTS = [
  { 
    id: '1', 
    name: 'Emma Johnson', 
    email: 'emma@school.com', 
    school: 'Lincoln High School',
    products: 3, 
    status: 'active',
    totalSales: 450.00,
    totalInquiries: 12,
    unrespondedInquiries: 2,
    joinDate: '2024-09-15'
  },
  { 
    id: '2', 
    name: 'Michael Brown', 
    email: 'michael@school.com',
    school: 'Lincoln High School', 
    products: 1, 
    status: 'active',
    totalSales: 125.00,
    totalInquiries: 5,
    unrespondedInquiries: 0,
    joinDate: '2024-10-01'
  },
  { 
    id: '3', 
    name: 'Sophia Davis', 
    email: 'sophia@school.com',
    school: 'Lincoln High School', 
    products: 5, 
    status: 'active',
    totalSales: 780.00,
    totalInquiries: 18,
    unrespondedInquiries: 3,
    joinDate: '2024-08-20'
  },
  { 
    id: '4', 
    name: 'Liam Anderson', 
    email: 'liam@school.com',
    school: 'Lincoln High School', 
    products: 0, 
    status: 'banned',
    totalSales: 0,
    totalInquiries: 0,
    unrespondedInquiries: 0,
    joinDate: '2024-09-01',
    banReason: 'Inappropriate product listings',
    bannedDate: '2024-11-10',
    bannedBy: 'Teacher John Smith'
  },
];

const MOCK_PENDING_PRODUCTS = [
  {
    id: 'pp1',
    studentId: '1',
    studentName: 'Emma Johnson',
    title: 'Hand-painted Ceramics',
    category: 'Art & Crafts',
    price: 45.00,
    description: 'Beautiful hand-painted ceramic bowls',
    submittedDate: '2024-11-16',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1610701596295-4dc5d6289214?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYW5kbWFkZSUyMGNlcmFtaWNzJTIwYm93bHxlbnwxfHx8fDE3NjMyNjA5MDd8MA&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'pp2',
    studentId: '3',
    studentName: 'Sophia Davis',
    title: 'Knitted Scarves',
    category: 'Clothing',
    price: 25.00,
    description: 'Warm winter scarves, hand-knitted',
    submittedDate: '2024-11-15',
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1572371179162-9c0141483610?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrbml0dGVkJTIwc2NhcmYlMjB3aW50ZXJ8ZW58MXx8fHwxNzYzMjk0MjQ2fDA&ixlib=rb-4.1.0&q=80&w=1080'
  },
];

const MOCK_ACTIVITY_LOG = [
  {
    id: 'log1',
    teacherName: 'You',
    action: 'Approved product',
    details: 'Approved "Hand-crafted Jewelry" by Emma Johnson',
    timestamp: '2024-11-16 10:30 AM',
    type: 'product_approval'
  },
  {
    id: 'log2',
    teacherName: 'You',
    action: 'Created student account',
    details: 'Created account for Michael Brown',
    timestamp: '2024-11-15 2:15 PM',
    type: 'account_creation'
  },
  {
    id: 'log3',
    teacherName: 'You',
    action: 'Banned student',
    details: 'Banned Liam Anderson - Reason: Inappropriate product listings',
    timestamp: '2024-11-10 11:45 AM',
    type: 'ban'
  },
  {
    id: 'log4',
    teacherName: 'You',
    action: 'Assisted product placement',
    details: 'Added product "Wooden Toys" for Emma Johnson (Authorization: #AUTH-2024-001)',
    timestamp: '2024-11-09 3:20 PM',
    type: 'product_assistance'
  },
];

export function TeacherDashboard({ onLogout }: TeacherDashboardProps) {
  const [currentPage, setCurrentPage] = useState<DashboardPage>('dashboard');
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'extra-large'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(true);
  const [voiceNavigation, setVoiceNavigation] = useState(true);
  const [students, setStudents] = useState(MOCK_STUDENTS);
  const [pendingStudents, setPendingStudents] = useState(MOCK_PENDING_STUDENTS);
  const [pendingProducts, setPendingProducts] = useState(MOCK_PENDING_PRODUCTS);
  const [activityLog, setActivityLog] = useState(MOCK_ACTIVITY_LOG);
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const fontSizeClass = fontSize === 'large' ? 'text-lg' : fontSize === 'extra-large' ? 'text-xl' : '';

  const handleApproveStudent = (id: string) => {
    const student = pendingStudents.find(s => s.id === id);
    if (student) {
      setPendingStudents(pendingStudents.filter(s => s.id !== id));
      setStudents([...students, {
        id: Date.now().toString(),
        name: student.name,
        email: student.email,
        school: student.school,
        products: 0,
        status: 'active',
        totalSales: 0,
        totalInquiries: 0,
        unrespondedInquiries: 0,
        joinDate: new Date().toISOString().split('T')[0]
      }]);
      
      // Add to activity log
      setActivityLog([{
        id: `log${Date.now()}`,
        teacherName: 'You',
        action: 'Approved student account',
        details: `Approved account for ${student.name}`,
        timestamp: new Date().toLocaleString(),
        type: 'account_approval'
      }, ...activityLog]);
    }
  };

  const handleRejectStudent = (id: string, reason: string) => {
    const student = pendingStudents.find(s => s.id === id);
    if (student && reason.trim()) {
      setPendingStudents(pendingStudents.filter(s => s.id !== id));
      
      // Add to activity log
      setActivityLog([{
        id: `log${Date.now()}`,
        teacherName: 'You',
        action: 'Rejected student account',
        details: `Rejected account for ${student.name} - Reason: ${reason}`,
        timestamp: new Date().toLocaleString(),
        type: 'account_rejection'
      }, ...activityLog]);
    }
  };

  const handleApproveProduct = (productId: string) => {
    const product = pendingProducts.find(p => p.id === productId);
    if (product) {
      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
      
      // Add to activity log
      setActivityLog([{
        id: `log${Date.now()}`,
        teacherName: 'You',
        action: 'Approved product',
        details: `Approved "${product.title}" by ${product.studentName}`,
        timestamp: new Date().toLocaleString(),
        type: 'product_approval'
      }, ...activityLog]);
    }
  };

  const handleRejectProduct = (productId: string, reason: string) => {
    const product = pendingProducts.find(p => p.id === productId);
    if (product && reason.trim()) {
      setPendingProducts(pendingProducts.filter(p => p.id !== productId));
      
      // Add to activity log
      setActivityLog([{
        id: `log${Date.now()}`,
        teacherName: 'You',
        action: 'Rejected product',
        details: `Rejected "${product.title}" by ${product.studentName} - Reason: ${reason}`,
        timestamp: new Date().toLocaleString(),
        type: 'product_rejection'
      }, ...activityLog]);
    }
  };

  const handleBanStudent = (studentId: string, reason: string) => {
    const student = students.find(s => s.id === studentId);
    if (student && reason.trim()) {
      setStudents(students.map(s => 
        s.id === studentId 
          ? { ...s, status: 'banned', banReason: reason, bannedDate: new Date().toISOString().split('T')[0], bannedBy: 'You' }
          : s
      ));
      
      // Add to activity log
      setActivityLog([{
        id: `log${Date.now()}`,
        teacherName: 'You',
        action: 'Banned student',
        details: `Banned ${student.name} - Reason: ${reason}`,
        timestamp: new Date().toLocaleString(),
        type: 'ban'
      }, ...activityLog]);
    }
  };

  const handleUnbanStudent = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      setStudents(students.map(s => 
        s.id === studentId 
          ? { ...s, status: 'active', banReason: undefined, bannedDate: undefined, bannedBy: undefined }
          : s
      ));
      
      // Add to activity log
      setActivityLog([{
        id: `log${Date.now()}`,
        teacherName: 'You',
        action: 'Unbanned student',
        details: `Unbanned ${student.name}`,
        timestamp: new Date().toLocaleString(),
        type: 'unban'
      }, ...activityLog]);
    }
  };

  const handleVoiceNavigate = (page: string) => {
    const validPages: DashboardPage[] = ['dashboard', 'students', 'pending-approvals', 'products', 'student-activity', 'rankings', 'activity-log', 'notifications', 'profile', 'settings', 'help'];
    if (validPages.includes(page as DashboardPage)) {
      setCurrentPage(page as DashboardPage);
    }
  };

  const handleExportActivityReport = () => {
    // Create CSV content
    const headers = ['Date/Time', 'Action', 'Details', 'Teacher'];
    const csvContent = [
      headers.join(','),
      ...activityLog.map(log => [
        `"${log.timestamp}"`,
        `"${log.action}"`,
        `"${log.details}"`,
        `"${log.teacherName}"`
      ].join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate rankings
  const rankedStudents = [...students]
    .filter(s => s.status === 'active')
    .sort((a, b) => b.totalSales - a.totalSales)
    .map((student, index) => ({
      ...student,
      rank: index + 1
    }));

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
        userRole="teacher"
      />

      <div className="flex-1">
        <DashboardHeader 
          onLogout={onLogout} 
          highContrast={highContrast} 
          userRole="teacher"
          onProfileClick={() => setCurrentPage('profile')}
          onNotificationsClick={() => setCurrentPage('notifications')}
        />
        
        <main className="p-6">
          {currentPage === 'notifications' && <NotificationsPage userRole="teacher" highContrast={highContrast} />}
          {currentPage === 'profile' && <ProfilePage userRole="teacher" highContrast={highContrast} />}
          {currentPage === 'settings' && <SettingsPage userRole="teacher" highContrast={highContrast} />}
          {currentPage === 'help' && <HelpPage userRole="teacher" highContrast={highContrast} />}
          
          {currentPage === 'dashboard' && (
            <div className="space-y-8">
              {/* Welcome Section */}
              <div className={`relative overflow-hidden rounded-2xl ${highContrast ? 'border-2 border-white bg-black' : 'bg-gradient-to-r from-blue-600 to-purple-600'} p-8 text-white shadow-xl`}>
                <div className="relative z-10">
                  <h1 className="mb-2 text-white">Teacher Dashboard</h1>
                  <p className="text-lg text-white/90">
                    {TEACHER_SCHOOL} - Manage and support your students
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-100">Total Students</p>
                        <h3 className="mt-2 text-white">{students.filter(s => s.status === 'active').length}</h3>
                      </div>
                      <UserCheck className="h-10 w-10 text-blue-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-amber-100">Pending Approvals</p>
                        <h3 className="mt-2 text-white">{pendingStudents.length + pendingProducts.length}</h3>
                      </div>
                      <Clock className="h-10 w-10 text-amber-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-100">Active Products</p>
                        <h3 className="mt-2 text-white">{students.reduce((sum, s) => sum + s.products, 0)}</h3>
                      </div>
                      <ShoppingBag className="h-10 w-10 text-green-100" />
                    </div>
                  </CardContent>
                </Card>

                <Card className={`${highContrast ? 'border-2 border-white bg-black' : 'border-0 bg-gradient-to-br from-red-500 to-pink-600 shadow-lg'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-red-100">Unresponded Inquiries</p>
                        <h3 className="mt-2 text-white">{students.reduce((sum, s) => sum + s.unrespondedInquiries, 0)}</h3>
                      </div>
                      <AlertCircle className="h-10 w-10 text-red-100" />
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
                  <div className="grid gap-4 md:grid-cols-3">
                    <Button 
                      size="lg" 
                      className="h-20 gap-2"
                      onClick={() => setCurrentPage('pending-approvals')}
                    >
                      <CheckCircle className="h-6 w-6" />
                      <div className="text-left">
                        <div>Review Approvals</div>
                        <div className="text-xs opacity-80">{pendingStudents.length + pendingProducts.length} pending</div>
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
                        <div className="text-xs opacity-80">Create new account</div>
                      </div>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline"
                      className="h-20 gap-2"
                      onClick={() => setCurrentPage('rankings')}
                    >
                      <Award className="h-6 w-6" />
                      <div className="text-left">
                        <div>View Rankings</div>
                        <div className="text-xs opacity-80">Top performers</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Top Students Preview */}
              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Top Performing Students</CardTitle>
                      <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-500'}`}>
                        Based on total sales
                      </p>
                    </div>
                    <Button variant="outline" onClick={() => setCurrentPage('rankings')}>
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {rankedStudents.slice(0, 3).map((student) => (
                      <div
                        key={student.id}
                        className={`flex items-center justify-between rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                            student.rank === 1 ? 'bg-yellow-500' :
                            student.rank === 2 ? 'bg-gray-400' :
                            'bg-orange-600'
                          } text-white`}>
                            #{student.rank}
                          </div>
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className={highContrast ? 'text-white' : 'text-gray-900'}>{student.name}</h4>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                              {student.products} products • {student.totalInquiries} inquiries
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-green-600">${student.totalSales.toFixed(2)}</p>
                          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Total Sales</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Student Management Page */}
          {currentPage === 'students' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1>Student Management</h1>
                  <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Manage students from {TEACHER_SCHOOL}
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
                      Add a new student account for {TEACHER_SCHOOL}
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
                        <Label htmlFor="studentId">Student ID *</Label>
                        <Input id="studentId" placeholder="Student ID number" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="disabilityId">Disability ID *</Label>
                        <Input id="disabilityId" placeholder="Disability ID number" className="h-12" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="school">School</Label>
                      <Input id="school" value={TEACHER_SCHOOL} disabled className="h-12" />
                      <p className="text-sm text-gray-500">Students will be automatically assigned to your school</p>
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
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>Joined: {student.joinDate}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setExpandedStudent(expandedStudent === student.id ? null : student.id)}
                            >
                              {expandedStudent === student.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                              View Details
                            </Button>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Ban className="h-4 w-4 mr-1" />
                                  Ban Student
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Ban Student - {student.name}</DialogTitle>
                                  <DialogDescription>
                                    This action will deactivate the student's account. Please provide a reason.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`ban-reason-${student.id}`}>Reason for Ban *</Label>
                                    <Textarea 
                                      id={`ban-reason-${student.id}`}
                                      placeholder="Explain why this student is being banned..."
                                      className="min-h-[100px]"
                                    />
                                  </div>
                                  <div className="flex gap-3">
                                    <Button 
                                      variant="destructive" 
                                      onClick={() => {
                                        const textarea = document.getElementById(`ban-reason-${student.id}`) as HTMLTextAreaElement;
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
                      {expandedStudent === student.id && (
                        <CardContent className="space-y-4 border-t pt-4">
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                              <ShoppingBag className="h-8 w-8 text-blue-600 mb-2" />
                              <p className="text-sm text-gray-600">Products</p>
                              <p className="text-2xl font-bold">{student.products}</p>
                            </div>
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                              <DollarSign className="h-8 w-8 text-green-600 mb-2" />
                              <p className="text-sm text-gray-600">Total Sales</p>
                              <p className="text-2xl font-bold">${student.totalSales.toFixed(2)}</p>
                            </div>
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                              <MessageSquare className="h-8 w-8 text-purple-600 mb-2" />
                              <p className="text-sm text-gray-600">Total Inquiries</p>
                              <p className="text-2xl font-bold">{student.totalInquiries}</p>
                            </div>
                            <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-red-200 bg-red-50'}`}>
                              <AlertCircle className="h-8 w-8 text-red-600 mb-2" />
                              <p className="text-sm text-gray-600">Unresponded</p>
                              <p className="text-2xl font-bold text-red-600">{student.unrespondedInquiries}</p>
                            </div>
                          </div>
                          <div className="flex gap-3">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View All Products
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              View Inquiries
                            </Button>
                            <Button variant="outline" size="sm">
                              <Plus className="h-4 w-4 mr-1" />
                              Assist with Product Placement
                            </Button>
                          </div>
                        </CardContent>
                      )}
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
                                Banned on: {student.bannedDate} by {student.bannedBy}
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

          {/* Pending Approvals Page */}
          {currentPage === 'pending-approvals' && (
            <div className="space-y-8">
              <div>
                <h1>Pending Approvals</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Review and approve student accounts and product listings
                </p>
              </div>

              <Tabs defaultValue="students" className="space-y-6">
                <TabsList>
                  <TabsTrigger value="students">
                    Student Accounts ({pendingStudents.length})
                  </TabsTrigger>
                  <TabsTrigger value="products">
                    Product Listings ({pendingProducts.length})
                  </TabsTrigger>
                </TabsList>

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
                                Requested: {student.requestedDate} • School: {student.school}
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
                            Approve Account
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="lg" className="flex-1">
                                <XCircle className="h-5 w-5 mr-2" />
                                Reject Account
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Account - {student.name}</DialogTitle>
                                <DialogDescription>
                                  Please provide a reason for rejecting this account application.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`reject-reason-${student.id}`}>Rejection Reason *</Label>
                                  <Textarea 
                                    id={`reject-reason-${student.id}`}
                                    placeholder="Explain why this account is being rejected..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      const textarea = document.getElementById(`reject-reason-${student.id}`) as HTMLTextAreaElement;
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
                      <h3 className="text-gray-600">No Pending Student Accounts</h3>
                      <p className="text-sm text-gray-500 mt-2">All account requests have been reviewed</p>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="products" className="space-y-4">
                  {pendingProducts.map((product) => (
                    <Card key={product.id} className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md'}>
                      <CardHeader>
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Product Image */}
                            <div className="w-32 h-32 rounded-lg overflow-hidden flex-shrink-0 border-2 border-gray-300">
                              <ImageWithFallback
                                src={product.image}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{product.title}</h3>
                              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                                By: {product.studentName} • Category: {product.category}
                              </p>
                              <p className={`text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>
                                Submitted: {product.submittedDate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-green-600">${product.price.toFixed(2)}</p>
                            <Badge variant="secondary">Pending Review</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 border-t pt-4">
                        <div className={`rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
                          <p className="text-sm font-semibold mb-2">Product Description:</p>
                          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-700'}`}>{product.description}</p>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            size="lg"
                            className="flex-1"
                            onClick={() => handleApproveProduct(product.id)}
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Approve Product
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="lg" className="flex-1">
                                <XCircle className="h-5 w-5 mr-2" />
                                Reject Product
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Reject Product - {product.title}</DialogTitle>
                                <DialogDescription>
                                  Please provide a valid reason for rejecting this product listing.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor={`reject-product-${product.id}`}>Rejection Reason *</Label>
                                  <Textarea 
                                    id={`reject-product-${product.id}`}
                                    placeholder="Explain why this product is being rejected..."
                                    className="min-h-[100px]"
                                  />
                                </div>
                                <div className="flex gap-3">
                                  <Button 
                                    variant="destructive"
                                    onClick={() => {
                                      const textarea = document.getElementById(`reject-product-${product.id}`) as HTMLTextAreaElement;
                                      handleRejectProduct(product.id, textarea.value);
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
                  {pendingProducts.length === 0 && (
                    <Card className="p-12 text-center">
                      <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-gray-600">No Pending Products</h3>
                      <p className="text-sm text-gray-500 mt-2">All product listings have been reviewed</p>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {/* Student Rankings Page */}
          {currentPage === 'rankings' && (
            <div className="space-y-8">
              <div>
                <h1>Student Rankings</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Top performing students ranked by sales and inquiries
                </p>
              </div>

              <div className="space-y-4">
                {rankedStudents.map((student) => (
                  <Card key={student.id} className={`${highContrast ? 'border-2 border-white bg-black' : 'shadow-md'} ${
                    student.rank <= 3 ? 'border-2 border-yellow-500' : ''
                  }`}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className={`flex h-16 w-16 items-center justify-center rounded-full text-white text-xl ${
                            student.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                            student.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                            student.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                            'bg-gradient-to-br from-blue-400 to-blue-600'
                          }`}>
                            #{student.rank}
                          </div>
                          <Avatar className="h-16 w-16">
                            <AvatarFallback className="text-lg">{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className={highContrast ? 'text-white' : 'text-gray-900'}>{student.name}</h3>
                              {student.rank === 1 && <Award className="h-5 w-5 text-yellow-500" />}
                            </div>
                            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{student.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <ShoppingBag className="h-4 w-4 text-blue-600" />
                                <span className="text-sm">{student.products} products</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageSquare className="h-4 w-4 text-purple-600" />
                                <span className="text-sm">{student.totalInquiries} inquiries</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            <p className="text-3xl font-bold text-green-600">${student.totalSales.toFixed(2)}</p>
                          </div>
                          <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>Total Sales</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Activity Log Page */}
          {currentPage === 'activity-log' && (
            <div className="space-y-8">
              <div>
                <h1>Activity Log</h1>
                <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                  Track all teacher actions for reporting to {TEACHER_SCHOOL}
                </p>
              </div>

              <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activityLog.map((log) => (
                      <div
                        key={log.id}
                        className={`flex items-start gap-4 rounded-lg border p-4 ${highContrast ? 'border-white' : 'border-gray-200'}`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          log.type === 'product_approval' || log.type === 'account_approval' ? 'bg-green-100' :
                          log.type === 'product_rejection' || log.type === 'account_rejection' ? 'bg-red-100' :
                          log.type === 'ban' ? 'bg-orange-100' :
                          log.type === 'unban' ? 'bg-blue-100' :
                          'bg-purple-100'
                        }`}>
                          {log.type === 'product_approval' || log.type === 'account_approval' ? <CheckCircle className="h-5 w-5 text-green-600" /> :
                           log.type === 'product_rejection' || log.type === 'account_rejection' ? <XCircle className="h-5 w-5 text-red-600" /> :
                           log.type === 'ban' ? <Ban className="h-5 w-5 text-orange-600" /> :
                           log.type === 'unban' ? <UserCheck className="h-5 w-5 text-blue-600" /> :
                           <FileText className="h-5 w-5 text-purple-600" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${highContrast ? 'text-white' : 'text-gray-900'}`}>{log.action}</h4>
                            <Badge variant="outline">{log.timestamp}</Badge>
                          </div>
                          <p className={`mt-1 text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>{log.details}</p>
                          <p className={`mt-1 text-xs ${highContrast ? 'text-gray-400' : 'text-gray-500'}`}>By: {log.teacherName}</p>
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
                      <h4 className="font-semibold text-blue-900 mb-2">Reporting & Compliance</h4>
                      <p className="text-sm text-blue-800">
                        All actions logged here are automatically tracked and reported to {TEACHER_SCHOOL} administration. 
                        This ensures transparency and accountability in student management, product approvals, and disciplinary actions.
                      </p>
                      <Button variant="outline" className="mt-4" size="sm" onClick={handleExportActivityReport}>
                        <FileText className="h-4 w-4 mr-2" />
                        Export Activity Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
    </ScreenReaderProvider>
  );
}