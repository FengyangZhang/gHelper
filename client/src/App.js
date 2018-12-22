import React, { Component } from "react";
import {Link} from 'react-router-dom';
require('./css/App.css');

class App extends Component {
    render() {
        return (
            <div className="APP">
                <div className="upperDiv">
                    <button className="menuButton"><Link to="/songlist">See listed songs</Link></button>
                </div>
                <div className="lowerDiv">
                    <button className="menuButton"><Link to="/addpanel">Go to add songs</Link></button>
                </div>
            </div>
        );
    }
}

export default App;
