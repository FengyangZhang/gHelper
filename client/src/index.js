import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {
    BrowserRouter as Router,
    Route,
} from 'react-router-dom';
import AddPanel from "./AddPanel";
import SongList from "./SongList";

const routes = (
    <Router>
        
        <div className="mainDiv">
        <Route path="/" exact component={App} />
        <Route path = "/songlist" component = {SongList}/>
        <Route path = "/addpanel" component = {AddPanel}/>
        </div>
        
    </Router>
  );
ReactDOM.render(routes, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();