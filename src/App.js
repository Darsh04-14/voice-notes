import useSpeechToText from 'react-hook-speech-to-text';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import './App.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
function App() {
  const [speech, setSpeech] = useState("");

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

  useEffect(() => {
    let totalSpeech = "";
    console.log(results, interimResult);
    results.forEach(text => {
      if (text.transcript) totalSpeech += text.transcript + ". ";
    });
    if (interimResult) totalSpeech += interimResult;
    setSpeech(totalSpeech);
  }, [results, interimResult]);

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;


  return (
      <div className="main-container">
        <div className="title-wrapper">
        <span>VoiceNotes</span>
        </div>
        <div className="speech-content">
          <p>{speech}</p>
        </div>
        <div className='btn-container'>
          <span className="btn" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
            {isRecording ? <MicIcon style={{color: 'rgba(0,0,0,0.8)', fontSize: 30}}/> : <MicOffIcon style={{color: 'rgba(0,0,0,0.8)', fontSize: 30}}/>}
          </span>
          <span className="btn">
            <DocumentScannerIcon fontSize="medium" style={{color: 'rgba(0,0,0,0.8)', fontSize: 25}} onClick={fetchFact}>Press me for notes</DocumentScannerIcon>
          </span>
        </div>
        <p>{fact}</p>
      </div>
  );
}

    // <div>
    //   <h1>Recording: {isRecording.toString()}</h1>
    //   <button onClick={isRecording ? stopSpeechToText : startSpeechToText}>
    //     {isRecording ? 'Stop Recording' : 'Start Recording'}
    //   </button>
    //   <ul>
    //     {results.map((result) => (
    //       <li key={result.timestamp}>{result.transcript}</li>
    //     ))}
    //     {interimResult && <li>{interimResult}</li>}
    //   </ul>
    // </div>

export default App;
