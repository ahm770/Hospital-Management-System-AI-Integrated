const MedicalRecord = require("../models/MedicalRecord");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Generate AI-powered medical record summary with oversight and suggestions
 */
const generateMedicalSummary = async (patientId) => {
  try {
    // Fetch the last 10 medical records for the patient
    const records = await MedicalRecord.find({ patient: patientId }).sort({ visitDate: -1 }).limit(10);
    if (!records.length) return "No medical history available.";

    // Extract key medical details
    const medicalData = records.map((record) => ({
      date: record.visitDate.toISOString().split("T")[0],
      diagnosis: record.diagnosis,
      treatment: record.treatment || "N/A",
      symptoms: record.symptoms.length ? record.symptoms.join(", ") : "None",
      medications: record.medications.length ? record.medications.join(", ") : "None",
    }));
    console.log("medical data for ai analysis::", medicalData)

    // Construct prompt for AI analysis
    const prompt = `
    You are an advanced medical AI assisting doctors in analyzing patient history. Below is a summary of the last 10 medical records for a patient:
    
    ${JSON.stringify(medicalData, null, 2)}
    
    **TASK:**  
    🔍 **1. Clinical Summary:** Provide a brief but medically accurate summary of the patient's history, including patterns and trends.  
    
    💡 **2. Treatment Optimization:** Assess the effectiveness of current treatments. Are there alternative medications, lifestyle changes, or new clinical guidelines that should be considered?  
    
    ⚠️ **3. Risk Analysis & Warnings:** Identify potential **medication interactions, overlooked symptoms, or signs of disease progression**. Highlight anything requiring **urgent attention**.  
    
    📊 **4. Predictive Insights:** Based on the patient's medical history, predict potential future health risks. Suggest preventive measures or screenings that could be beneficial.  
    
    🩺 **5. Actionable Doctor Recommendations:** Offer structured, **evidence-based recommendations** as if advising a specialist.  
    - Should any medications be reconsidered or changed?  
    - Does the diagnosis history indicate a possible **underlying condition** that was missed?  
    - Are there lab tests, imaging, or specialist referrals that should be done?  
    
    **Provide your response in a structured, professional format suitable for clinical review.**  
    `;
    

    // Send request to Google AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "Error generating summary.";
  }
};

module.exports = { generateMedicalSummary };
