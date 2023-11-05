import React, { useState, useEffect } from 'react';
import useSpeechToText from 'react-hook-speech-to-text';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import './App.css';
import axios from 'axios';

function App() {
  const [speech, setSpeech] = useState('');

  const [quizQuestions, setQuizQuestions] = useState(null);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  useEffect(() => {
    let totalSpeech = '';
    console.log(results, interimResult);
    results.forEach((text) => {
      if (text.transcript) totalSpeech += text.transcript + '. ';
    });
    if (interimResult) totalSpeech += interimResult;
    setSpeech(totalSpeech);
  }, [results, interimResult]);

  const getTranscribedText = () => {
    let transcribedText = results.map(result => result.transcript).join(' ');
    if (interimResult) transcribedText += interimResult;
    return transcribedText;
  };

  const fetchQuizQuestions = async () => {
    const transcribedText = getTranscribedText();
 
    if (!transcribedText) {
      setQuizQuestions('No transcribed text to process.');
      return;
    }
    const text_input ='hey class today we will be talking about matricies, addition, subtraction, multiplication, and also inverse matricies';
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
        {
          prompt: `Give me only a JSON array of 5 objects with a prompt field, an options field, and a correct_answer field
          where prompt has the question, the options field has an array of 4 options, and the correct_answer field has an answer to the question.
          Use this input as the material: "${transcribedText}"`,
          max_tokens: 2000 // Adjust the max_tokens if necessary
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET_KEY}`
          }
        }
      );
 
      // Directly parse the returned JSON string to a JavaScript object
      const data = JSON.parse(response.data.choices[0].text.trim());
      if (Array.isArray(data)) {
        setQuizQuestions(data);
      } else {
        console.error('Fetched data is not an array:', data);
        setQuizQuestions([]);
      }

    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setQuizQuestions([]);
    }
  };

  console.log(quizQuestions)

  // A new function to display quiz questions on the UI
  const renderQuizQuestions = () => {
    if (quizQuestions) {
      return quizQuestions.map((question, index) => (
        <div key={index}>
          <p>{question.prompt}</p>
          <ul>
            {question.options.map((option, index) => (
              <li key={index}>{option}</li>
            ))}
          </ul>
        </div>
      ));
    }
    return null;
  };

  if (error) return <p>Web Speech API is not available in this browser 🤷‍♀️</p>;

  return (
    <div className="main-container">
      <div className="title-wrapper">
        <span>VoiceNotes</span>
      </div>
      <div className="speech-content">
        <p>{speech}</p>
      </div>
      <div className="btn-container">
        <span className="btn" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
          {isRecording ? <MicIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 30 }} /> : <MicOffIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 30 }} />}
        </span>
        <span className="btn">
          <DocumentScannerIcon fontSize="medium" style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }} onClick={fetchQuizQuestions}>
            Press me for notes
          </DocumentScannerIcon>
        </span>
      </div>
      <div>
        {renderQuizQuestions()}
      </div>
 
    </div>
  );
}

export default App;
