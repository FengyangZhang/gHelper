import React, { Component } from "react";
require('./css/ModeHelper.css');

export default class ModeHelper extends Component {

    modeToPitches(mode) {
        const isMajor = mode.indexOf("大") !== -1 ? 1 : 0;
        const modeName = isMajor ? mode.substring(0, mode.indexOf("大")) 
            : mode.substring(0, 1).toUpperCase()+mode.substring(1, mode.indexOf("小"));
        const intervals = isMajor ? [0, 2, 2, 1, 2, 2, 2, 1] : [0, 2, 1, 2, 2, 1, 2, 2];
        const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "#F/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
        var pos = 0;
        for (let note of notes){
            if(note === modeName) {
                break;
            }
            if(note.includes('/')){
                var n1 = note.split('/')[0];
                var n2 = note.split('/')[1];
                if(n1 === modeName || n2 === modeName) {
                    break;
                }
            }
            pos += 1;
        }
        var notesInMode = [];
        intervals.forEach((interval, index)=>{
            pos = (pos + interval) % 12;
            notesInMode.push(<i key={index}>{notes[pos]+'\t'}</i>);
        });
        return <i>{notesInMode}</i>;
    }


    render() {
        return (
            <div className="modeHelperDiv">
                {this.props.mode}，构成音如下: {this.modeToPitches(this.props.mode)}
            </div>
        );
    }
}