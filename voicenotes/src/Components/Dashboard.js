import useSpeechToText from 'react-hook-speech-to-text';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './styles.css';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
// import useDB from '../hooks/useDB';


const theme = createTheme({
    palette: {
      ochre: {
        main: '#0000',
      },
    },
});

function Dashboard() {
  const [transcribedText, setTranscribedText] = useState('');
  const [fact, setFact] = useState('');
  const [quizQuestions, setQuizQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logOut } = useAuth();
  // const { getLectures, createLecture, deleteLecture } = useDB();

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

  const fetchFact = async () => {
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
      
        setFact(response.data.choices[0].text);
    } catch (error) {
      console.error('Error fetching from OpenAI:', error);
      setFact('Failed to fetch.');
    } finally {
        setIsLoading(false);
    }
  };

  const fetchQuizQuestions = async () => {
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

  // const readAll = async () => {
  //   const lectures = await getLectures("ezKdgj7oMoNMxEKBBo6L7wKclrh2");
  //   console.log(lectures);
  // }

  // const deleteOne = async (id) => {
  //   await deleteLecture("FsZ5gL0zIAWqjpByTfpV");
  //   await readAll();
  // }

  // const createOne = async() => {
  //   await createLecture("new title", "new transcript", "summ ary", "quiz time!!");
  //   await readAll();
  // }

  useEffect(() => {
    let totalSpeech = '';
    console.log(results, interimResult);
    results.forEach((text) => {
      if (text.transcript) totalSpeech += text.transcript + '. ';
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
            <span>VoiceNotes</span>
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
            <span className="btn" onClick={fetchFact}>
              <DocumentScannerIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }}/>
            </span>
            <span className="btn" onClick={() => navigate('/lectures')}>
              <ReadMoreIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }}/>
            </span>
          </div>
          <button onClick={signOut}>Log Out</button>
          {/* <button onClick={readAll}>Read All</button>
          <button onClick={deleteOne}>Delete One</button>
          <button onClick={createOne}>Create One</button> */}
        </div>
    </ThemeProvider>
  );
}

export default Dashboard;
