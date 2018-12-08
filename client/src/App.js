import React, { Component } from "react";
import {Link} from 'react-router-dom';
require('./css/App.css');

class App extends Component {
    render() {
        return (
            <div className="APP">
                <button className="menuButton"><Link to="/">Home</Link></button>
                <button className="menuButton"><Link to="/songlist">See listed songs</Link></button>
                <button className="menuButton"><Link to="/addpanel">Go to add songs</Link></button>
            </div>
        );
    }
}

export default App;
