import React from 'react';
import TokenService from '../services/token-service';
import config from '../config';
import UserContext from '../contexts/UserContext';
import './learn.css';

export default class Learn extends React.Component {

  static contextType = UserContext;

  getTheNextWord = () => {
    return fetch(`${config.API_ENDPOINT}/language/head`, {
      method: 'GET',
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        this.context.setNextWord(data);
      })
      .then(() => this.context.setIsLoading(false))
      .catch((err) => {
        this.context.setError(err);
      });
  };

  submitGuess = (e) => {
    e.preventDefault();
    this.context.setGuess(e.target['learn-guess-input'].value);
    this.context.setCurrentWord(this.context.nextWord.nextWord);
    let body = {
      guess: e.target['learn-guess-input'].value,
    };

    return fetch(`${config.API_ENDPOINT}/language/guess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `bearer ${TokenService.getAuthToken()}`,
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => {
        this.context.setScore(data.totalScore);
        this.context.setAnswer(data.answer);
        this.context.setNextWord(data);
        this.context.setIsCorrect(data.isCorrect);
        this.context.setIsLoading(false);
      });
  };

  componentDidMount() {
    if (!this.context.nextWord.totalScore) {
      this.getTheNextWord();
    }
  }

  render() {
    if (this.context.isLoading == true) {
      return <div>loading...</div>;
    }

    return (
      <div className='learn-container'>
        <section className='learn-data'>
          <p>Your total score is: {this.context.nextWord.totalScore}</p>
          <div className='translate'>
            <h2>Translate the word:</h2>{' '}
            <span className='nextword'>{this.context.nextWord.nextWord}</span>
          </div>
          <div className='answered-info'>
            <p> You have answered this word correctly{' '} {this.context.nextWord.wordCorrectCount} times. </p>
            <p> You have answered this word incorrectly{' '} {this.context.nextWord.wordIncorrectCount} times. </p>
          </div>
        </section>
        <section className='word-guess'>
          <form onSubmit={(e) => {
              this.submitGuess(e);
              e.target['learn-guess-input'].value = '';
            }}>
            <label htmlFor='learn-guess-input' className='guessinput'> What's the translation for this word? </label>
            <input type='text' id='learn-guess-input' name='learn-guess-input' placeholder='Input your answer...' required />
            <button type='submit'>Submit your answer</button>
          </form>
        </section>
      </div>
    );
  }
}
