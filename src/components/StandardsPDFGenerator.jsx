import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

const NYS_STANDARDS_PRESCHOOL = {
  "Impacts of Computing": [
    { code: "PreK.IC.1", standard: "Notice and identify when technology is being used (toys, tablets, computers)" },
    { code: "PreK.IC.2", standard: "Follow simple classroom rules about using devices (taking turns, being gentle)" },
    { code: "PreK.IC.3", standard: "Point to and name technology in the classroom and home" },
    { code: "PreK.IC.4", standard: "Identify what is okay to share with friends vs keep private" }
  ],
  "Computational Thinking": [
    { code: "PreK.CT.1", standard: "Notice simple patterns (colors, sounds, shapes) and predict what comes next" },
    { code: "PreK.CT.2", standard: "Identify things we can count and sort (toys, colors, sizes)" },
    { code: "PreK.CT.3", standard: "Put information into groups and show it (blocks, pictures)" },
    { code: "PreK.CT.4", standard: "Break a big job into little steps (getting dressed, cleaning up)" },
    { code: "PreK.CT.5", standard: "Follow simple directions with 2-3 steps" },
    { code: "PreK.CT.6", standard: "Do tasks in order (first, next, last)" },
    { code: "PreK.CT.7", standard: "Notice when we do the same thing over and over" }
  ],
  "Networks & System Design": [
    { code: "PreK.NSD.1", standard: "Touch, click, or press to make computers do things" },
    { code: "PreK.NSD.2", standard: "Point to parts of a computer (screen, keyboard, mouse)" },
    { code: "PreK.NSD.3", standard: "Ask for help when technology isn't working" },
    { code: "PreK.NSD.4", standard: "Understand that messages travel from one place to another" },
    { code: "PreK.NSD.5", standard: "Know that computers and tablets can save pictures and information" }
  ],
  "Cybersecurity": [
    { code: "PreK.CY.1", standard: "Know that some things are private (passwords, addresses)" },
    { code: "PreK.CY.2", standard: "Understand that passwords keep things safe" },
    { code: "PreK.CY.3", standard: "Ask a grown-up before clicking on new things" }
  ],
  "Digital Literacy": [
    { code: "PreK.DL.1", standard: "Explore and press keys on a keyboard (space, enter, delete)" },
    { code: "PreK.DL.2", standard: "Share ideas using technology with teacher help" },
    { code: "PreK.DL.3", standard: "Understand that computers can help us find information" },
    { code: "PreK.DL.4", standard: "Make something using a computer or tablet" },
    { code: "PreK.DL.5", standard: "Be kind and helpful when using technology" }
  ]
};

export default function StandardsPDFGenerator() {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Title
    doc.setFontSize(18);
    doc.setFont(undefined, 'bold');
    doc.text('Computer Science & Digital Fluency Standards', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(14);
    doc.text('for Preschool Students (Ages 3-5)', margin, yPosition);
    yPosition += 6;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Adapted from NYS K-12 Computer Science Standards', margin, yPosition);
    yPosition += 4;
    doc.text('Robbie\'s Tech Lab - Brooklyn Campus', margin, yPosition);
    yPosition += 12;

    // Introduction
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Introduction', margin, yPosition);
    yPosition += 7;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    
    const intro = 'These Computer Science and Digital Fluency Standards have been carefully adapted from the New York State Education Department\'s K-12 Computer Science Standards to meet the developmental needs of preschool children ages 3-5. The standards maintain alignment with NYS\'s five key concept areas while using age-appropriate language and concrete, hands-on learning experiences. Each standard emphasizes play-based learning, teacher guidance, and the integration of both digital and non-digital activities to support young learners\' understanding of technology concepts.';
    const introLines = doc.splitTextToSize(intro, maxWidth);
    doc.text(introLines, margin, yPosition);
    yPosition += introLines.length * 5 + 10;

    // Standards by area
    Object.entries(NYS_STANDARDS_PRESCHOOL).forEach(([area, standards]) => {
      // Check if we need a new page
      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = margin;
      }

      // Area Title
      doc.setFontSize(13);
      doc.setFont(undefined, 'bold');
      doc.text(area, margin, yPosition);
      yPosition += 8;

      // Area description
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      const descriptions = {
        "Impacts of Computing": "Young children begin to recognize technology in their environment and understand basic rules for using devices safely and responsibly. They learn to identify when technology is being used and develop awareness of privacy and appropriate sharing.",
        "Computational Thinking": "Preschoolers develop foundational thinking skills including pattern recognition, sequencing, sorting, and breaking tasks into steps. These concrete problem-solving skills lay the groundwork for later computational thinking and coding concepts.",
        "Networks & System Design": "Children explore how computers work through hands-on interaction with input and output devices. They learn to identify computer parts and understand that devices can store information and communicate with each other.",
        "Cybersecurity": "Age-appropriate safety concepts are introduced, including the importance of keeping certain information private and asking adults for help when using technology. Children learn that passwords help keep things safe.",
        "Digital Literacy": "Young learners develop basic digital skills including keyboard exploration, using technology to create and share, and understanding that computers can help us find information. Emphasis is placed on being kind and helpful when using technology."
      };
      
      const descLines = doc.splitTextToSize(descriptions[area], maxWidth);
      doc.text(descLines, margin, yPosition);
      yPosition += descLines.length * 5 + 6;

      // Standards
      standards.forEach((std, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFont(undefined, 'bold');
        doc.text(`${std.code}:`, margin, yPosition);
        doc.setFont(undefined, 'normal');
        const stdLines = doc.splitTextToSize(std.standard, maxWidth - 30);
        doc.text(stdLines, margin + 30, yPosition);
        yPosition += Math.max(stdLines.length * 5, 6) + 4;
      });

      yPosition += 8;
    });

    // Developmental Appropriateness section
    if (yPosition > pageHeight - 80) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Developmental Appropriateness for Ages 3-5', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const devText = 'These PreK standards differ from K-1 standards in several important ways to ensure developmental appropriateness:\n\n' +
      '• Concrete over Abstract: Standards focus on touching, seeing, and doing rather than theoretical concepts. Children learn through hands-on exploration with real keyboards, mice, and other tangible materials.\n\n' +
      '• Simplified Language: Technical vocabulary is replaced with child-friendly terms. For example, "data organization" becomes "put things in groups."\n\n' +
      '• Teacher Guided: All activities assume adult support and scaffolding. Preschoolers are not expected to complete tasks independently.\n\n' +
      '• Play-Based Learning: Standards are achieved through games, songs, movement activities, and hands-on exploration rather than formal instruction.\n\n' +
      '• Short Duration: Digital activities are limited to 15-20 minutes and balanced with extensive low-tech activities including puppets, manipulatives, and storytelling.\n\n' +
      '• Social-Emotional Integration: Standards emphasize kindness, sharing, turn-taking, and other social skills alongside technical competencies.';
    
    const devLines = doc.splitTextToSize(devText, maxWidth);
    doc.text(devLines, margin, yPosition);
    yPosition += devLines.length * 5 + 10;

    // Implementation section
    if (yPosition > pageHeight - 60) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, 'bold');
    doc.text('Implementation Recommendations', margin, yPosition);
    yPosition += 8;
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const implText = 'To effectively teach these standards to preschool students:\n\n' +
      '• Balance Technology: Use a 1:2 ratio - one part digital activities to two parts hands-on, low-tech activities.\n\n' +
      '• Create Connections: Link every digital concept to real-world experiences children already understand.\n\n' +
      '• Use Multi-Sensory Approaches: Combine visual, auditory, and kinesthetic learning experiences.\n\n' +
      '• Integrate Throughout the Day: Embed standards into circle time, centers, transitions, and outdoor play.\n\n' +
      '• Celebrate Progress: Focus on growth and effort rather than mastery. Every child develops at their own pace.\n\n' +
      '• Communicate with Families: Share what children are learning and suggest ways to extend learning at home.';
    
    const implLines = doc.splitTextToSize(implText, maxWidth);
    doc.text(implLines, margin, yPosition);

    // Footer on last page
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Generated from Robbie\'s Tech Lab - ' + new Date().toLocaleDateString(), margin, pageHeight - 10);

    // Save the PDF
    doc.save('PreK-Computer-Science-Standards.pdf');
  };

  return (
    <Button 
      onClick={generatePDF}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
    >
      <Download className="w-5 h-5 mr-2" />
      Download Standards PDF
    </Button>
  );
}