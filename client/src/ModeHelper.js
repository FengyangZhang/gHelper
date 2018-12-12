import React, { Component } from "react";
require('./css/ModeHelper.css');

export default class ModeHelper extends Component {
    constructor(props){
        super(props);
        this.state = {
            showNotes: true,
        };
        this.modeToPitches(this.props.mode);
    }

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
                notesInMode.push(note);
                lastNote = note;
                break;
            }
            if(note.includes('/')){
                var n1 = note.split('/')[0];
                var n2 = note.split('/')[1];
                if(n1 === modeName) {
                    notesInMode.push(n1);
                    lastNote = n1;
                    break;
                }
                else if(n2 === modeName) {
                    notesInMode.push(n2);
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
            notesInMode.push(curNote);
            lastNote = curNote;
        });
        var chordsInMode = [];
        //大小一，四，五级和弦为大三和弦，小调则是三，六，七级，大调七级为减三和弦，小调二级。
        const majors = isMajor ? [1, 4, 5] : [3, 6, 7];
        const dims = isMajor ? [7] : [2];
        notesInMode.slice(0, 7).forEach((note, index) => {
            if(dims.includes(index+1)){
                chordsInMode.push(note+"dim");
            }
            else if(majors.includes(index+1)){
                chordsInMode.push(note);
            }
            else{
                chordsInMode.push(note+"m");
            }
        });
        
        this.notesInMode = notesInMode;
        this.chordsInMode = chordsInMode;
    }

    switchNotesAndChords(){
        this.setState({
            showNotes: !this.state.showNotes,
        })
    }

    render() {
        const intro = this.state.showNotes ? 
            this.props.mode + "的构成音如下: ":
            this.props.mode + "的构成和弦如下: ";
        const switchButton = this.state.showNotes ? 
            <button onClick={()=>this.switchNotesAndChords()}>See chords</button> :
            <button onClick={()=>this.switchNotesAndChords()}>See notes</button>;

        const rendered = this.state.showNotes ? 
            this.notesInMode.map((note, index) => {
                return <i key={index}>{note+"\t"}</i>
            })
            : 
            this.chordsInMode.map((note, index) => {
                return <i key={index}>{note+"\t"}</i>
            });
        return (
            <div className="modeHelperDiv">
                {intro}
                {rendered}
                {switchButton}
            </div>
        );
    }
}