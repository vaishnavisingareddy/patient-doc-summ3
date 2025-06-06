import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { analyzeMedicalAudio } from '@/services/geminiService';
import { Play, StopCircle } from 'lucide-react';
import AnalysisResults from './AnalysisResults';

const VoiceRecorder = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const audio = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(audio);
        setAudioURL(URL.createObjectURL(audio));
        setAudioChunks([]);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      alert('Microphone access is required to record.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const handleAnalyze = async () => {
    if (!audioBlob) {
      alert('Please record audio before analyzing.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzeMedicalAudio(audioBlob);
      setAnalysisResult(result);
      console.log('Analysis Result:', result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze the audio. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-semibold text-gray-800">🎤 Voice Recorder</h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={startRecording}
          disabled={isRecording}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Play className="w-4 h-4 mr-2" />
          Start Recording
        </Button>

        <Button
          onClick={stopRecording}
          disabled={!isRecording}
          variant="destructive"
        >
          <StopCircle className="w-4 h-4 mr-2" />
          Stop Recording
        </Button>

        <Button
          onClick={handleAnalyze}
          disabled={!audioBlob || isAnalyzing}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Recording'}
        </Button>
      </div>

      {audioURL && (
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Recorded Audio:
          </label>
          <audio controls src={audioURL} className="w-full" />
        </div>
      )}

      {(isAnalyzing || analysisResult) && (
  <AnalysisResults
    results={analysisResult}
    isAnalyzing={isAnalyzing}
    transcription={""} // or a real transcription if available
  />
)}

    </div>
  );
};


export default VoiceRecorder;
