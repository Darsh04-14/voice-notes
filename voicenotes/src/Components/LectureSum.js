import {Box, Modal, Divider, FormControlLabel, FormControl, Radio, RadioGroup, Button} from '@mui/material';
import React, { useState, useEffect } from 'react';
import './styles.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    height: '60vh',
    width: '50vw',
    bgcolor: '#fff',
    borderRadius: '10px',
    overflow:'scroll',
    boxShadow: 24,
    outline: 'none',
    p: 4,
};

function LectureSum(props) {
    const {open, setOpen, summary, quizQuestions} = props;
    const [score, setScore] = useState("");
    const [correct, setCorrect] = useState([null, null, null, null, null]);

    useEffect(() => {
        setScore("");
        setCorrect([null, null, null, null, null]);
    }, [open]);

    if (!Array.isArray(quizQuestions)) return <></>;

    const handleClose = () => setOpen(false);

    const handleSubmit = () => {
        let res = 0;
        for (let i = 0; i < 5; i++) {
            if (correct[i] === quizQuestions[i].correct_answer)
                res+=1;
        }
        setScore(`You scored ${res}/5`);
    }

    console.log("Quiz Questions", quizQuestions);
    console.log("Correct", correct);

    return (
    <Modal
        open={open}
        onClose={handleClose}
    >
        <Box sx={style}>
            <h2 className='modal-title'>Lecture Summary:</h2>
            <p className='modal-body'>{summary}</p>
            <Divider/>
            <h2 className='modal-title' style={{marginTop: '2%'}}>Lecture Quiz:</h2>
            <FormControl>
                {quizQuestions.map((val, idx) => (
                    <div key={`quiz-${idx}`} className="question-body">
                        <h3 className="question-title">{`${idx + 1}. ${val.prompt}`}</h3>
                        <RadioGroup>
                            {val.options.map((choice, idx2) => (
                                <FormControlLabel 
                                    key={`choice-${idx}-${idx2}`} 
                                    value={`${choice}`} 
                                    control={<Radio />} 
                                    label={`${choice}`}
                                    className="question-option"
                                    onClick={() => {
                                        correct[idx] = choice;
                                        setCorrect(correct);
                                    }}
                                    />
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </FormControl>
            <Button onClick={handleSubmit} sx={{ width: '20%', marginLeft: '40%', marginTop: '2%' }}>Check Score</Button>
            <p style={{color: 'black'}}>{score}</p>
        </Box>
    </Modal>
    );
}

export default LectureSum;