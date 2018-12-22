import React, { Component } from "react";
import {Link} from 'react-router-dom';
require('./css/App.css');

class App extends Component {
    render() {
        return (
            <div className="APP">
                <Link to="/songlist" style={{ textDecoration: 'none', color: 'black'}}>
                    <div className="upperDiv">
                        <div className="bgDiv">
                        </div>
                        <div className="textDiv">
                            <font className="entryText" size="3">See listed songs</font>
                        </div>
                    </div>
                </Link>
                <Link to="/addpanel" style={{ textDecoration: 'none', color: 'black'}}>
                    <div className="lowerDiv">
                        <div className="bgDiv">
                        </div>
                        <div className="textDiv">
                            <font className="entryText" size="3">Add songs</font>
                        </div>
                    </div>
                </Link>
            </div>
        );
    }
}

export default App;
