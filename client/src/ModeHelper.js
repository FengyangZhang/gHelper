import React, { Component } from "react";
require('./css/ModeHelper.css');

export default class ModeHelper extends Component {

    modeToPitches(mode) {
        const isMajor = mode.indexOf("大") !== -1 ? 1 : 0;
        const modeName = isMajor ? mode.substring(0, mode.indexOf("大")) 
            : mode.substring(0, 1).toUpperCase()+mode.substring(1, mode.indexOf("小"));
        const intervals = isMajor ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];
        const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "#F/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
        return <i>{modeName}</i>;
    }


    render() {
        return (
            <div className="modeHelperDiv">
                {this.props.mode}，构成音如下: {this.modeToPitches(this.props.mode)}
            </div>
        );
    }
}