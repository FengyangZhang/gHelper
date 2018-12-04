import React, { Component } from "react";
import axios from "axios";
require('./SongLists.css');

export default class SongLists extends Component {
  // initialize our state 
  state = {
    data: [],
    intervalIsSet: false,
    songName: "Unknown",
    singerName: "Unknown",
    mode: "Unknown",
    genre: "Unknown",
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
    modifying: -1,
    msingerName: "Unknown",
    mmode: "Unknown",
    mgenre: "Unknown",
    mchords: "Unknown",
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

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = (songName, singerName, mode, partAndChords, genre) => {
    var chords = "";
    partAndChords.map((entry, index)=>{
        chords += entry.part + ":" + entry.chordsOfPart + '\n';      
    })
    this.setState({
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

  deleteFromDB = songToDelete => {
    axios.delete("/api/deleteData", {
      data: {
        songName: songToDelete
      }
    });
  };

  updateDB = (index, songName, singerName, genre, mode, chords) => {
    this.setState({
      modifying: -1,
    })
    axios.post("/api/updateData", {
      songName: songName,
      update: { singerName: singerName, genre: genre, mode:mode, chords:chords }
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
      partAndChords: cur,
    })
  }

  setModifying(index) {
    this.setState({
      modifying: index,
    })
  }

  render() {
    const currentChords = this.state.partAndChords.map((entry, index) => {
        return <p key={index}> {entry.part + "     " + entry.chordsOfPart}</p>
    })
    const songList = (
      <ul>
          {this.state.data.length <= 0
            ? "NO SONG LISTED YET"
            : this.state.data.map((dat, index) => (
              index === this.state.modifying ? (
                <div className="infoDiv" key={index}>
                <li style={ {padding: "10px", width: "200px"}} >
                  <span style={{ color: "gray" }}> Song: </span>{dat.songName}
                  <br />
                  <span style={{ color: "gray" }}> Singer: </span> 
                  <input type='text' 
                    placeholder={dat.singerName}
                    onChange={e=>this.setState({msingerName: e.target.value})}></input>
                  <br />
                  <span style={{ color: "gray" }}> Genre: </span>
                  <input type='text' 
                    placeholder={dat.genre}
                    onChange={e=>this.setState({mgenre: e.target.value})}></input>
                  <br />
                  <span style={{ color: "gray" }}> Mode: </span>
                  <input type='text' 
                    placeholder={dat.mode}
                    onChange={e=>this.setState({mmode: e.target.value})}></input>
                  <br />
                  <span style={{ color: "gray" }}> Chords: </span>
                  <input type='text' 
                    placeholder={dat.chords}
                    onChange={e=>this.setState({mchords: e.target.value})}></input>
                </li>
                <button onClick={() => this.updateDB(index, dat.songName,
                  this.state.msingerName, this.state.mgenre, this.state.mmode, this.state.mchords)}>Update</button> 
                </div>) : (
                <div className="infoDiv" key={index}>
                <li style={ {padding: "10px", width: "200px"}} >
                  <span style={{ color: "gray" }}> Song: </span>{dat.songName}
                  <br />
                  <span style={{ color: "gray" }}> Singer: </span>{dat.singerName}
                  <br />
                  <span style={{ color: "gray" }}> Genre: </span>{dat.genre}
                  <br />
                  <span style={{ color: "gray" }}> Mode: </span>{dat.mode}
                  <br />
                  <span style={{ color: "gray" }}> Chords: </span>{dat.chords}
                </li>
                <button onClick={() => this.deleteFromDB(dat.songName)}>Delete</button>
                <button onClick={() => this.setModifying(index)}>Modify</button>
                </div>)
                
              ))}
        </ul>
    );
    return (
      <div className="songChordInputs">
        {songList}
        <div className="twoInputDiv" style={{ padding: "10px" }}>
          Name of the song:
          <input className="standardInput"
            type="text"
            onChange={e => this.setState({ songName: e.target.value })}
            placeholder=""
            style={{ width: "200px" }}
          />
          Singer:
          <input className="standardInput"
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ singerName: e.target.value })}
            placeholder=""
          />
        </div>
        <div className="twoInputDiv" style={{ padding: "10px" }}>
          Genre of the song:
          <input className="standardInput"
            type="text"
            onChange={e => this.setState({ genre: e.target.value })}
            placeholder=""
            style={{ width: "200px" }}
          />
          Mode of the song:
          <input className="standardInput"
            type="text"
            onChange={e => this.setState({ mode: e.target.value })}
            placeholder=""
            style={{ width: "200px" }}
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
