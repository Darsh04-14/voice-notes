import logo from './logo.svg';
import useSpeechToText from 'react-hook-speech-to-text';
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
function App() {
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  const [fact, setFact] = useState('');

  const fetchFact = async () => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/text-davinci-002/completions',
        {
          prompt: 'Convert the following notes into fact ',
          max_tokens: 50
        },
        {
          headers: {
            'Authorization': `Bearer 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`
          }
        }
      );

      setFact(response.data.choices[0].text);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setFact('Failed to fetch.');
    }
  };




  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <div>
      <h1>Recording: {isRecording.toString()}</h1>
      <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      <ul>
        {results.map((result) => (
          <li key={result.timestamp}>{result.transcript}</li>
        ))}
        {interimResult && <li>{interimResult}</li>}
      </ul>


      <div>
      <p>{fact || "Press button"}</p>
        <button onClick={fetchFact}>Press me for notes</button>
        </div>

    </div>
  );
}

export default App;
