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

  const fetchJoke = async () => {
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

      setJoke(response.data.choices[0].text);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setJoke('Failed to fetch.');
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
      <p>{joke || "Press button"}</p>
        <button onClick={fetchJoke}>Press me for notes</button>
        </div>

    </div>
  );
}

export default App;
