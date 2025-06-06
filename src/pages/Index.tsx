import React, { useState } from 'react';
import LanguageSelector from '../components/LanguageSelector';
import VoiceRecorder from '../components/VoiceRecorder';
import AnalysisResults from '../components/AnalysisResults';
import { Card } from '@/components/ui/card';
import { analyzeMedicalAudio  } from '../services/geminiService';

const Index = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [transcription, setTranscription] = useState('');
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeRecording = async () => {
    if (!transcription.trim()) return;
    
    setIsAnalyzing(true);
    console.log('Analyzing transcription with Gemini:', transcription);
    
    try {
      const results = await analyzeMedicalAudio(transcription);
      console.log('Analysis results:', results);
      setAnalysisResults(results);
    } catch (error) {
      console.error('Failed to analyze transcription:', error);
      setAnalysisResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Pranik AI
          </h1>
          <p className="text-lg text-gray-600">
            Multilingual Medical assistant 
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Recording */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Select Language & Record
              </h2>
              <LanguageSelector
                selectedLanguage={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            </Card>

            <Card className="p-6">
              <VoiceRecorder
                selectedLanguage={selectedLanguage}
                transcription={transcription}
                onTranscriptionChange={setTranscription}
                onAnalyze={handleAnalyzeRecording}
                isAnalyzing={isAnalyzing}
              />
            </Card>
          </div>

          {/* Right Column - Results */}
          <div>
            <AnalysisResults 
              results={analysisResults}
              isAnalyzing={isAnalyzing}
              transcription={transcription}
            />
          </div>
        </div>

       
      </div>
    </div>
  );
};

export default Index;
