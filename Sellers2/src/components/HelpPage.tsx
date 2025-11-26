import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { 
  HelpCircle, Book, Video, MessageCircle, Mail, Phone, 
  FileText, Users, CheckCircle, Search, Download
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface HelpPageProps {
  userRole: 'seller' | 'teacher' | 'student' | 'school';
  highContrast: boolean;
}

export function HelpPage({ userRole, highContrast }: HelpPageProps) {
  const teacherFAQs = [
    {
      question: "How do I approve a student's product listing?",
      answer: "Go to the 'Approvals' page from the sidebar. Under 'Product Listings', you'll see all pending products. Review the product details, image, and description. Click 'Approve Product' to publish it, or 'Reject Product' if it doesn't meet guidelines (you must provide a reason)."
    },
    {
      question: "How do I create an account for a student?",
      answer: "Navigate to the 'Students' page and click 'Add New Student'. Fill in the required information including name, email, student ID, and disability ID. The student will be automatically assigned to your school (Lincoln High School). Click 'Create Student Account' to finish."
    },
    {
      question: "What happens when I ban a student?",
      answer: "Banning a student deactivates their account and prevents them from selling products. You must provide a reason, which is logged and reported to the school. The student appears in the 'Banned Students' tab where you can also unban them if needed."
    },
    {
      question: "How can I help students who can't list products themselves?",
      answer: "Click on a student in the 'Students' page, expand their details, and click 'Assist with Product Placement'. You'll need the student's authorization, which is tracked with an authorization ID and reported to the school."
    },
    {
      question: "How do I view student income and sales?",
      answer: "Expand any student's details in the 'Students' page to see their total sales, products, and inquiries. This information is view-only - teachers cannot edit financial data."
    },
    {
      question: "Where can I see unresponded inquiries?",
      answer: "Unresponded inquiries are highlighted in red on the dashboard stats and in each student's detail view. Click on a student and select 'View Inquiries' to see all their inquiries."
    },
    {
      question: "What is the Activity Log for?",
      answer: "The Activity Log tracks all your actions including approvals, rejections, bans, and student account creations. This log is automatically reported to your school administration for transparency and compliance. You can export reports from this page."
    },
    {
      question: "How are students ranked?",
      answer: "Students are ranked by total sales on the 'Rankings' page. Top 3 performers get special badges (gold, silver, bronze). This helps recognize and motivate high-performing students."
    }
  ];

  const generalFAQs = [
    {
      question: "How do I use voice navigation?",
      answer: "Click the yellow accessibility button in the bottom-right corner. Toggle on 'Voice Navigation' and allow microphone access. You can then say commands like 'Go to dashboard', 'Go to students', 'Increase text size', etc."
    },
    {
      question: "What accessibility features are available?",
      answer: "We offer voice navigation, screen reader mode, high contrast mode, and adjustable text sizes (normal, large, extra-large). All features can be accessed from the accessibility panel."
    },
    {
      question: "How do I change my profile information?",
      answer: "Click on your profile picture in the top-right corner to go to your profile page. From there, you can edit your information and upload a new profile picture."
    },
    {
      question: "How do I export activity reports?",
      answer: "Go to the 'Activity Log' page and click the 'Export Activity Report' button at the bottom. This will download a report of all your tracked activities."
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1>Help & Support</h1>
        <p className={`mt-2 ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
          Find answers, guides, and get support
        </p>
      </div>

      {/* Quick Search */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search for help..." 
              className="h-14 pl-12 text-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md hover:shadow-lg transition-shadow cursor-pointer'}>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Book className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h3 className={highContrast ? 'text-white mb-2' : 'text-gray-900 mb-2'}>User Guides</h3>
            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Step-by-step tutorials and guides
            </p>
            <Button variant="link" className="mt-4">
              Browse Guides →
            </Button>
          </CardContent>
        </Card>

        <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md hover:shadow-lg transition-shadow cursor-pointer'}>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            <h3 className={highContrast ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Video Tutorials</h3>
            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Watch how-to videos and demos
            </p>
            <Button variant="link" className="mt-4">
              Watch Videos →
            </Button>
          </CardContent>
        </Card>

        <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-md hover:shadow-lg transition-shadow cursor-pointer'}>
          <CardContent className="p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <MessageCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h3 className={highContrast ? 'text-white mb-2' : 'text-gray-900 mb-2'}>Live Chat</h3>
            <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
              Chat with our support team
            </p>
            <Button variant="link" className="mt-4">
              Start Chat →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            {userRole === 'teacher' ? 'Teacher FAQs' : 'Frequently Asked Questions'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {(userRole === 'teacher' ? teacherFAQs : generalFAQs).map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className={highContrast ? 'text-gray-300' : 'text-gray-700'}>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* General FAQs for Teachers */}
      {userRole === 'teacher' && (
        <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              General FAQs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {generalFAQs.map((faq, index) => (
                <AccordionItem key={index} value={`general-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className={highContrast ? 'text-gray-300' : 'text-gray-700'}>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}

      {/* Contact Support */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className={`rounded-lg border p-6 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <Mail className="h-8 w-8 text-blue-600 mb-3" />
              <h4 className="font-semibold mb-2">Email Support</h4>
              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                Get help via email within 24 hours
              </p>
              <a href="mailto:support@handsandhope.com" className="text-blue-600 hover:underline">
                support@handsandhope.com
              </a>
            </div>

            <div className={`rounded-lg border p-6 ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <Phone className="h-8 w-8 text-green-600 mb-3" />
              <h4 className="font-semibold mb-2">Phone Support</h4>
              <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'} mb-3`}>
                Mon-Fri, 9AM-5PM EST
              </p>
              <a href="tel:1-800-HOPE-123" className="text-green-600 hover:underline">
                1-800-HOPE-123
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Send us a message</h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="support-name">Name</Label>
                <Input id="support-name" placeholder="Your name" className="h-12" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="support-email">Email</Label>
                <Input id="support-email" type="email" placeholder="your@email.com" className="h-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-subject">Subject</Label>
              <Input id="support-subject" placeholder="How can we help?" className="h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-message">Message</Label>
              <Textarea 
                id="support-message" 
                placeholder="Describe your issue or question..." 
                className="min-h-[150px]"
              />
            </div>
            <Button size="lg">
              <Mail className="h-5 w-5 mr-2" />
              Send Message
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card className={highContrast ? 'border-2 border-white bg-black' : 'shadow-lg'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resources & Downloads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-4 rounded-lg border ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Teacher User Guide (PDF)</h4>
                  <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Complete guide for teachers - 2.5 MB
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg border ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Accessibility Guidelines (PDF)</h4>
                  <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    How to use accessibility features - 1.8 MB
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-lg border ${highContrast ? 'border-white' : 'border-gray-200'}`}>
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-blue-600" />
                <div>
                  <h4 className="font-semibold">Student Management Quick Start</h4>
                  <p className={`text-sm ${highContrast ? 'text-gray-300' : 'text-gray-600'}`}>
                    Quick reference guide - 800 KB
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card className={highContrast ? 'border-2 border-purple-500 bg-black' : 'bg-purple-50 border-purple-200'}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Users className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">Join Our Community</h4>
              <p className="text-sm text-purple-800 mb-4">
                Connect with other teachers, share best practices, and learn from the community. Join our forum and monthly webinars.
              </p>
              <div className="flex gap-3">
                <Button variant="outline" size="sm">
                  Visit Forum
                </Button>
                <Button variant="outline" size="sm">
                  Upcoming Webinars
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
