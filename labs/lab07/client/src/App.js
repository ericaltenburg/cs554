import React from 'react';
import logo from './img/marvel-logo-header.jpeg';
import './App.css';
import Home from './components/Home';
import CharacterList from './components/CharacterList';
import Character from './components/Character';
import ComicList from './components/ComicList';
import Comic from './components/Comic';
import SeriesList from './components/SeriesList';
import Series from './components/Series';
import {
  BrowserRouter as Router,
  Route,
  Link
} from "react-router-dom";

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to Lab 4, Sit Back, Relax, and Look at Stuff</h1>
                    <Link className="showlink" to="/">
                        Home
                    </Link>
                    <Link className="showlink" to="/characters/page/0">
                        Characters
                    </Link>
                    <Link className="showlink" to="/comics/page/0">
                        Comics
                    </Link>
                    <Link className="showlink" to="/series/page/0">
                        Series
                    </Link>
                </header>
                <br />
                <br />
                <div className="App-body">
                    <Route exact path="/">
                        <Home />
                    </Route>
                    <Route exact path="/characters/page/:page">
                        <CharacterList />
                    </Route>
                    <Route exact path="/characters/:id">
                        <Character />
                    </Route>
                    <Route exact path="/comics/page/:page">
                        <ComicList />
                    </Route>
                    <Route exact path="/comics/:id">
                        <Comic />
                    </Route>
                    <Route exact path="/series/page/:page">
                        <SeriesList />
                    </Route>
                    <Route exact path="/series/:id">
                        <Series />
                    </Route>
                </div>
            </div>
        </Router>
    );
}

export default App; 
