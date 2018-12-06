import React, { Component } from "react";
import AddPanel from "./AddPanel";
import SongList from "./SongList";
import {Link} from 'react-router-dom';

class App extends Component {
    render() {
        return (
            <div className="APP">
                <button className="menuButton"><Link to="/Home">Home</Link></button>
                <button className="menuButton"><Link to="/SongList">See listed songs</Link></button>
                <button className="menuButton"><Link to="/AddPanel">Go to add songs</Link></button>
            </div>
        );
    }
}

export default App;
