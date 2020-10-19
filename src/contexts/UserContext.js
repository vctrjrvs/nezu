import React, { Component } from 'react';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';

const UserContext = React.createContext({
  user: {},
  error: null,
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  processLogin: () => {},
  processLogout: () => {},
  language: null,
  words: [],
  totalScore: null,
  nextWord: {},
  currentWord: {},
  guess: null,
  setLanguage: () => {},
  setWords: () => {},
  setNextWord: () => {},
  setScore: () => {},
  setCurrentWord: () => {},
  setGuess: () => {},
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    const state = {
      user: {},
      error: null,
      language: null,
      words: [],
      totalScore: 0,
      nextWord: [],
      currentWord: null,
      guess: null,
      isLoading: true,
      isCorrect: null,
    };

    const jwtPayload = TokenService.parseAuthToken();

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      };

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle);
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets();
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets();
    TokenService.clearCallbackBeforeExpiry();
  }
  setAnswer = (data) => {
    this.setState({ answer: data });
  };

  setIsLoading = (bool) => {
    this.setState({ isLoading: bool });
  };
  setIsCorrect = (bool) => {
    this.setState({ isCorrect: bool });
  };

  setLanguage = (language) => {
    this.setState({ language });
  };
  setWords = (words) => {
    this.setState({ words });
  };
  setNextWord = (nextWord) => {
    this.setState({ nextWord });
  };
  setScore = (totalScore) => {
    this.setState({ totalScore });
  };
  setCurrentWord = (currentWord) => {
    this.setState({ currentWord });
  };
  setGuess = (guess) => {
    this.setState({ guess });
  };

  setError = (error) => {
    console.error(error);
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setUser = (user) => {
    this.setState({ user });
  };

  processLogin = (authToken) => {
    TokenService.saveAuthToken(authToken);
    const jwtPayload = TokenService.parseAuthToken();
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    });
    IdleService.regiserIdleTimerResets();
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken();
    });
  };

  processLogout = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({});
  };

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({ idle: true });
  };

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken();
        });
      })
      .catch((err) => {
        this.setError(err);
      });
  };

  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      language: this.state.language,
      words: this.state.words,
      totalScore: this.state.totalScore,
      nextWord: this.state.nextWord,
      currentWord: this.state.currentWord,
      guess: this.state.guess,
      setError: this.setError,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
      setLanguage: this.setLanguage,
      setWords: this.setWords,
      setNextWord: this.setNextWord,
      setScore: this.setScore,
      setCurrentWord: this.setCurrentWord,
      setGuess: this.setGuess,
      isLoading: this.state.isLoading,
      setIsLoading: this.setIsLoading,
      isCorrect: this.state.isCorrect,
      setIsCorrect: this.setIsCorrect,
      setAnswer: this.setAnswer,
      answer: this.state.answer,
    };
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
