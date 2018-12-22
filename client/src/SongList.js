import React, { Component } from "react";
import axios from "axios";
import MainMenu from "./MainMenu";
require('./css/SongList.css');

export default class SongList extends Component {
    constructor(props){
        super(props);
        this.state = {
          data: [],
          intervalIsSet: false,
          modifying: -1,
          msongName: "",
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

    deleteFromDB = idToDelete => {
        axios.delete("/api/deleteData", {
          data: {
            id: idToDelete
          }
        });
    };
    
    updateDB = (index, songName, singerName, genre, mode, chords, id) => {
        this.setState({
            modifying: -1,
        })
        axios.post("/api/updateData", {
            id: id,
            update: { songName: songName, singerName: singerName, genre: genre, mode:mode, chords:chords }
        });
    };
    
    setModifying(index, songName, singerName, genre, mode, chords) {
        this.setState({
          modifying: index,
          msongName: songName,
          msingerName: singerName,
          mgenre: genre,
          mmode: mode,
          mchords: chords,
        })
    }

    render() {
        return (
        <div>
        <MainMenu/>
        <ul>
        {this.state.data.length <= 0
          ? "NO SONG LISTED YET"
          : this.state.data.map((dat, index) => (
            index === this.state.modifying ? (
              <div className="infoDiv" key={index}>
              <li className="songItem" style={ {pwidth: "200px"}} >
                <span style={{ color: "gray" }}> Song: </span>
                <input type='text' 
                  value={this.state.msongName}
                  onChange={e=>this.setState({msongName: e.target.value})}></input>
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
              <button className="leftMargin40Button" onClick={() => this.updateDB(index, this.state.msongName,
                this.state.msingerName, this.state.mgenre, this.state.mmode, this.state.mchords, dat._id)}>Update</button> 
              </div>) : (
              <div className="infoDiv" key={index}>
              <li className="songItem" style={ {width: "200px"}} >
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
              <button className="leftMargin40Button" onClick={() => this.deleteFromDB(dat._id)}>Delete</button>
              <button className="leftMargin20Button" onClick={() => this.setModifying(index, dat.songName, dat.singerName, dat.genre, dat.mode, dat.chords)}>Modify</button>
              </div>)
              
            ))}
      </ul>
      </div>
      )}
}