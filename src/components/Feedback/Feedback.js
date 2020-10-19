import React, { useContext } from 'react';
import UserContext from '../../contexts/UserContext';
import './feedback.css';

export default function Feedback() {
  
  const context = useContext(UserContext);

  if (context.isCorrect === true) {
    return (
      <section className='feedback'>
        <div className='correct'>
          <h2>You were correct! :D</h2>
          <div className='DisplayScore'> 
            <p>Your total score is: {context.totalScore}</p> 
          </div>
          <div className='DisplayFeedback'>
            <p> The correct translation for {context.currentWord} was{' '} {context.answer} and you chose {context.guess}! </p>
          </div>
          <button onClick={() => context.setIsCorrect(null)}> Try another word! </button>
        </div>
      </section>
    );
  } else if (context.isCorrect === false) {
    return (
      <section className='feedback'>
        <div className='incorrect'>
          <h2>Good try, but not quite right :(</h2>
          <div className='DisplayScore'>
            <p>Your total score is: {context.totalScore}</p>
          </div>
          <div className='DisplayFeedback'>
            <p> The correct translation for {context.currentWord} was{' '} {context.answer} and you chose {context.guess}! </p>
          </div>
          <button onClick={() => context.setIsCorrect(null)}> Try another word! </button>
        </div>
      </section>
    );
  }
  return '';
}
