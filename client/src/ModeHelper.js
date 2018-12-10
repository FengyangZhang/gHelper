import React, { Component } from "react";
require('./css/ModeHelper.css');

export default class ModeHelper extends Component {

    modeToPitches(mode) {
        const isMajor = mode.indexOf("大") !== -1 ? 1 : 0;
        const modeName = isMajor ? mode.substring(0, mode.indexOf("大")) 
            : mode.substring(0, 1).toUpperCase()+mode.substring(1, mode.indexOf("小"));
        const intervals = isMajor ? [2, 2, 1, 2, 2, 2, 1] : [2, 1, 2, 2, 1, 2, 2];
        const notes = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B/Cb"];
        var notesInMode = [];
        var pos = 0;
        var lastNote;
        for (let note of notes){
            if(note === modeName) {
                notesInMode.push(<i key={0}>{note+'\t'}</i>);
                lastNote = note;
                break;
            }
            if(note.includes('/')){
                var n1 = note.split('/')[0];
                var n2 = note.split('/')[1];
                if(n1 === modeName) {
                    notesInMode.push(<i key={0}>{n1+'\t'}</i>);
                    lastNote = n1;
                    break;
                }
                else if(n2 === modeName) {
                    notesInMode.push(<i key={0}>{n2+'\t'}</i>);
                    lastNote = n2;
                    break;
                }
            }
            pos += 1;
        }
        intervals.forEach((interval, index)=>{
            pos = (pos + interval) % 12;
            let curNote = notes[pos];
            if(notes[pos].includes('/')) {
                let n1 = notes[pos].split('/')[0];
                let n2 = notes[pos].split('/')[1];
                curNote = n1;
                if(n1.substring(0, 1) === lastNote.substring(0, 1)){
                    curNote = n2;
                }
            }
            notesInMode.push(<i key={index+1}>{curNote+'\t'}</i>);
            lastNote = curNote;
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