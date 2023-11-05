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





function Lectures() {
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
                <Card sx={{ width: '22vw', height: '35vh', bgcolor: '#f0f0f0', borderRadius: '10px', boxShadow: 'none', transition: '0.3s ease-in-out', "&:hover": {boxShadow: '3px 3px 10px 3px rgba(0,0,0,0.2)', marginTop: '-10px'} }} key={`card-${idx}`}>
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
                <span className="btn" onClick={() => navigate('/')} style={{marginBottom: '1%', backgroundColor: '#eeeeee'}}>
                    <ReadMoreIcon sx={{ transform: 'rotate(180deg)', color: 'rgba(0,0,0,0.8)', fontSize: 25}}/>
                </span>
        </div>
    );
}

export default Lectures;