import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import logo from './logo.svg';
import './App.css';
import Fib from "./Fib";
import OtherPage from "./OtherPage";


const App = () => {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <Link to="/">Home</Link>
                    <br />
                    <Link to="/otherpage">Other Page</Link>
                </header>
                <br />
                <div>
                    <Route exact path="/" component={Fib}/>
                    <Route path="/otherpage" component={OtherPage}/>
                </div>
            </div>
        </Router>
    );
};

export default App;

