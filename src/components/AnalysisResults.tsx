
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Calendar, Pill, FileText, Clock, Stethoscope, BookOpen, Heart, AlertTriangle } from 'lucide-react';

interface AnalysisResultsProps {
  results: any;
  isAnalyzing: boolean;
  transcription: string;
}



const AnalysisResults = ({ results, isAnalyzing, transcription }: AnalysisResultsProps) => {
  if (!transcription && !results && !isAnalyzing) {
    return (
      <Card className="p-8 text-center bg-gray-50">
        <div className="text-gray-400 mb-4">
          <FileText className="w-16 h-16 mx-auto mb-4" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No Analysis Yet
        </h3>
        <p className="text-gray-500">
          Record your voice and click "Analyze Recording" to see Patient and Doctor Conversation.
        </p>
      </Card>
    );
  }
  const handleSubmit = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(results),
    });

    if (response.ok) {
      alert('✅ Data submitted to MongoDB successfully!');
    } else {
      alert('❌ Failed to submit: ' + (await response.text()));
    }
  } catch (error) {
    alert('🚨 Error submitting data: ' + error.message);
  }
};


  if (isAnalyzing) {
    return (
      <Card className="p-8 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">
          Analyzing Medical Content
        </h3>
        <p className="text-gray-500">
          AI is extracting comprehensive medical insights and recommendations...
        </p>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Transcription Preview
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 leading-relaxed">
            {transcription || "No transcription available yet."}
          </p>
        </div>
        <p className="text-sm text-gray-500 mt-3">
          Click "Analyze Recording" to extract detailed medical insights
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-h-[80vh] overflow-y-auto">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Patient Information
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Name:</span>
            <span className="font-medium">{results.patientInfo.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Age:</span>
            <span className="font-medium">{results.patientInfo.age}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Gender:</span>
            <span className="font-medium">{results.patientInfo.gender}</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-red-600" />
          Symptoms Identified
        </h3>
        <div className="flex flex-wrap gap-2">
          {results.symptoms.map((symptom: string, index: number) => (
            <Badge key={index} variant="destructive" className="capitalize">
              {symptom}
            </Badge>
          ))}
        </div>
      </Card>

      {results.detailedAnalysis && (
        <>
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-purple-600" />
              Possible Causes
            </h3>
            <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {results.detailedAnalysis.possibleCauses}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              Medication Recommendations
            </h3>
            <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {results.detailedAnalysis.medications}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Prescription Details
            </h3>
            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {results.detailedAnalysis.prescriptions}
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Lifestyle Recommendations
            </h3>
            <div className="bg-pink-50 p-4 rounded-lg border-l-4 border-pink-400">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {results.detailedAnalysis.lifestyle}
              </p>
            </div>
          </Card>
        </>
      )}

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-yellow-600" />
          Follow-up Instructions
        </h3>
        <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400 whitespace-pre-line">
          {results.followUp}
        </p>
      </Card>

      <div className="flex justify-center mt-4">
  <button
    onClick={handleSubmit}
    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-xl shadow"
  >
    Submit to Database
  </button>
</div>


     
    </div>
  );
};

export default AnalysisResults;