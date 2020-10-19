import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import UserContext from '../../contexts/UserContext';
import TokenService from '../../services/token-service';
import config from '../../config';
import Button from '../Button/Button';
import './dashboard.css';

export default class Dashboard extends Component {
  state = {
    error: null,
  };

  static contextType = UserContext;

  getData = () => {
    return fetch(`${config.API_ENDPOINT}/language`, {
      method: 'GET',
      headers: {
        authorization: `bearer ${TokenService.getAuthToken()}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        this.context.setWords(res.words);
        this.context.setLanguage(res.language);
      })
      .then(() => this.context.setIsLoading(false))

      .catch((error) => this.setState({ error: error }));
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    if (this.context.isLoading == true) {
      return <div>Loading...</div>;
    }
    return (
      <div className='dashboard-container'>
        <h3>Dashboard</h3>
        Total correct answers:
        {!this.context.language.total_score ? 0 : this.context.language.total_score}
        <h2 className='dashboard-header'>
          <Link to='/learn'><Button>Start practicing</Button></Link>
        </h2>
        <h3>Words to practice</h3>
        <ul className='wordlist'>
          {this.context.words.map((word) => (
            <li className='eachword' key={word.id}>
              <h4>{word.original}</h4>
              <span>correct answer count: {word.correct_count}</span>
              <span>incorrect answer count: {word.incorrect_count}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
