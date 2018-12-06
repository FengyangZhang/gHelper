import React, { Component } from "react";
import axios from "axios";
require('./css/SongList.css');

export default class SongList extends Component {
    constructor(props){
        super(props);
        this.state = {
          data: [],
          intervalIsSet: false,
          modifying: -1,
          msingerName: "",
          mmode: "",
          mgenre: "",
          mchords: "",
        };
    }

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
    
    setModifying(index, singerName, genre, mode, chords) {
        this.setState({
          modifying: index,
          msingerName: singerName,
          mgenre: genre,
          mmode: mode,
          mchords: chords,
        })
    }

    render() {
        return (
        <div>
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
                  value={this.state.msingerName}
                  onChange={e=>this.setState({msingerName: e.target.value})}></input>
                <br />
                <span style={{ color: "gray" }}> Genre: </span>
                <input type='text' 
                  value={this.state.mgenre}
                  onChange={e=>this.setState({mgenre: e.target.value})}></input>
                <br />
                <span style={{ color: "gray" }}> Mode: </span>
                <input type='text' 
                  value={this.state.mmode}
                  onChange={e=>this.setState({mmode: e.target.value})}></input>
                <br />
                <span style={{ color: "gray" }}> Chords: </span>
                <input type='text' 
                  value={this.state.mchords}
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
                <span style={{ color: "gray" }}> Chords: </span><label className="infoText">{dat.chords}</label>
              </li>
              <button onClick={() => this.deleteFromDB(dat.songName)}>Delete</button>
              <button onClick={() => this.setModifying(index, dat.singerName, dat.genre, dat.mode, dat.chords)}>Modify</button>
              </div>)
              
            ))}
      </ul>
      </div>
      )}
}