import React, { Component } from "react";
import axios from "axios";
import SongList from "./SongList";
require('./css/MainPanel.css');

export default class MainPanel extends Component {
  state = {
    data: [],
    intervalIsSet: false,
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

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

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
      <div>
        <div>
          <SongList data={this.state.data}/>     
        </div>
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
      </div>
    );
  }
}
