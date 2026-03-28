/* ============================================
   lib/analyzeResume.js
   Rule-based analysis engine for resumes
   ============================================ */

/**
 * Analyzes resume text using pre-defined rules and heuristics
 * @param {string} text - Cleaned resume text
 * @returns {Object} - Suggestions and data
 */
export async function analyzeResume(text) {
  const suggestions = {
    formatting: [],
    content: [],
    skills: [],
    keywords: [],
  };

  const textLower = text.toLowerCase();

  // --- 1. Formatting & Structure Rules ---
  const sections = ['education', 'experience', 'skills', 'projects', 'summary', 'contact', 'objective'];
  const foundSections = sections.filter(s => textLower.includes(s));
  
  if (foundSections.length < 4) {
    suggestions.formatting.push({
      priority: 'high',
      title: 'Missing Essential Sections',
      detail: 'Your resume seems to be missing standard sections like Experience, Education, or Skills.',
      example: 'Ensure you have clear headings for "Professional Experience" and "Education".'
    });
  }

  if (text.length < 500) {
    suggestions.formatting.push({
      priority: 'medium',
      title: 'Resume is too brief',
      detail: 'Your resume is quite short. Aim for at least one full page of dense content.',
    });
  } else if (text.length > 8000) {
    suggestions.formatting.push({
      priority: 'medium',
      title: 'Resume is too long',
      detail: 'Recruiters usually prefer 1-2 pages. Consider condensing your older experience.',
    });
  }

  // Check for bullet points
  const bulletCount = (text.match(/[•\*\-\u2022\u2023\u25E6]/g) || []).length;
  if (bulletCount < 5) {
    suggestions.formatting.push({
      priority: 'high',
      title: 'Insufficient Bullet Points',
      detail: 'Use bullet points to make your experience readable and easy to scan.',
      example: '• Managed a team of 5 developers\n• Increased revenue by 20%'
    });
  }

  // --- 2. Content & Impact Rules ---
  const actionVerbs = ['managed', 'developed', 'coordinated', 'increased', 'led', 'designed', 'built', 'created', 'implemented', 'optimized'];
  const foundActionVerbs = actionVerbs.filter(v => textLower.includes(v));
  
  if (foundActionVerbs.length < 3) {
    suggestions.content.push({
      priority: 'high',
      title: 'Use More Action Verbs',
      detail: 'Start your bullet points with strong action verbs to demonstrate impact.',
      example: 'Led, Managed, Developed, Orchestrated, Optimized.'
    });
  }

  // Check for metrics/quantification
  const metrics = (text.match(/\d+%|\$\d+|\d+ percent|\d+x/g) || []).length;
  if (metrics < 2) {
    suggestions.content.push({
      priority: 'medium',
      title: 'Quantify Your Achievements',
      detail: 'Add numbers, percentages, or dollar amounts to prove your impact.',
      example: 'Improved website performance by 40% using React and Next.js.'
    });
  }

  // Check for summary
  if (!textLower.includes('summary') && !textLower.includes('profile')) {
    suggestions.content.push({
      priority: 'medium',
      title: 'Add a Professional Summary',
      detail: 'A strong summary at the top helps recruiters quickly understand your value proposition.',
    });
  }

  // --- 3. Skills Rules ---
  const technicalSkills = ['javascript', 'python', 'java', 'react', 'node', 'aws', 'sql', 'git', 'docker', 'api', 'cloud', 'data'];
  const foundTech = technicalSkills.filter(s => textLower.includes(s));
  
  if (foundTech.length < 3) {
    suggestions.skills.push({
      priority: 'medium',
      title: 'Add More Technical Skills',
      detail: 'List specific tools and technologies you are proficient in.',
    });
  }

  const softSkills = ['communication', 'teamwork', 'leadership', 'problem solving', 'agile', 'management', 'collaboration'];
  const foundSoft = softSkills.filter(s => textLower.includes(s));
  
  if (foundSoft.length < 2) {
    suggestions.skills.push({
      priority: 'low',
      title: 'Include Soft Skills',
      detail: 'Highlight your interpersonal and organizational skills.',
    });
  }

  // --- 4. Keywords Rules ---
  const atsKeywords = ['strategic', 'cross-functional', 'stakeholder', 'optimization', 'full-stack', 'enterprise', 'scalability', 'innovation'];
  const foundKeywords = atsKeywords.filter(k => textLower.includes(k));
  
  if (foundKeywords.length < 2) {
    suggestions.keywords.push({
      priority: 'medium',
      title: 'Missing Industry Keywords',
      detail: 'Incorporate more industry-standard terminology to pass ATS filters.',
    });
  }

  // Check for contact info placeholders
  if (textLower.includes('[phone]') || textLower.includes('[email]')) {
    suggestions.keywords.push({
      priority: 'high',
      title: 'Placeholder Text Detected',
      detail: 'Remove all placeholder text like [Phone Number] or [Email] from your final resume.',
    });
  }

  return suggestions;
}
