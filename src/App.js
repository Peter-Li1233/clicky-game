import React, { Component } from 'react';
import API from './utils/API';
import './App.css';

import Table from './components/Table';
import Scorebar from './components/Scorebar';

import {
    DEFAULT_QUERY,
    PATH_BASE,
    PATH_SEARCH,
    ACCESS_KEY,
    PARAM_SEARCH,
    PARAM_PAGE
} from './constants/index';


class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
    results: null,
    searchKey: '',
    searchTerm: DEFAULT_QUERY,
    error: null,
    score: null,
    clickedId: []
    };

    this.needsToSearchPhotos = this.needsToSearchPhotos.bind(this)
    this.setSearchPhotos = this.setSearchPhotos.bind(this);
    this.fetchSearchPhotos = this.fetchSearchPhotos.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this)
    this.onClick = this.onClick.bind(this);
  }

  needsToSearchPhotos(searchTerm) {
    return !this.state.results[searchTerm];
  }

  setSearchPhotos(result) {
    const {searchKey, results} = this.state;

    if (!(results && results[searchKey])) {
      this.setState({
        results: {
          ...results,
          [searchKey]: result
        }
      });
    }
  }

  fetchSearchPhotos(searchTerm) {
    let url =`${PATH_BASE}${PATH_SEARCH}?${ACCESS_KEY}&${PARAM_PAGE}&${PARAM_SEARCH}${searchTerm}`;
    console.log(url);

    API.getPhotos(url)
      .then(data => this._isMounted && this.setSearchPhotos(data.data.results))
      .catch(error => this._isMounted && this.setState({error}));
  }

  onSearchChange(event) {
    this.setState({searchTerm: event.target.value});
  }

  onSearchSubmit(event) {
    const{searchTerm} = this.state;
    this.setState({
      searchKey:searchTerm,
      score: null
    });

    if (this.needsToSearchPhotos(searchTerm)) {
      this.fetchSearchPhotos(searchTerm);
    }
    event.preventDefault();
  }

  onClick(id) {
    console.log(id);
    const {results, searchKey, clickedId, score} = this.state;

    const randomnized_array = (arr) => {
          /* [ Fisher-Yates shuffle. can be used on array-like object
          Modify array inplace.
          http://xahlee.info/js/javascript_random_array.html
          version 2017-09-18
          ] */
              let i = arr.length - 1;
              let j;
              while (i >= 1) {
                  // random element up to i, include i
                  j = Math.floor( Math.random() * ( i + 1 ) );
                  [arr[i], arr[j]] = [arr[j], arr[i]];
                  i--;
              }
              return arr;
          };

    const oldResult = results[searchKey];

    if (!clickedId.includes(id)) {
       clickedId.push(id);
       const updatedResult = randomnized_array(oldResult);

       this.setState({
         score:score+1,
         results: {
          ...results,
          [searchKey] : updatedResult}
       });         
    } else {
      this.setState({
        clickedId:[],
        score:0
      });
    }

    // console.log(this.state.clickedId);
    // console.log(this.state.score);
  }


  componentDidMount() {
    this._isMounted = true;

    const {searchTerm} = this.state;
    this.setState({searchKey: searchTerm});
    this.fetchSearchPhotos(searchTerm);
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    const {results, searchTerm, searchKey, score} = this.state;

    let gameResult;
    if (score === 0) {
      gameResult = 'Sorry, You Lost'
    } else if (score === 12) {
      gameResult = 'Congratulation, You Win!'
    } else if (score <12 && score >0 ) {
      gameResult = 'Good Job, Keep up!'
    }

    const list = (
                  results && 
                  results[searchKey]
                  ) || [];

    return (
      <div className="page">
        <Scorebar score = {score} searchTerm = {searchTerm} onSearchChange = {this.onSearchChange} onSearchSubmit ={this.onSearchSubmit}>
          {gameResult}
        </Scorebar>
        {/* <Search 
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >
            Search
        </Search> */}
        <Table
          onClick={this.onClick}
          list = {list}
          searchKey={this.state.searchKey}
        />
      </div>
    );
  }
};

export default App;
