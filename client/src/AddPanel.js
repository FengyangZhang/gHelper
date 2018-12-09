import React, { Component } from "react";
import axios from "axios";
import ChordHelper from "./ChordHelper";
import ModeHelper from "./ModeHelper";
require('./css/AddPanel.css');

export default class AddPanel extends Component {
    constructor(props){
        super(props);
        this.state = {
            songName: "",
            singerName: "",
            mode: "",
            genre: "",
            partOfSong: "verse",
            chordsInput: "",
            partAndChords: [{
              part: "verse",
              chordsOfPart: [],
            }, {
              part: "chorus",
              chordsOfPart: [],
            }, {
              part: "solo",
              chordsOfPart: [],
            }],
            chosenPart: -1,
            chosenChord: -1,
        };
    }

    putDataToDB = (songName, singerName, mode, partAndChords, genre) => {
        var chords = "";
        partAndChords.forEach((entry, index)=>{
            chords += entry.part + ":" + entry.chordsOfPart + '\n';      
        })
        this.setState({
          singerName: "",
          songName: "",
          mode: "",
          genre: "",
          partAndChords: [{
            part: "verse",
            chordsOfPart: [],
          }, {
            part: "chorus",
            chordsOfPart: [],
          }, {
            part: "solo",
            chordsOfPart: [],
          }],
          chosenChord: -1,
          chosenPart: -1,
        });
        axios.post("/api/putData", {
          songName: songName,
          singerName: singerName,
          mode: mode,
          chords: chords,
          genre: genre,
        });
      };
    
      addChords(partOfSong, chordsInput){
        var cur = this.state.partAndChords;
        var p = 0;
        if(partOfSong === "verse") {
          p = 0;
        }
        else if(partOfSong === "chorus") {
          p = 1;
        }
        else {
          p = 2;
        }
        cur[p].chordsOfPart.push(chordsInput);
        this.setState({
          chordsInput: "",
          partAndChords: cur,
        })
      }

      onChooseChord(partIndex, chordIndex) {
        this.setState({
          chosenPart: partIndex,
          chosenChord: chordIndex,
        });
      }

      onResetChord() {
        this.setState({
          chosenPart: -1,
          chosenChord: -1,
        })
      }

      render() {
        const currentChords = this.state.partAndChords.map((entry, index) => {
            const chordsButtons = entry.chordsOfPart.map((chord, chordIndex) => {
              if(index === this.state.chosenPart && chordIndex === this.state.chosenChord) {
                return <button className="chordButtonChosen" onClick={() => this.onResetChord()}>{chord}</button>
              }
              else {
                return <button className="chordButton" onClick={() => this.onChooseChord(index, chordIndex)}> {chord}</button>
              }
            });
            return <p key={index}> {entry.part + "   " }{chordsButtons}</p>
        })
        return (
        <div className="songChordInputs">
          <div className="twoInputDiv" style={{ padding: "10px" }}>
            Name of the song:
            <input className="standardInput"
              type="text"
              onChange={e => this.setState({ songName: e.target.value })}
              placeholder="歌曲名"
              value={this.state.songName}
              style={{ width: "200px" }}
            />
            Singer:
            <input className="standardInput"
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ singerName: e.target.value })}
              placeholder="歌手/乐队名"
              value={this.state.singerName}
            />
          </div>
          <div className="twoInputDiv" style={{ padding: "10px" }}>
            Genre of the song:
            <input className="standardInput"
              type="text"
              onChange={e => this.setState({ genre: e.target.value })}
              placeholder="歌曲类别"
              style={{ width: "200px" }}
              value={this.state.genre}
            />
            Mode:{"\t"}
            <input list="modes" 
              placeholder="调式名"
              onChange={e => this.setState({ mode: e.target.value })}
              style={{ width: "200px" }}
              value={this.state.mode}
              />
            <datalist id="modes">
                <option value="C大调"/>
                <option value="C小调"/>
                <option value="A大调"/>
            </datalist>
            {this.state.mode !== "" ? <ModeHelper mode={this.state.mode} /> : <br />}
          </div>
          <div style={{ padding: "10px" }}>
            <p>chords in the song(you can choose verse, chorus, etc.):</p>
            <select className = "partOfSongSelector"
              onChange={e=>this.setState({partOfSong: e.target.value})}>
              <option value ="verse">verse</option>
              <option value ="chorus">chorus</option>
              <option value ="solo">solo</option>
            </select>
            <input
              type="text"
              onChange={e => this.setState({ chordsInput: e.target.value })}
              placeholder="和弦名称"
              value={this.state.chordsInput}
              style={{ width: "200px" }}
            />
            <button className="addButton" onClick={() => this.addChords(this.state.partOfSong, this.state.chordsInput)}>ADD</button>
          </div>
          <div>
            {currentChords}
          </div>
          {this.state.chosenChord !== -1 ? <ChordHelper chord= {this.state.partAndChords[this.state.chosenPart].chordsOfPart[this.state.chosenChord]} /> : <br/>}
          <div>
            <button className="doneButton" onClick={() => this.putDataToDB(this.state.songName, this.state.singerName, 
              this.state.mode, this.state.partAndChords, this.state.genre)}>
              DONE
            </button>
          </div>
        </div>
          );
      }
}