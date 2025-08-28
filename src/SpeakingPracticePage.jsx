import React, { useState, useEffect } from 'react';

const SpeakingPracticePage = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [phrases] = useState([
    "Hello, how are you?",
    "My name is John.",
    "I like to learn English.",
    "What is your favorite food?",
    "I want to go to the store.",
    "Thank you very much.",
    "Excuse me, where is the bathroom?",
    "How much does this cost?"
  ]);
  const [currentPhrase, setCurrentPhrase] = useState('');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const SpeechSynthesis = window.speechSynthesis;

    setIsSupported(!!SpeechRecognition && !!SpeechSynthesis);
    selectRandomPhrase();
  }, []);

  const selectRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    setCurrentPhrase(phrases[randomIndex]);
  };

  const startListening = () => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
      setFeedback('');
    };

    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      analyzePronunciation(speechResult);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const analyzePronunciation = (spokenText) => {
    const originalWords = currentPhrase.toLowerCase().split(' ');
    const spokenWords = spokenText.toLowerCase().split(' ');

    let correctWords = 0;
    originalWords.forEach(word => {
      if (spokenWords.includes(word)) {
        correctWords++;
      }
    });

    const accuracy = Math.round((correctWords / originalWords.length) * 100);

    if (accuracy >= 80) {
      setFeedback(`🎉 Excellent! ${accuracy}% accuracy. Great pronunciation!`);
    } else if (accuracy >= 60) {
      setFeedback(`👍 Good job! ${accuracy}% accuracy. Keep practicing!`);
    } else {
      setFeedback(`💪 Keep trying! ${accuracy}% accuracy. Practice makes perfect!`);
    }
  };

  const speakPhrase = () => {
    if (!isSupported || !currentPhrase) return;

    const utterance = new SpeechSynthesisUtterance(currentPhrase);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Speaking Practice</h1>
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <p>Your browser doesn&apos;t support speech recognition or speech synthesis.
             Please use a modern browser like Chrome, Firefox, or Safari for the best experience.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Speaking Practice</h1>
      <p className="text-gray-600 mb-8">Practice your English pronunciation with speech recognition</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Practice Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Practice Phrase</h2>

          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="text-lg font-medium text-blue-800">{currentPhrase}</p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={speakPhrase}
                className="flex-1 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 flex items-center justify-center"
              >
                🔊 Listen
              </button>
              <button
                onClick={selectRandomPhrase}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
              >
                🔄 New Phrase
              </button>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Your Turn</h3>

            <button
              onClick={startListening}
              disabled={isListening}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold ${
                isListening
                  ? 'bg-red-500 animate-pulse'
                  : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Start Speaking'}
            </button>

            {transcript && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-sm text-gray-600">You said:</p>
                <p className="font-medium">{transcript}</p>
              </div>
            )}

            {feedback && (
              <div className="mt-4 p-3 bg-green-100 border-l-4 border-green-500 rounded">
                <p className="font-medium text-green-800">{feedback}</p>
              </div>
            )}
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Speaking Tips</h2>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h3 className="font-semibold">Pronunciation</h3>
                <p className="text-sm text-gray-600">Focus on clear articulation of each word</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">⏱️</span>
              <div>
                <h3 className="font-semibold">Pacing</h3>
                <p className="text-sm text-gray-600">Speak at a natural pace, not too fast or slow</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🗣️</span>
              <div>
                <h3 className="font-semibold">Confidence</h3>
                <p className="text-sm text-gray-600">Practice regularly to build confidence</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <span className="text-2xl">🔄</span>
              <div>
                <h3 className="font-semibold">Repeat</h3>
                <p className="text-sm text-gray-600">Repeat challenging phrases multiple times</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">Practice Routine</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Listen to the phrase first</li>
              <li>• Repeat it several times</li>
              <li>• Try speaking without looking</li>
              <li>• Record yourself and compare</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPracticePage;