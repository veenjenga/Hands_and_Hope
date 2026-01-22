import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { Card, CardContent } from './ui/card';
import { Mail, GraduationCap, Briefcase, Users as UsersIcon, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { AccessibilitySettings } from './AccessibilityMenu';

interface TeamPageProps {
  isLoggedIn: boolean;
  currentUser?: any;
  onLogout: () => void;
  accessibilitySettings?: AccessibilitySettings;
  onAccessibilityChange?: (settings: AccessibilitySettings) => void;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
  education: string[];
  contact: string;
  image: string;
}

export default function TeamPage({ isLoggedIn, currentUser, onLogout, accessibilitySettings, onAccessibilityChange }: TeamPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  const teamMembers: TeamMember[] = [
    {
      id: 'viona-njenga',
      name: 'Viona Njenga',
      role: 'Group Leader',
      responsibilities: [
        'Main point of contact with Innovate Now and external parties',
        'Communication and schedule coordination',
        'Submission of reports and feedback forms'
      ],
      education: [
        'Bachelor of Science in Computer Technology',
        'Jomo Kenyatta University of Agriculture and Technology (JKUAT)'
      ],
      contact: 'viona.njenga@students.jkuat.ac.ke',
      image: 'https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU5MTc1MXww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'ronaldo-cheruiyot',
      name: 'Ronaldo Cheruiyot',
      role: 'Product Development Lead',
      responsibilities: [
        'Oversee all technical planning and code coordination',
        'Assign and review development tasks',
        'Manage GitHub integration and technical progress'
      ],
      education: [
        'Bachelor of Science in Computer Technology',
        'KCA University, 4th Year'
      ],
      contact: 'ronaldokipkirui90@gmail.com',
      image: 'https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NjQ1NTA2MTR8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'james-mwaura',
      name: 'James Mwaura',
      role: 'User Research',
      responsibilities: [
        'Plan and conduct user interviews and accessibility feedback sessions',
        'Gather testing session data with users with disabilities',
        'Ensure accessibility standards (e.g., screen reader compatibility, font choice, contrast)'
      ],
      education: [
        'Diploma of Education, Computer Software Engineering',
        'Zetech University (Feb 2025 - Nov 2028)',
        'Bachelor of Applied Communication',
        'Multimedia University of Kenya (Aug 2023 - Nov 2027)'
      ],
      contact: 'mwaurajames@zetech.ac.ke',
      image: 'https://images.unsplash.com/photo-1718179804654-7c3720b78e67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDU2MDQ2OHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: 'ruth-gitau',
      name: 'Ruth Gitau',
      role: 'Documentation & Reporting',
      responsibilities: [
        'Prepare for Demo Day and pitch presentations',
        'Draft business models, pitch decks, and demo materials',
        'Manage MVP goals and track validation/test results'
      ],
      education: [
        'Bachelor of Science in Education',
        'Jomo Kenyatta University of Agriculture and Technology (JKUAT)'
      ],
      contact: 'ruth.gitau@students.jkuat.ac.ke',
      image: 'https://images.unsplash.com/photo-1581065178047-8ee15951ede6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBidXNpbmVzcyUyMHBvcnRyYWl0fGVufDF8fHx8MTc2NDUyNzg1MHww&ixlib=rb-4.1.0&q=80&w=1080'
    }
  ];

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
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="bg-[#1e2875] text-white rounded-full w-16 h-16 flex items-center justify-center">
                  <UsersIcon size={32} aria-hidden="true" />
                </div>
              </div>
              <h1 className="text-[#1e2875] mb-4">Meet The Team</h1>
              <p className="text-gray-700 max-w-3xl mx-auto">
                The dedicated team behind Hands and Hope, working together to create an inclusive 
                e-commerce platform that empowers people with disabilities.
              </p>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {teamMembers.map((member, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-xl transition-all duration-300 border-2 border-gray-200 hover:border-[#1e2875] cursor-pointer group"
                  role="article"
                  aria-label={`Team member: ${member.name}`}
                  onClick={() => navigate(`/team/${member.id}`)}
                  tabIndex={0}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      navigate(`/team/${member.id}`);
                    }
                  }}
                >
                  <CardContent className="p-8">
                    {/* Profile Photo */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <ImageWithFallback
                          src={member.image}
                          alt={`${member.name} - ${member.role}`}
                          className="w-32 h-32 rounded-full object-cover border-4 border-[#1e2875] group-hover:border-yellow-400 transition-all duration-300 shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-[#1e2875] rounded-full w-10 h-10 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                          <ArrowRight size={20} aria-hidden="true" />
                        </div>
                      </div>
                    </div>

                    {/* Member Header */}
                    <div className="mb-6 text-center">
                      <h2 className="text-[#1e2875] mb-2">{member.name}</h2>
                      <div className="flex items-center gap-2 justify-center">
                        <Briefcase size={18} aria-hidden="true" className="text-yellow-400" />
                        <p className="text-gray-600">{member.role}</p>
                      </div>
                    </div>

                    {/* Responsibilities Section */}
                    <div className="mb-6">
                      <h3 className="text-[#1e2875] mb-3 flex items-center gap-2">
                        <span className="bg-yellow-400 text-[#1e2875] rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          R
                        </span>
                        Responsibilities
                      </h3>
                      <ul className="space-y-2" role="list">
                        {member.responsibilities.map((resp, idx) => (
                          <li 
                            key={idx} 
                            className="flex items-start gap-2 text-gray-700"
                          >
                            <span className="text-yellow-400 mt-1">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Education Section */}
                    <div className="mb-6 bg-gray-50 rounded-lg p-4">
                      <h3 className="text-[#1e2875] mb-3 flex items-center gap-2">
                        <GraduationCap size={20} aria-hidden="true" className="text-yellow-400" />
                        Education
                      </h3>
                      <div className="space-y-1">
                        {member.education.map((edu, idx) => (
                          <p key={idx} className="text-gray-700">
                            {edu}
                          </p>
                        ))}
                      </div>
                    </div>

                    {/* Contact & View Profile */}
                    <div className="pt-4 border-t border-gray-200 space-y-3">
                      <div className="flex items-center gap-2 text-gray-600 hover:text-[#1e2875] transition-colors">
                        <Mail size={18} aria-hidden="true" />
                        <a 
                          href={`mailto:${member.contact}`}
                          className="hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                          aria-label={`Email ${member.name}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {member.contact}
                        </a>
                      </div>
                      <Button
                        className="w-full bg-[#1e2875] hover:bg-[#2a3490] text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/team/${member.id}`);
                        }}
                      >
                        View Full Profile
                        <ArrowRight size={18} className="ml-2" aria-hidden="true" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Team Overview Table */}
            <Card className="border-2 border-[#1e2875] overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-[#1e2875] text-white p-6">
                  <h2 className="text-white">Team Overview</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full" role="table" aria-label="Team members overview table">
                    <thead className="bg-gray-100">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-[#1e2875]">Name</th>
                        <th scope="col" className="px-6 py-4 text-left text-[#1e2875]">Role</th>
                        <th scope="col" className="px-6 py-4 text-left text-[#1e2875]">Institution</th>
                        <th scope="col" className="px-6 py-4 text-left text-[#1e2875]">Contact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700">Viona Njenga</td>
                        <td className="px-6 py-4 text-gray-700">Group Leader</td>
                        <td className="px-6 py-4 text-gray-700">JKUAT, BSc Computer Technology</td>
                        <td className="px-6 py-4">
                          <a 
                            href="mailto:viona.njenga@students.jkuat.ac.ke" 
                            className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                          >
                            viona.njenga@students.jkuat.ac.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700">Ronaldo Cheruiyot</td>
                        <td className="px-6 py-4 text-gray-700">Product Development</td>
                        <td className="px-6 py-4 text-gray-700">KCA University, 4th Year</td>
                        <td className="px-6 py-4">
                          <a 
                            href="mailto:ronaldokipkirui90@gmail.com" 
                            className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                          >
                            ronaldokipkirui90@gmail.com
                          </a>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700">James Mwaura</td>
                        <td className="px-6 py-4 text-gray-700">User Research</td>
                        <td className="px-6 py-4 text-gray-700">Zetech University, Multimedia Univ.</td>
                        <td className="px-6 py-4">
                          <a 
                            href="mailto:mwaurajames@zetech.ac.ke" 
                            className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                          >
                            mwaurajames@zetech.ac.ke
                          </a>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-gray-700">Ruth Gitau</td>
                        <td className="px-6 py-4 text-gray-700">Documentation/Reporting</td>
                        <td className="px-6 py-4 text-gray-700">JKUAT, BSc Education</td>
                        <td className="px-6 py-4">
                          <a 
                            href="mailto:ruth.gitau@students.jkuat.ac.ke" 
                            className="text-[#1e2875] hover:underline focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded"
                          >
                            ruth.gitau@students.jkuat.ac.ke
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Footer Section */}
            <div className="mt-12 text-center bg-gradient-to-r from-[#1e2875] to-[#2a3490] text-white rounded-lg p-8">
              <h2 className="text-white mb-3">Building Together</h2>
              <p className="max-w-2xl mx-auto leading-relaxed">
                Our diverse team brings together expertise in technology, education, research, and communication 
                to create an accessible platform that makes a real difference in people's lives.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}