import React, { Component } from "react";
import axios from "axios";
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
        };
    }

    putDataToDB = (songName, singerName, mode, partAndChords, genre) => {
        var chords = "";
        partAndChords.map((entry, index)=>{
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

      render() {
        const currentChords = this.state.partAndChords.map((entry, index) => {
            return <p key={index}> {entry.part + "     " + entry.chordsOfPart}</p>
        })
        return (
        <div className="songChordInputs">
          <div className="twoInputDiv" style={{ padding: "10px" }}>
            Name of the song:
            <input className="standardInput"
              type="text"
              onChange={e => this.setState({ songName: e.target.value })}
              placeholder=""
              value={this.state.songName}
              style={{ width: "200px" }}
            />
            Singer:
            <input className="standardInput"
              type="text"
              style={{ width: "200px" }}
              onChange={e => this.setState({ singerName: e.target.value })}
              placeholder=""
              value={this.state.singerName}
            />
          </div>
          <div className="twoInputDiv" style={{ padding: "10px" }}>
            Genre of the song:
            <input className="standardInput"
              type="text"
              onChange={e => this.setState({ genre: e.target.value })}
              placeholder=""
              style={{ width: "200px" }}
              value={this.state.genre}
            />
            Mode of the song:
            <input className="standardInput"
              type="text"
              onChange={e => this.setState({ mode: e.target.value })}
              placeholder=""
              style={{ width: "200px" }}
              value={this.state.mode}
            />
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
              placeholder=""
              value={this.state.chordsInput}
              style={{ width: "200px" }}
            />
            <button onClick={() => this.addChords(this.state.partOfSong, this.state.chordsInput)}>ADD</button>
          </div>
          <div>
            {currentChords}
          </div>

          <div>
            <button className="addButton" onClick={() => this.putDataToDB(this.state.songName, this.state.singerName, 
              this.state.mode, this.state.partAndChords, this.state.genre)}>
              DONE
            </button>
          </div>
        </div>
          );
      }
}