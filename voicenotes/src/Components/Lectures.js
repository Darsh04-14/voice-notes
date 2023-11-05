import './styles.css';
import React, { useState, useEffect } from 'react';
import useDB from '../hooks/useDB';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { CardActionArea, Typography, IconButton, bottomNavigationActionClasses } from '@mui/material';
import {CircularProgress} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LectureSum from './LectureSum'
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import { useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import useAuth from '../hooks/useAuth';





function Lectures() {
    const {logOut} = useAuth();
    const [lectures, setLectures] = useState(null);
    const { getLectures, deleteLecture } = useDB();
    const [open, setOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [quizQuestions, setQuizQuestions] = useState("");
    const navigate = useNavigate();
    const readLectures = async () => {
        const data = await getLectures();
        setLectures(data);
    }

    const signOut = async() => {
        try {
          await logOut();
        } catch (err) {
          console.error(err);
        }
      }

    useEffect(() => {
        readLectures();
    }, [])

    const handleDelete = (id, idx) => {
        let array = [];
        for (let i = 0; i < lectures.length; i++) {
            if (i !== idx) {
                array.push(lectures[i]);
            }
        }
        setLectures(array);
        deleteLecture(id);
    }
    console.log(open, summary, quizQuestions);
    return (
        <div className="main-container">
            <div className="title-wrapper">
                <span>My Lectures</span>
            </div>
            <div className='card-display'>
            {!lectures ? <CircularProgress/> : lectures.map((val, idx) => (    
                <Card sx={{ width: '22vw', height: '35vh', bgcolor: '#f0f0f0', borderRadius: '10px', boxShadow: 'none', transition: '0.3s ease-in-out', position:'relative', "&:hover": {boxShadow: '3px 3px 10px 3px rgba(0,0,0,0.2)', zIndex: 1, marginTop: "-1%", marginBottom:"1%"} }} key={`card-${idx}`}>
                    <Typography sx={{ fontSize: 20, marginTop: '5%', marginLeft: '5%' }} variant="h1" gutterBottom>
                        {val.title}
                      </Typography>
                    <CardContent sx={{ overflow: 'scroll', height: '70%'}}>
                      <Typography variant="body2">
                      {val.transcript}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'space-between'}}>
                        <OpenInNewIcon sx={{ cursor: 'pointer' }} onClick={() => {
                            console.log("Onclick",val, idx);
                            setOpen(true);
                            setSummary(val.summary);
                            setQuizQuestions(val.quiz);
                        }} 
                        color="primary"/>
                        <DeleteIcon sx={{ cursor: 'pointer' }} color="error" className='btn-delete' onClick={() => handleDelete(val.id, idx)}/>
                    </CardActions>
                </Card>))}
            </div>
            <LectureSum open={open} setOpen={setOpen} summary={summary} quizQuestions={quizQuestions}/>
            <div style={{display: 'flex', width: '20vw', justifyContent: 'space-evenly', marginBottom: '1%',}}>
                <span className="btn" onClick={() => navigate('/')} style={{backgroundColor: '#eeeeee'}}>
                    <ReadMoreIcon sx={{ transform: 'rotate(180deg)', color: 'rgba(0,0,0,0.8)', fontSize: 25}}/>
                </span>
                <span className="btn" onClick={signOut} style={{backgroundColor: '#eeeeee'}}>
                    <LogoutIcon style={{ color: 'rgba(0,0,0,0.8)', fontSize: 25 }}/>
                </span>
            </div>
                
        </div>
    );
}

export default Lectures;