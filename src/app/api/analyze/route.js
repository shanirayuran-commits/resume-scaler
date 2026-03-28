/* ============================================
   app/api/analyze/route.js
   POST handler for resume analysis
   Works with file data passed directly (Netlify compatible)
   ============================================ */
import { NextResponse } from 'next/server';
import { parseResume } from '../../../lib/parseResume';
import { analyzeResume } from '../../../lib/analyzeResume';
import { generateAIInsights } from '../../../lib/aiAnalysis';
import { calculateScore } from '../../../lib/scoring';

export async function POST(req) {
  try {
    const { fileId, fileName, jobType, fileData } = await req.json();

    if (!fileId || !fileName || !fileData) {
      return NextResponse.json({ error: 'Missing file metadata' }, { status: 400 });
    }

    // Convert base64 file data back to Buffer
    const buffer = Buffer.from(fileData, 'base64');

    // 1. Parse text from resume
    const text = await parseResume(buffer, fileName);

    // 2. Run rule-based analysis (always runs)
    const suggestions = await analyzeResume(text);

    // 3. Generate AI insights (optional / with fallback)
    const insights = await generateAIInsights(text);

    // 4. Calculate final score based on analysis
    const { score, breakdown } = calculateScore(suggestions);

    // Returning complete analysis results
    return NextResponse.json({
        fileId,
        fileName,
        jobType: jobType || 'general',
        score,
        breakdown,
        suggestions,
        insights: insights || {}
    });

  } catch (err) {
    console.error('Analysis error:', err.message);
    return NextResponse.json({ 
        error: err.message || 'Failed to analyze resume. Please try a different format.' 
    }, { status: 500 });
  }
}
