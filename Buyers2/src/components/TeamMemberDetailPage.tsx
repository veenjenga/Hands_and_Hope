import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Card, CardContent } from './ui/card';
import { Mail, GraduationCap, Briefcase, ArrowLeft, Award, Target } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AccessibilitySettings } from './AccessibilityMenu';

interface TeamMemberDetailPageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

interface TeamMemberData {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  education: string[];
  contact: string;
  image: string;
  bio: string;
  expertise: string[];
  achievements: string[];
}

export default function TeamMemberDetailPage({ isLoggedIn, currentUser, onLogout, accessibilitySettings, onAccessibilityChange }: TeamMemberDetailPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const teamMembersData: { [key: string]: TeamMemberData } = {
    'viona-njenga': {
      id: 'viona-njenga',
      name: 'Viona Njenga',
      role: 'Group Leader',
      responsibilities: [
        'Main point of contact with Innovate Now and external parties',
        'Communication and schedule coordination',
        'Submission of reports and feedback forms',
        'Team management and strategic planning',
        'Stakeholder engagement and relationship building'
      ],
      education: [
        'Bachelor of Science in Computer Technology',
        'Jomo Kenyatta University of Agriculture and Technology (JKUAT)'
      ],
      contact: 'viona.njenga@students.jkuat.ac.ke',
      image: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU5MTc1MXww&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Viona Njenga is a passionate leader and computer technology student at JKUAT, dedicated to leveraging technology for social impact. As the Group Leader of the Hands and Hope project, she coordinates all team activities and serves as the primary liaison with external stakeholders. With a strong background in project management and team coordination, Viona ensures that the platform development stays on track and aligned with the mission of empowering people with disabilities. Her leadership style emphasizes inclusivity, clear communication, and strategic thinking, making her instrumental in driving the project forward.',
      expertise: [
        'Project Management',
        'Team Leadership',
        'Stakeholder Communication',
        'Strategic Planning',
        'Computer Technology'
      ],
      achievements: [
        'Successfully coordinated Hands and Hope development team',
        'Established partnerships with Innovate Now and disability institutions',
        'Led team through multiple development milestones',
        'Implemented effective communication protocols for the team'
      ]
    },
    'ronaldo-cheruiyot': {
      id: 'ronaldo-cheruiyot',
      name: 'Ronaldo Cheruiyot',
      role: 'Product Development Lead',
      responsibilities: [
        'Oversee all technical planning and code coordination',
        'Assign and review development tasks',
        'Manage GitHub integration and technical progress',
        'Architecture design and implementation',
        'Code quality assurance and technical documentation'
      ],
      education: [
        'Bachelor of Science in Computer Technology',
        'KCA University, 4th Year'
      ],
      contact: 'ronaldokipkirui90@gmail.com',
      image: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ1NTA2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Ronaldo Cheruiyot is a talented software developer and the Product Development Lead for Hands and Hope. Currently in his 4th year at KCA University studying Computer Technology, Ronaldo brings extensive technical expertise in full-stack development, system architecture, and modern web technologies. He is responsible for overseeing all technical aspects of the platform, from initial architecture design to implementation and deployment. His meticulous approach to code quality and his ability to break down complex problems into manageable tasks have been crucial to the platform\'s success. Ronaldo is passionate about using technology to create accessible solutions that make a real difference.',
      expertise: [
        'Full-Stack Development',
        'React & TypeScript',
        'System Architecture',
        'GitHub & Version Control',
        'Technical Leadership',
        'Accessibility Implementation'
      ],
      achievements: [
        'Architected the complete Hands and Hope platform',
        'Implemented comprehensive accessibility features',
        'Led technical team in delivering MVP on schedule',
        'Established development best practices and code standards',
        'Integrated multiple payment systems and advanced features'
      ]
    },
    'james-mwaura': {
      id: 'james-mwaura',
      name: 'James Mwaura',
      role: 'User Research',
      responsibilities: [
        'Plan and conduct user interviews and accessibility feedback sessions',
        'Gather testing session data with users with disabilities',
        'Ensure accessibility standards (e.g., screen reader compatibility, font choice, contrast)',
        'User experience analysis and recommendations',
        'Accessibility compliance testing and validation'
      ],
      education: [
        'Diploma of Education, Computer Software Engineering',
        'Zetech University (Feb 2025 - Nov 2028)',
        'Bachelor of Applied Communication',
        'Multimedia University of Kenya (Aug 2023 - Nov 2027)'
      ],
      contact: 'mwaurajames@zetech.ac.ke',
      image: 'https://images.unsplash.com/photo-1718179804654-7c3720b78e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU2MDQ2OHww&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'James Mwaura serves as the User Research specialist for Hands and Hope, bringing a unique combination of technical knowledge and communication expertise. Currently pursuing dual degrees in Computer Software Engineering at Zetech University and Applied Communication at Multimedia University of Kenya, James is uniquely positioned to bridge the gap between technical development and user needs. His primary focus is ensuring that the platform is truly accessible to people with disabilities through comprehensive user testing, accessibility audits, and feedback sessions. James is deeply committed to inclusive design and works closely with users with disabilities to ensure the platform meets their needs and exceeds accessibility standards.',
      expertise: [
        'User Experience Research',
        'Accessibility Testing',
        'WCAG Compliance',
        'User Interviews & Feedback',
        'Screen Reader Testing',
        'Applied Communication',
        'Inclusive Design'
      ],
      achievements: [
        'Conducted extensive accessibility testing with disabled users',
        'Established accessibility standards for the platform',
        'Implemented comprehensive ARIA labels and keyboard navigation',
        'Created user testing protocols and feedback mechanisms',
        'Ensured WCAG 2.1 AA compliance across all features'
      ]
    },
    'ruth-gitau': {
      id: 'ruth-gitau',
      name: 'Ruth Gitau',
      role: 'Documentation & Reporting',
      responsibilities: [
        'Prepare for Demo Day and pitch presentations',
        'Draft business models, pitch decks, and demo materials',
        'Manage MVP goals and track validation/test results',
        'Create comprehensive project documentation',
        'Monitor and report on project milestones'
      ],
      education: [
        'Bachelor of Science in Education',
        'Jomo Kenyatta University of Agriculture and Technology (JKUAT)'
      ],
      contact: 'ruth.gitau@students.jkuat.ac.ke',
      image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUyNzg1MHww&ixlib=rb-4.1.0&q=80&w=1080',
      bio: 'Ruth Gitau is the Documentation & Reporting specialist for Hands and Hope, currently pursuing her Bachelor of Science in Education at JKUAT. With her strong background in education and communication, Ruth is responsible for translating the technical work of the team into clear, compelling narratives for stakeholders, investors, and the public. She manages all project documentation, creates pitch materials, and ensures that the team\'s progress is well-documented and communicated effectively. Ruth\'s educational background gives her unique insights into how to present complex information in accessible ways, making her invaluable in preparing for demonstrations and presentations. Her attention to detail and organizational skills ensure that the project stays aligned with its goals and milestones.',
      expertise: [
        'Technical Documentation',
        'Business Model Development',
        'Pitch Deck Creation',
        'Project Reporting',
        'Presentation Skills',
        'Educational Communication',
        'Goal Tracking & Analytics'
      ],
      achievements: [
        'Created comprehensive business model for Hands and Hope',
        'Developed compelling pitch materials for investors',
        'Established documentation standards and processes',
        'Successfully presented project at multiple stakeholder meetings',
        'Implemented MVP tracking and validation systems'
      ]
    }
  };

  const member = id ? teamMembersData[id] : null;

  if (!member) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
        <div className="flex-1">
          <Header isLoggedIn={isLoggedIn} currentUser={currentUser} onLogout={onLogout} />
          <main className="p-6">
            <div className="text-center">
              <h1 className="text-[#1e2875] mb-4">Team Member Not Found</h1>
              <Button onClick={() => navigate('/team')} className="bg-[#1e2875] hover:bg-[#2a3490]">
                Back to Team
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar selectedCategories={selectedCategories} onCategoryChange={setSelectedCategories} />
      
      <div className="flex-1">
        <Header 
          isLoggedIn={isLoggedIn} 
          currentUser={currentUser} 
          onLogout={onLogout}
          accessibilitySettings={accessibilitySettings}
          onAccessibilityChange={onAccessibilityChange}
        />

        <main id="main-content" className="p-6" role="main">
          <div className="max-w-5xl mx-auto">
            {/* Back Button */}
            <Button
              onClick={() => navigate('/team')}
              variant="outline"
              className="mb-6 border-[#1e2875] text-[#1e2875] hover:bg-[#1e2875] hover:text-white"
              aria-label="Back to team page"
            >
              <ArrowLeft size={20} className="mr-2" aria-hidden="true" />
              Back to Team
            </Button>

            {/* Profile Header Card */}
            <Card className="mb-8 border-2 border-[#1e2875] overflow-hidden">
              <div className="bg-gradient-to-r from-[#1e2875] to-[#2a3490] p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative">
                    <ImageWithFallback
                      src={member.image}
                      alt={`${member.name} - ${member.role}`}
                      className="w-48 h-48 rounded-full object-cover border-4 border-yellow-400 shadow-xl"
                    />
                  </div>
                  <div className="text-white text-center md:text-left flex-1">
                    <h1 className="text-white mb-2">{member.name}</h1>
                    <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                      <Briefcase size={24} aria-hidden="true" className="text-yellow-400" />
                      <p className="text-yellow-400">{member.role}</p>
                    </div>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <Mail size={20} aria-hidden="true" />
                      <a 
                        href={`mailto:${member.contact}`}
                        className="hover:text-yellow-400 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                        aria-label={`Email ${member.name}`}
                      >
                        {member.contact}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Biography Section */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-[#1e2875] mb-4 flex items-center gap-2">
                  <div className="bg-yellow-400 text-[#1e2875] rounded-full w-10 h-10 flex items-center justify-center">
                    <Briefcase size={20} aria-hidden="true" />
                  </div>
                  Biography
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Responsibilities */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-[#1e2875] mb-4 flex items-center gap-2">
                    <Target size={20} aria-hidden="true" className="text-yellow-400" />
                    Key Responsibilities
                  </h3>
                  <ul className="space-y-3" role="list">
                    {member.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-700">
                        <span className="text-yellow-400 mt-1">✓</span>
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Education */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-[#1e2875] mb-4 flex items-center gap-2">
                    <GraduationCap size={20} aria-hidden="true" className="text-yellow-400" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {member.education.map((edu, idx) => (
                      <p key={idx} className="text-gray-700 flex items-start gap-2">
                        <span className="text-yellow-400">•</span>
                        <span>{edu}</span>
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expertise Section */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-[#1e2875] mb-4 flex items-center gap-2">
                  <Award size={24} aria-hidden="true" className="text-yellow-400" />
                  Areas of Expertise
                </h2>
                <div className="flex flex-wrap gap-3">
                  {member.expertise.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-gradient-to-r from-[#1e2875] to-[#2a3490] text-white px-4 py-2 rounded-full shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Achievements Section */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <h2 className="text-[#1e2875] mb-4 flex items-center gap-2">
                  <Award size={24} aria-hidden="true" className="text-yellow-400" />
                  Key Achievements
                </h2>
                <ul className="space-y-3" role="list">
                  {member.achievements.map((achievement, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <div className="bg-yellow-400 text-[#1e2875] rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1">
                        {idx + 1}
                      </div>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Contact Card */}
            <Card className="bg-gradient-to-r from-[#1e2875] to-[#2a3490] text-white">
              <CardContent className="p-8 text-center">
                <h2 className="text-white mb-4">Get In Touch</h2>
                <p className="mb-6">
                  Have questions or want to learn more about {member.name.split(' ')[0]}'s work on Hands and Hope?
                </p>
                <Button
                  onClick={() => {
                    const subject = encodeURIComponent(`Inquiry about Hands and Hope - ${member.role}`);
                    const body = encodeURIComponent(`Hello ${member.name},\n\nI'm reaching out regarding your work on the Hands and Hope platform.\n\n`);
                    window.location.href = `mailto:${member.contact}?subject=${subject}&body=${body}`;
                  }}
                  className="bg-yellow-400 text-[#1e2875] hover:bg-yellow-500"
                  aria-label={`Email ${member.name}`}
                >
                  <Mail size={20} className="mr-2" aria-hidden="true" />
                  Send an Email
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}