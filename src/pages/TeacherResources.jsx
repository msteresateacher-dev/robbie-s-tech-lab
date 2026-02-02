import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  ArrowLeft, BookOpen, Lightbulb, Calendar, CheckCircle, 
  Users, Puzzle, Hand, Book, Scissors, MousePointer2,
  Keyboard, Monitor, Power, Lock, Heart, Binary, Network,
  Cable, MapPin, Sparkles, Download, Video, Mic, MicOff,
  Clock, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StandardsPDFGenerator from '@/components/StandardsPDFGenerator';

const WEEKLY_CURRICULUM = [
  {
    week: 1,
    title: "Introduction to Computers",
    theme: "What is a Computer?",
    games: ["Screen World", "Parts Puzzle", "Power On/Off"],
    nysStandards: ["PreK.IC.1", "PreK.IC.3", "PreK.NSD.2", "PreK.DL.1"],
    lowTech: [
      "Use cardboard boxes to build a 'pretend computer'",
      "Create a Robbie puppet for storytelling",
      "Bring real keyboard, mouse, and monitor to touch",
      "Read books about computers and robots"
    ],
    activities: [
      "Circle time: Show real computer parts",
      "Story: 'Robbie Wakes Up' introduction",
      "Hands-on: Let children touch and explore real keyboard",
      "Game time: Screen World (15 min max)"
    ],
    tips: "Keep sessions short (15-20 min). Focus on vocabulary: computer, screen, keyboard, mouse."
  },
  {
    week: 2,
    title: "Input & Output Basics",
    theme: "How We Talk to Computers",
    games: ["Mouse Skills", "Keyboard Fun", "Touch vs Type"],
    nysStandards: ["PreK.NSD.1", "PreK.DL.1", "PreK.CT.5"],
    lowTech: [
      "Use toy phone to explain 'touch' input",
      "Create large floor keyboard with tape/paper",
      "Play 'Simon Says' with keyboard commands",
      "Make paper mouse that children move around"
    ],
    activities: [
      "Demo: Teacher types and shows output on screen",
      "Activity: Children press real keyboard keys",
      "Movement: 'Keyboard Dance' - call out keys, kids jump to them",
      "Game time: Mouse Skills practice"
    ],
    tips: "Celebrate every click and keypress! Build motor skills confidence first."
  },
  {
    week: 3,
    title: "Staying Safe Online",
    theme: "Being Kind & Safe",
    games: ["Password Protector", "Be Kind", "Screen Time Helper"],
    nysStandards: ["PreK.IC.2", "PreK.IC.4", "PreK.CY.1", "PreK.CY.2", "PreK.DL.5"],
    lowTech: [
      "Use colored blocks as 'password patterns'",
      "Create emotion cards for kindness scenarios",
      "Use sand timer to show screen time breaks",
      "Role-play with puppets: nice vs not-nice words"
    ],
    activities: [
      "Story: 'Robbie Keeps Secrets Safe'",
      "Practice: Create patterns with blocks (passwords)",
      "Discussion: What makes a good friend online?",
      "Timer activity: Set 5-min timer for play, then break"
    ],
    tips: "Use simple language. Connect digital concepts to real-world social skills."
  },
  {
    week: 4,
    title: "How Computers Think",
    theme: "Binary, Data & Sorting",
    games: ["Binary Lights", "Data Detective", "Sorting Hat"],
    nysStandards: ["PreK.CT.1", "PreK.CT.2", "PreK.CT.3"],
    lowTech: [
      "Use flashlights for ON/OFF (binary)",
      "Sort real objects by color, size, shape",
      "Use light switches to demonstrate binary",
      "Create sorting bins with pictures"
    ],
    activities: [
      "Demo: Lights ON (1) and OFF (0) with flashlights",
      "Sorting center: Let children sort toys by category",
      "Pattern making: Create binary patterns with blocks",
      "Game time: Binary Lights and Data Detective"
    ],
    tips: "Don't worry about the word 'binary' - focus on ON/OFF patterns. Make it playful!"
  },
  {
    week: 5,
    title: "Connections & Communication",
    theme: "How Computers Connect",
    games: ["Cables", "Network Navigator", "Signal Share"],
    nysStandards: ["PreK.NSD.4", "PreK.NSD.5", "PreK.DL.2"],
    lowTech: [
      "Use yarn/rope to show 'connections' between kids",
      "Create obstacle course for 'data traveling'",
      "String phone (cups + string) for messages",
      "Real cables for children to match and plug in"
    ],
    activities: [
      "Demo: Show real USB cables, charging cables",
      "Activity: 'Human Network' - pass message person-to-person",
      "Matching: Let children connect real cables to devices",
      "Game time: Network and Cables games"
    ],
    tips: "Use their experience with phone charging, TV cables. Make it tangible!"
  },
  {
    week: 6,
    title: "Brooklyn Tech Heroes",
    theme: "Computers Help Our Community",
    games: ["Helper Bot", "Weather Reporter", "Photo Memory"],
    nysStandards: ["PreK.CT.4", "PreK.DL.3", "PreK.DL.4"],
    lowTech: [
      "Take neighborhood walk with pretend cameras",
      "Create weather chart for classroom",
      "Make Brooklyn landmark art projects",
      "Interview community helpers about tech use"
    ],
    activities: [
      "Field trip: Visit school library/office to see computers in use",
      "Project: Create Brooklyn photo collage",
      "Weather: Check real Harlem weather together",
      "Celebration: 'Tech Fair' showing what they learned"
    ],
    tips: "End with celebration! Show parents what children learned. Share student progress."
  }
];

const LOW_TECH_TOOLS = [
  { category: "Puppets & Props", items: ["Robbie puppet for storytelling", "Felt board computer parts", "Cardboard box 'computer'", "Stuffed animal 'students'"] },
  { category: "Manipulatives", items: ["Real keyboard to touch", "Unplugged mouse", "Colored blocks for patterns", "Flashlights for binary"] },
  { category: "Books & Stories", items: ["Books about computers", "Homemade Robbie stories", "Picture cards of tech", "Social stories about screens"] },
  { category: "Movement", items: ["Floor keyboard (tape)", "Keyboard dance mat", "Simon Says tech edition", "Human network game"] },
  { category: "Art & Craft", items: ["Draw computers", "Build robots with boxes", "Create cable matching games", "Brooklyn photo projects"] },
  { category: "Sensory", items: ["Sand timers for screen time", "Touch real keyboards", "Feel different cables", "Light/dark switches"] }
];

const TEACHING_STRATEGIES = [
  { title: "Keep It Short", description: "15-20 min max per session. Preschoolers need movement!", icon: <Calendar /> },
  { title: "Hands-On First", description: "Let them touch real keyboards, mice before using app", icon: <Hand /> },
  { title: "Connect to Real Life", description: "Link digital concepts to their daily experiences", icon: <Users /> },
  { title: "Use Robbie's Voice", description: "Make Robbie a classroom friend, use puppet for teaching", icon: <Sparkles /> },
  { title: "Celebrate Progress", description: "Track missions completed, praise motor skill development", icon: <CheckCircle /> },
  { title: "Balance Screen Time", description: "1 digital game = 2 low-tech activities. Always balance!", icon: <Monitor /> }
];

const NYS_STANDARDS_PRESCHOOL = {
  "Impacts of Computing": [
    { code: "PreK.IC.1", standard: "Notice and identify when technology is being used (toys, tablets, computers)", games: ["Screen World", "Parts Puzzle", "Power On/Off"] },
    { code: "PreK.IC.2", standard: "Follow simple classroom rules about using devices (taking turns, being gentle)", games: ["Be Kind", "Screen Time Helper"] },
    { code: "PreK.IC.3", standard: "Point to and name technology in the classroom and home", games: ["Parts Puzzle", "Touch vs Type"] },
    { code: "PreK.IC.4", standard: "Identify what is okay to share with friends vs keep private", games: ["Password Protector", "Be Kind"] }
  ],
  "Computational Thinking": [
    { code: "PreK.CT.1", standard: "Notice simple patterns (colors, sounds, shapes) and predict what comes next", games: ["Binary Lights", "Data Detective", "Password Protector"] },
    { code: "PreK.CT.2", standard: "Identify things we can count and sort (toys, colors, sizes)", games: ["Data Detective", "Sorting Hat"] },
    { code: "PreK.CT.3", standard: "Put information into groups and show it (blocks, pictures)", games: ["Sorting Hat", "Photo Memory"] },
    { code: "PreK.CT.4", standard: "Break a big job into little steps (getting dressed, cleaning up)", games: ["Wake Up Robbie", "Helper Bot"] },
    { code: "PreK.CT.5", standard: "Follow simple directions with 2-3 steps", games: ["Wake Up Robbie", "Robbie's Race"] },
    { code: "PreK.CT.6", standard: "Do tasks in order (first, next, last)", games: ["Wake Up Robbie", "Music Code"] },
    { code: "PreK.CT.7", standard: "Notice when we do the same thing over and over", games: ["Broken Record", "Dance Party"] }
  ],
  "Networks & System Design": [
    { code: "PreK.NSD.1", standard: "Touch, click, or press to make computers do things", games: ["Mouse Skills", "Keyboard Fun", "Input & Output"] },
    { code: "PreK.NSD.2", standard: "Point to parts of a computer (screen, keyboard, mouse)", games: ["Hardware Anatomy", "Parts Puzzle"] },
    { code: "PreK.NSD.3", standard: "Ask for help when technology isn't working", games: ["Bug Hunter", "Power On/Off"] },
    { code: "PreK.NSD.4", standard: "Understand that messages travel from one place to another", games: ["Network Navigator", "Signal Share"] },
    { code: "PreK.NSD.5", standard: "Know that computers and tablets can save pictures and information", games: ["Photo Memory"] }
  ],
  "Cybersecurity": [
    { code: "PreK.CY.1", standard: "Know that some things are private (passwords, addresses)", games: ["Password Protector"] },
    { code: "PreK.CY.2", standard: "Understand that passwords keep things safe", games: ["Password Protector"] },
    { code: "PreK.CY.3", standard: "Ask a grown-up before clicking on new things", games: ["Be Kind"] }
  ],
  "Digital Literacy": [
    { code: "PreK.DL.1", standard: "Explore and press keys on a keyboard (space, enter, delete)", games: ["Keyboard Fun", "Letter Hunt"] },
    { code: "PreK.DL.2", standard: "Share ideas using technology with teacher help", games: ["Photo Memory", "Music Code"] },
    { code: "PreK.DL.3", standard: "Understand that computers can help us find information", games: ["Weather Reporter"] },
    { code: "PreK.DL.4", standard: "Make something using a computer or tablet", games: ["Pixel Painter", "Photo Memory"] },
    { code: "PreK.DL.5", standard: "Be kind and helpful when using technology", games: ["Be Kind", "Helper Bot"] }
  ]
};

export default function TeacherResources() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedStandard, setSelectedStandard] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-pink-50 to-orange-50 pb-12">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={createPageUrl('TeacherDashboard')}>
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">Teacher Resource Center</h1>
            <p className="text-sm text-gray-500">6-Week Computer Course Guide</p>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <main className="px-4 pt-6 max-w-6xl mx-auto">
        {/* Introduction Card */}
        <Card className="mb-8 bg-gradient-to-r from-fuchsia-100 to-pink-100 border-fuchsia-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <BookOpen className="w-8 h-8 text-fuchsia-600" />
              How to Use Robbie's Tech Lab
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-white/80 p-6 rounded-2xl">
              <h3 className="font-bold text-lg mb-3 text-gray-800">For Educators:</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Hybrid Learning:</strong> Combine digital missions with hands-on activities (puppets, real keyboards, movement games)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Student Portal:</strong> Each child gets their own profile - track their progress, missions completed, and areas of struggle</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Short Sessions:</strong> Keep digital time to 15-20 minutes, surrounded by 30+ minutes of low-tech activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Differentiation:</strong> Some students excel with mouse skills, others with concepts - celebrate all growth!</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Parent Communication:</strong> Share progress from Teacher Dashboard, explain what children are learning</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* NYS Standards Overview */}
        <Card className="mb-8 bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-200">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  NYS Computer Science & Digital Fluency Standards (PreK Adapted)
                </CardTitle>
                <p className="text-gray-700 mt-2">
                  Aligned with New York State Education Department K-12 Computer Science Standards, developmentally adapted for ages 3-5
                </p>
              </div>
              <StandardsPDFGenerator />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(NYS_STANDARDS_PRESCHOOL).map(([area, standards]) => (
                <div key={area} className="bg-white p-5 rounded-2xl shadow-sm">
                  <h4 className="font-bold text-lg mb-3 text-blue-900">{area}</h4>
                  <p className="text-sm text-gray-600 mb-2">{standards.length} PreK Standards</p>
                  <button 
                    onClick={() => setSelectedStandard(area)}
                    className="text-blue-600 text-sm font-semibold hover:underline"
                  >
                    View Details →
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Anti-Bullying & Digital Kindness Section */}
        <Card className="mb-8 bg-gradient-to-r from-pink-100 to-rose-100 border-pink-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Heart className="w-8 h-8 text-pink-600" />
              Anti-Bullying & Digital Kindness for Young Learners
            </CardTitle>
            <p className="text-gray-700 mt-2">
              Teaching preschoolers about kindness online and the harm of negative comments
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Understanding Mean Comments */}
            <div className="bg-white p-6 rounded-2xl border-2 border-pink-200">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-pink-900">
                <AlertCircle className="w-6 h-6 text-pink-600" />
                What Are Mean Comments? (Ages 3-5)
              </h3>
              <div className="space-y-3 text-gray-700">
                <p className="font-semibold">Help children understand:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold mt-1">•</span>
                    <span><strong>Mean comments are words that hurt feelings</strong> - just like in real life, words on screens can make us sad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold mt-1">•</span>
                    <span><strong>Examples for preschoolers:</strong> "You're not my friend," "That's ugly," "Go away," or ignoring someone on purpose</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold mt-1">•</span>
                    <span><strong>Online vs In-Person:</strong> Mean words hurt the same whether we say them face-to-face or on a screen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold mt-1">•</span>
                    <span><strong>Simple rule:</strong> "If it makes you feel sad, it's not okay to say to others"</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* How Negative Comments Hurt */}
            <div className="bg-white p-6 rounded-2xl border-2 border-rose-200">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-rose-900">
                <Heart className="w-6 h-6 text-rose-600" />
                Why Mean Comments Hurt
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-rose-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">😢 Feelings Get Hurt</h4>
                  <p className="text-sm text-gray-700">Mean words make our hearts feel sad and heavy. Even on a computer, words can make us cry.</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">😔 Friends Feel Left Out</h4>
                  <p className="text-sm text-gray-700">When we say mean things or leave someone out online, they feel lonely and sad.</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">😰 Some Kids Get Scared</h4>
                  <p className="text-sm text-gray-700">Mean comments can make children feel afraid to use computers or play with friends.</p>
                </div>
                <div className="bg-rose-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2">💔 It's Hard to Forget</h4>
                  <p className="text-sm text-gray-700">Unlike spoken words, mean things written online stay there. We can see them again and again.</p>
                </div>
              </div>
            </div>

            {/* Being a Kind Digital Friend */}
            <div className="bg-white p-6 rounded-2xl border-2 border-green-200">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-green-900">
                <CheckCircle className="w-6 h-6 text-green-600" />
                How to Be a Kind Digital Friend
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                  <span className="text-3xl">😊</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Use Nice Words</h4>
                    <p className="text-sm text-gray-700">Say things like "Great job!", "I like your picture!", "You're a good friend!"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                  <span className="text-3xl">🤝</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Include Everyone</h4>
                    <p className="text-sm text-gray-700">If we're playing an online game, invite everyone to join. No leaving friends out.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                  <span className="text-3xl">🛑</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Think Before We Type</h4>
                    <p className="text-sm text-gray-700">Before sending a message, ask: "Would this make me happy if someone said it to me?"</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                  <span className="text-3xl">💪</span>
                  <div>
                    <h4 className="font-bold text-gray-800">Stand Up for Friends</h4>
                    <p className="text-sm text-gray-700">If we see someone being mean online, we can tell a grown-up and be kind to the friend who got hurt.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* What to Do If You Experience It */}
            <div className="bg-white p-6 rounded-2xl border-2 border-orange-200">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-orange-900">
                <Users className="w-6 h-6 text-orange-600" />
                What to Do If Someone Is Mean Online
              </h3>
              <div className="space-y-3">
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    Tell a Grown-Up Right Away
                  </h4>
                  <p className="text-sm text-gray-700 ml-8">Tell your teacher, parent, or another trusted adult. They can help make it stop.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    Don't Respond with Mean Words Back
                  </h4>
                  <p className="text-sm text-gray-700 ml-8">Being mean back doesn't help. Walk away from the screen and get help from an adult.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    Remember: It's Not Your Fault
                  </h4>
                  <p className="text-sm text-gray-700 ml-8">If someone is mean to you, it's not because of anything you did. You deserve to be treated with kindness.</p>
                </div>
                <div className="bg-orange-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    Take a Break from Screens
                  </h4>
                  <p className="text-sm text-gray-700 ml-8">It's okay to take a break and do something fun offline - play outside, read a book, or draw.</p>
                </div>
              </div>
            </div>

            {/* Teacher Strategies */}
            <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2 text-blue-900">
                <BookOpen className="w-6 h-6 text-blue-600" />
                Teaching Strategies for Educators
              </h3>
              <div className="space-y-3 text-gray-700">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Use "Be Kind" Game in Robbie's Lab</h4>
                    <p className="text-sm">The app includes a kindness game - use it to practice identifying kind vs unkind scenarios in a safe way.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Role-Play with Robbie Puppet</h4>
                    <p className="text-sm">Use the Robbie puppet to act out scenarios where someone receives a mean comment - discuss how it feels and what to do.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Create a "Kind Words" Wall</h4>
                    <p className="text-sm">Post examples of kind comments children can use online and offline. Practice them daily.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Monitor Digital Interactions Closely</h4>
                    <p className="text-sm">At this age, all online activity should be supervised. Watch for negative comments and address them immediately.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Connect to Real-Life Kindness</h4>
                    <p className="text-sm">Link digital kindness to classroom behavior. "We use kind words with our friends AND on screens."</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold mb-1">Parent Communication</h4>
                    <p className="text-sm">Share this anti-bullying guidance with families so they can reinforce the same messages at home.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Lessons */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
              <h3 className="font-bold text-xl mb-4 text-purple-900">5-Minute Mini Lessons</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-xl">
                  <h4 className="font-bold text-purple-700 mb-2">📖 Story Time</h4>
                  <p className="text-sm text-gray-700">"Robbie Gets a Mean Message" - Create a story where Robbie receives a mean comment, feels sad, tells a teacher, and learns about kindness.</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <h4 className="font-bold text-purple-700 mb-2">🎭 Act It Out</h4>
                  <p className="text-sm text-gray-700">Have students act out receiving a nice comment vs a mean comment. Notice the different feelings.</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <h4 className="font-bold text-purple-700 mb-2">🎨 Draw Feelings</h4>
                  <p className="text-sm text-gray-700">Draw faces showing how mean comments make us feel vs how kind comments make us feel.</p>
                </div>
                <div className="bg-white p-4 rounded-xl">
                  <h4 className="font-bold text-purple-700 mb-2">🗣️ Practice Kind Comments</h4>
                  <p className="text-sm text-gray-700">Go around the circle - each child says one kind thing to the person next to them. Celebrate positive words!</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Standards Detail Modal */}
        {selectedStandard && (
          <Card className="mb-8 border-4 border-blue-400">
            <CardHeader className="bg-blue-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-blue-900">{selectedStandard}</CardTitle>
                <button 
                  onClick={() => setSelectedStandard(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {NYS_STANDARDS_PRESCHOOL[selectedStandard].map((std) => (
                  <div key={std.code} className="bg-blue-50 p-5 rounded-xl border-2 border-blue-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold flex-shrink-0">
                        {std.code}
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-semibold mb-3">{std.standard}</p>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-xs text-gray-600 font-semibold">Related Games:</span>
                          {std.games.map((game, i) => (
                            <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-blue-700 font-medium border border-blue-200">
                              {game}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="curriculum" className="mb-8">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="standards">NYS Standards</TabsTrigger>
            <TabsTrigger value="curriculum">6-Week Plan</TabsTrigger>
            <TabsTrigger value="lowtech">Low-Tech Tools</TabsTrigger>
            <TabsTrigger value="strategies">Teaching Tips</TabsTrigger>
          </TabsList>

          {/* NYS Standards Tab */}
          <TabsContent value="standards">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                  How Robbie's Lab Meets NYS Standards
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Every game and mission is designed to meet specific PreK-adapted NYS Computer Science & Digital Fluency Standards
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(NYS_STANDARDS_PRESCHOOL).map(([area, standards]) => (
                  <div key={area}>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-200">
                      {area}
                    </h3>
                    <div className="grid gap-3">
                      {standards.map((std) => (
                        <div key={std.code} className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                          <div className="flex items-start gap-3">
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold flex-shrink-0 mt-1">
                              {std.code}
                            </span>
                            <div className="flex-1">
                              <p className="text-gray-800 mb-2 font-medium">{std.standard}</p>
                              <div className="flex flex-wrap gap-1.5">
                                {std.games.map((game, i) => (
                                  <span key={i} className="bg-white px-2 py-0.5 rounded-full text-xs text-blue-700 font-semibold border border-blue-300">
                                    {game}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="bg-green-50 border-2 border-green-300 p-6 rounded-2xl mt-8">
                  <h3 className="font-bold text-xl text-green-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-6 h-6" />
                    Developmentally Appropriate for Ages 3-5
                  </h3>
                  <p className="text-gray-700 mb-3">
                    These PreK standards are adapted from NYS K-1 standards to be appropriate for preschoolers:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Concrete over Abstract:</strong> Focus on touching, seeing, and doing rather than theoretical concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Simplified Language:</strong> "Put things in groups" instead of "data organization and visualization"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Teacher Guided:</strong> All activities assume adult support and scaffolding</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Play-Based:</strong> Learning through games, songs, movement, and hands-on exploration</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Curriculum Tab */}
          <TabsContent value="curriculum" className="space-y-6">
            <div className="grid md:grid-cols-6 gap-3 mb-6">
              {WEEKLY_CURRICULUM.map((week) => (
                <button
                  key={week.week}
                  onClick={() => setSelectedWeek(week.week)}
                  className={`p-4 rounded-2xl font-bold transition-all ${
                    selectedWeek === week.week
                      ? 'bg-fuchsia-500 text-white shadow-lg scale-105'
                      : 'bg-white text-gray-600 hover:bg-fuchsia-50'
                  }`}
                >
                  Week {week.week}
                </button>
              ))}
            </div>

            {WEEKLY_CURRICULUM.filter(w => w.week === selectedWeek).map((week) => (
              <Card key={week.week} className="border-fuchsia-200">
                <CardHeader className="bg-gradient-to-r from-fuchsia-50 to-pink-50">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-fuchsia-500 text-white px-4 py-2 rounded-full font-black">
                      Week {week.week}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{week.title}</CardTitle>
                      <p className="text-gray-600 font-semibold mt-1">Theme: {week.theme}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  {/* NYS Standards */}
                  <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-200">
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2 text-blue-900">
                      <CheckCircle className="w-5 h-5 text-blue-600" />
                      NYS Standards Addressed:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {week.nysStandards.map((code, i) => (
                        <span key={i} className="bg-blue-600 text-white px-3 py-1 rounded-lg font-bold text-sm">
                          {code}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Digital Games */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-fuchsia-600" />
                      Digital Games This Week:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {week.games.map((game, i) => (
                        <span key={i} className="bg-fuchsia-100 text-fuchsia-700 px-4 py-2 rounded-full font-semibold">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Low-Tech Activities */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Puzzle className="w-5 h-5 text-orange-600" />
                      Low-Tech Materials Needed:
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-2">
                      {week.lowTech.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 bg-orange-50 p-3 rounded-xl">
                          <Scissors className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Daily Activities */}
                  <div>
                    <h4 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      Sample Daily Activities:
                    </h4>
                    <div className="space-y-2">
                      {week.activities.map((activity, i) => (
                        <div key={i} className="flex items-start gap-3 bg-green-50 p-4 rounded-xl">
                          <div className="bg-green-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                            {i + 1}
                          </div>
                          <p className="text-gray-700">{activity}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Teaching Tips */}
                  <div className="bg-yellow-50 border-2 border-yellow-200 p-5 rounded-2xl">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-bold text-yellow-900 mb-2">Teaching Tips:</h4>
                        <p className="text-gray-700">{week.tips}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Low-Tech Tools Tab */}
          <TabsContent value="lowtech">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Puzzle className="w-7 h-7 text-orange-600" />
                  Low-Tech Tools to Teach High-Tech Concepts
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Physical materials help preschoolers understand abstract digital concepts. Use these tools before, during, and after digital lessons!
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {LOW_TECH_TOOLS.map((category, i) => (
                    <div key={i} className="bg-gradient-to-br from-orange-50 to-pink-50 p-6 rounded-2xl border-2 border-orange-200">
                      <h3 className="font-bold text-xl mb-4 text-orange-900">{category.category}</h3>
                      <ul className="space-y-2">
                        {category.items.map((item, j) => (
                          <li key={j} className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-orange-600 mt-1 flex-shrink-0" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl">
                  <h3 className="font-bold text-lg mb-3 text-blue-900">Why Low-Tech Matters:</h3>
                  <p className="text-gray-700 mb-3">
                    Preschoolers learn best through <strong>hands-on, multi-sensory experiences</strong>. Before they click a digital mouse, let them hold a real one. Before they learn about binary, let them flip light switches. The physical world makes the digital world make sense!
                  </p>
                  <p className="text-gray-700 font-semibold">
                    📌 Rule of Thumb: For every 15 minutes of screen time, plan 30+ minutes of related hands-on activities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teaching Strategies Tab */}
          <TabsContent value="strategies">
            {/* Zoom & Video Call Guidance */}
            <Card className="mb-8 bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Video className="w-8 h-8 text-indigo-600" />
                  Zoom & Video Call Guidance for Preschoolers
                </CardTitle>
                <p className="text-gray-700 mt-2">
                  Essential digital safety and skills for virtual learning
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Screen Time Guidelines */}
                <div className="bg-white p-6 rounded-2xl border-2 border-indigo-200">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-indigo-900">
                    <Clock className="w-6 h-6 text-indigo-600" />
                    Recommended Screen Time for Ages 3-5
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Total Daily Maximum: 60-90 minutes</strong>
                        <p className="text-gray-600 text-sm mt-1">Include all screens: educational apps, TV, video calls</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Zoom Sessions: 15-20 minutes maximum</strong>
                        <p className="text-gray-600 text-sm mt-1">Take a 5-minute movement break every 15 minutes</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Robbie's Lab: 15-20 minutes per session</strong>
                        <p className="text-gray-600 text-sm mt-1">1-2 missions per day, balanced with 30+ minutes of hands-on activities</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <strong className="text-gray-800">Break Schedule: Every 15-20 minutes</strong>
                        <p className="text-gray-600 text-sm mt-1">Stand up, stretch, jump, dance - get their bodies moving!</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zoom Skills to Teach */}
                <div className="bg-white p-6 rounded-2xl border-2 border-blue-200">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-blue-900">
                    <Mic className="w-6 h-6 text-blue-600" />
                    Essential Zoom Skills for Preschoolers
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-600 text-white p-2 rounded-lg">
                          <Mic className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-800">Mute/Unmute</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Practice: "Red button = quiet, Green button = talk"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Use visual cues: hand signals for mute/unmute</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-600 font-bold">•</span>
                          <span>Reminder: "Check your button before you talk!"</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-green-600 text-white p-2 rounded-lg">
                          <Hand className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-800">Raise Hand/Reactions</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>Show them the "Raise Hand" button for questions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>Teach 👍 and ❤️ reactions for positive feedback</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <span>Practice: "Show me a thumbs up if you can see Robbie!"</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-purple-600 text-white p-2 rounded-lg">
                          <Video className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-800">Camera On/Off</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Teacher decides when camera should be on/off</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Teach: "Camera shows your face to friends"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-purple-600 font-bold">•</span>
                          <span>Privacy tip: Blur background or virtual background</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-orange-50 p-4 rounded-xl">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-orange-600 text-white p-2 rounded-lg">
                          <Users className="w-5 h-5" />
                        </div>
                        <h4 className="font-bold text-gray-800">Breakout Rooms</h4>
                      </div>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>Explain: "Like moving to a small group table"</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>Show "Join" button - click when you see it</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold">•</span>
                          <span>Teach: "Ask for Help" button if confused</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Digital Safety Practices */}
                <div className="bg-white p-6 rounded-2xl border-2 border-red-200">
                  <h3 className="font-bold text-xl mb-4 flex items-center gap-3 text-red-900">
                    <Shield className="w-6 h-6 text-red-600" />
                    Digital Safety Best Practices
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-red-50 p-4 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-red-600" />
                        Password & Login Safety
                      </h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                          <span><strong>Never share passwords</strong> - even with friends. Passwords are like secrets we keep safe.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                          <span><strong>Adult helps with login</strong> - Teacher or parent enters Zoom passwords, not students.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                          <span><strong>Don't write passwords down</strong> where others can see them.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                          <span><strong>Use the Password Protector game</strong> to practice pattern-based "passwords" safely.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2">What's Private? What's Okay to Share?</h4>
                      <div className="grid md:grid-cols-2 gap-4 mt-3">
                        <div>
                          <p className="font-bold text-red-700 mb-2">❌ Keep Private (Don't Share on Zoom):</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Home address or apartment number</li>
                            <li>• Phone number</li>
                            <li>• Where you are right now</li>
                            <li>• Parents' work information</li>
                            <li>• Passwords or login information</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-bold text-green-700 mb-2">✅ Okay to Share:</p>
                          <ul className="text-sm text-gray-700 space-y-1">
                            <li>• Your first name</li>
                            <li>• What you're learning in school</li>
                            <li>• Your favorite color or toy</li>
                            <li>• How you're feeling (happy, sad)</li>
                            <li>• Things you made or drew</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2">Before Clicking Anything:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span><strong>Ask a grown-up first!</strong> Never click links sent in Zoom chat without teacher permission.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span><strong>Stay in the Zoom meeting</strong> - Don't leave unless teacher says it's okay.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span><strong>If something feels wrong</strong> - Tell a grown-up immediately. It's always okay to ask for help!</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-green-50 p-4 rounded-xl">
                      <h4 className="font-bold text-gray-800 mb-2">Good Digital Citizenship:</h4>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span><strong>Be kind online</strong> - Same rules as in-person: use nice words, take turns talking.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span><strong>Listen when others talk</strong> - Mute yourself and pay attention.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span><strong>Share the screen time</strong> - Everyone gets a turn to participate.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Heart className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span><strong>Respect others' homes</strong> - Don't make comments about what you see in backgrounds.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Teacher Tips for Virtual Learning */}
                <div className="bg-indigo-50 p-6 rounded-2xl border-2 border-indigo-300">
                  <h3 className="font-bold text-lg mb-3 text-indigo-900">Teacher Tips for Virtual Learning Success:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Practice sessions:</strong> Do a "Zoom practice" week before starting curriculum - learn buttons in a playful way.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Visual reminders:</strong> Create picture cards showing Zoom buttons and their meanings - display during calls.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Co-viewing recommended:</strong> Have parents/caregivers nearby during Zoom sessions for preschoolers.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Use waiting room feature:</strong> Admit students one at a time, greet them personally, check their setup.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                      <span><strong>Movement breaks are essential:</strong> Every 10-15 minutes, do a stretch, dance, or "find something blue in your room!"</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {TEACHING_STRATEGIES.map((strategy, i) => (
                <Card key={i} className="border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center gap-3">
                      {strategy.icon}
                      {strategy.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <p className="text-gray-700">{strategy.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-2xl">Sample Daily Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="bg-white p-4 rounded-xl border-2 border-green-200">
                    <strong className="text-green-700">Morning (10:00-10:30) - Tech Time</strong>
                    <ul className="ml-6 mt-2 space-y-1 text-gray-700">
                      <li>• Circle: Introduce today's concept with Robbie puppet (5 min)</li>
                      <li>• Hands-on: Touch real tech materials (5 min)</li>
                      <li>• Digital: Students rotate through 1-2 missions (15 min)</li>
                      <li>• Debrief: What did Robbie teach us? (5 min)</li>
                    </ul>
                  </div>
                  <div className="bg-white p-4 rounded-xl border-2 border-blue-200">
                    <strong className="text-blue-700">Afternoon (2:00-2:30) - Hands-On Extension</strong>
                    <ul className="ml-6 mt-2 space-y-1 text-gray-700">
                      <li>• Low-tech activity related to morning lesson</li>
                      <li>• Art project, movement game, or building challenge</li>
                      <li>• Small group work with teacher support</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Reference Card */}
        <Card className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white">
          <CardContent className="pt-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
              <Sparkles className="w-7 h-7" />
              Quick Game Progression Guide
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur p-4 rounded-xl">
                <h4 className="font-bold mb-2">Weeks 1-2: Basics</h4>
                <p>Screen World → Parts Puzzle → Mouse Skills → Keyboard Fun</p>
              </div>
              <div className="bg-white/20 backdrop-blur p-4 rounded-xl">
                <h4 className="font-bold mb-2">Weeks 3-4: Safety & Logic</h4>
                <p>Password → Be Kind → Screen Time → Binary → Data Detective</p>
              </div>
              <div className="bg-white/20 backdrop-blur p-4 rounded-xl">
                <h4 className="font-bold mb-2">Weeks 5-6: Connections</h4>
                <p>Cables → Network → Brooklyn Helper → Weather → Photo Memory</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}