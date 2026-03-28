/* ============================================
   lib/aiAnalysis.js
   OpenAI GPT integration for enhanced resume analysis
   ============================================ */
import OpenAI from 'openai';

let openai = null;

/**
 * Uses AI to generate career insights and deeper analysis
 * @param {string} text - Resume text
 * @returns {Promise<Object>} - AI-powered insights
 */
export async function generateAIInsights(text) {
  // If no API key, return fallback insights
  if (!process.env.OPENAI_API_KEY) {
    return getFallbackInsights();
  }

  // Lazy initialize OpenAI client only when needed
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  try {
    const prompt = `
      Analyze the following resume text and provide structured feedback in JSON format.
      Keep suggestions actionable and insights professional.
      
      Resume Text:
      """
      ${text.substring(0, 4000)} ... (truncated)
      """
      
      Return a JSON object with this exact structure:
      {
        "summary": "A 2-3 sentence overview of the profile's strength and positioning.",
        "strengths": ["List of 3-4 top strengths"],
        "weaknesses": ["List of 2-3 areas needing significant improvement"],
        "skillGaps": ["Specific hard or soft skills missing for typical roles in this field"],
        "industryMatch": "Which specific industries this resume is best optimized for.",
        "jobType": "Detected job category: tech, finance, marketing, sales, healthcare, or general",
        "actionItems": ["Top 3 priority tasks for the user to improve this resume today"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview", // or gpt-3.5-turbo if cost-sensitive
      messages: [
        { role: "system", content: "You are an expert career coach and recruiter specializing in resume optimization and ATS (Applicant Tracking Systems)." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    // Log error cause but don't expose implementation details
    console.error('AI analysis error:', err.message);
    return getFallbackInsights();
  }
}

/**
 * Fallback insights when AI is unavailable
 */
function getFallbackInsights() {
  return {
    summary: "Your resume shows a solid foundation. With some optimization in keywords and achievement quantification, you can significantly improve your ATS ranking.",
    strengths: [
      "Document structure is generally professional",
      "Core contact information is present",
      "Primary work experience is listed chronologically"
    ],
    weaknesses: [
      "Achievement quantification could be stronger",
      "Industry-specific keyword density is slightly low",
      "Layout could benefit from more modern white-space usage"
    ],
    skillGaps: [
      "Consider adding more specialized certifications",
      "Soft skills are under-represented relative to hard skills"
    ],
    industryMatch: "General professional services / Technology",
    jobType: "general",
    actionItems: [
      "Rewrite bullet points to start with strong action verbs",
      "Quantify at least 3 major achievements with numbers or percentages",
      "Add a professional summary top highlight your unique value proposition"
    ]
  };
}
