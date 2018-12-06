import React, { Component } from "react";
import AddPanel from "./AddPanel";
import SongList from "./SongList";

class App extends Component {
    render() {
        return (
            <div className="APP">
                <SongList />            
                <AddPanel />
            </div>
        );
    }
}

export default App;
