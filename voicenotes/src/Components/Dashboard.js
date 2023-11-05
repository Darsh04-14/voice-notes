import useSpeechToText from 'react-hook-speech-to-text';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import {CircularProgress} from '@mui/material';
import TextField from '@mui/material/TextField';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import LogoutIcon from '@mui/icons-material/Logout';
import LectureSum from '../Components/LectureSum'
import './styles.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';


const theme = createTheme({
    palette: {
      ochre: {
        main: '#0000',
      },
    },
});
  

function Dashboard() {
  const [transcribedText, setTranscribedText] = useState('');
  const [summary, setSummary] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logOut } = useAuth();

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

  const signOut = async() => {
    try {
      await logOut();
    } catch (err) {
      console.error(err);
    }
  }

  const fetchSummary = async () => {
    if (transcribedText === "") return;
    setIsLoading(true);
    try {
        const prompt = `Rewrite the following into shorter and concise sentences: \n ${transcribedText}`;
        const response = await axios.post(
          'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
          {
            prompt: prompt,
            max_tokens: 2000,
          },
          {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET_KEY}`,
            },
          }
        );
      
        setSummary(response.data.choices[0].text);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setSummary('Failed to fetch.');
    } finally {
        fetchQuizQuestions();
    }
  };

  const fetchQuizQuestions = async () => {
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
    } finally {
        setIsLoading(false);
        handleOpen();
    }
  };

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    let totalSpeech = '';
    results.forEach((text) => {
      if (text.transcript) {
        text.transcript = text.transcript.charAt(0).toUpperCase() + text.transcript.slice(1);
        totalSpeech += text.transcript + '. ';
        }
    });
    if (interimResult) totalSpeech += interimResult;
    setTranscribedText(totalSpeech);
  }, [results, interimResult]);

  if (error) return <p>Web Speech API is not available in this browser 🤷‍</p>;

  return (
    <ThemeProvider theme={theme}>
        {isLoading && <div className='loading-overlay'><CircularProgress/></div>} 
        <div className="main-container">
          <div className="title-wrapper">
            <span>Lecture-Lenz</span>
          </div>
          <div className="speech-content">
            <TextField 
                id="standard-basic" 
                variant="standard" 
                color='ochre'
                defaultValue={`Lecture @ ${new Date().toLocaleDateString()}`}  
            />
            <p>{transcribedText}</p>
          </div>
          <div className="btn-container">
            <span className="btn" onClick={isRecording ? stopSpeechToText : startSpeechToText}>
              {isRecording ? <MicIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 30 }} /> : <MicOffIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 30 }} />}
            </span>
            <span className="btn" onClick={fetchSummary}>
              <DocumentScannerIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }}/>
            </span>
            <span className="btn" onClick={() => navigate('/lectures')}>
              <ReadMoreIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }}/>
            </span>
            <span className="btn" onClick={signOut}>
                <LogoutIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }}/>
            </span>
          </div>
        </div>
        <LectureSum open={open} setOpen={setOpen} summary={summary} quizQuestions={quizQuestions}/>
    </ThemeProvider>
  );
}

export default Dashboard;
