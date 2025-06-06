// geminiService.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyCl-Ys-YuIoTBzN0fI8gcLmyIZsRp_zxWY';
const genAI = new GoogleGenerativeAI(API_KEY);

export interface MedicalAnalysisResult {
  patientInfo: {
    name: string;
    age: string;
    gender: string;
  };
  symptoms: string[];
  detailedAnalysis: {
    possibleCauses: string;
    medications: string;
    prescriptions: string;
    lifestyle: string;
  };
  followUp: string;
}

export const analyzeMedicalAudio = async (audioBlob: Blob): Promise<MedicalAnalysisResult> => {
  try {
    const model = genAI.getGenerativeModel({ model: 'models/gemini-1.5-flash' });

    const file = new File([audioBlob], 'recording.wav', {
      type: 'audio/wav',
    });

    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Analyze this medical audio and return a structured JSON object with the following format:
{
  "patientInfo": {
    "name": string,
    "age": string,
    "gender": string
  },
  "symptoms": string[],
  "detailedAnalysis": {
    "possibleCauses": string,
    "medications": string,
    "prescriptions": string,
    "lifestyle": string
  },
  "followUp": string
}
Only return valid JSON.`
            },
            {
              inlineData: {
                mimeType: file.type,
                data: await blobToBase64(file),
              },
            },
          ],
        },
      ],
    });

    const response = await result.response;
    let text = await response.text();

    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    const analysisResult = JSON.parse(text);
    return analysisResult;
  } catch (error) {
    console.error('Error analyzing with Gemini:', error);

    return {
      patientInfo: {
        name: "Not specified",
        age: "Not specified",
        gender: "Not specified",
      },
      symptoms: ["Analysis failed - please try again"],
      detailedAnalysis: {
        possibleCauses:
          "Unable to analyze possible causes due to API error. Please consult a healthcare provider.",
        medications:
          "Unable to provide medication recommendations. Please seek professional medical advice.",
        prescriptions:
          "Unable to generate prescription recommendations. Consult a qualified provider.",
        lifestyle:
          "General advice: Maintain good hygiene, rest, and nutrition. See a healthcare provider.",
      },
      followUp:
        "Please consult with a qualified healthcare provider for proper diagnosis and treatment recommendations.",
    };
  }
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = (reader.result as string).split(',')[1];
      resolve(base64data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
