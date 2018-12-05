import React, { Component } from "react";
import axios from "axios";

export default class SongList extends Component {
    constructor(props){
        super(props);
        this.state = {
            modifying: -1,
            msingerName: "",
            mmode: "",
            mgenre: "",
            mchords: "",
        };
    }
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
        return (<ul>
        {this.props.data.length <= 0
          ? "NO SONG LISTED YET"
          : this.props.data.map((dat, index) => (
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
                <span style={{ color: "gray" }}> Chords: </span>{dat.chords}
              </li>
              <button onClick={() => this.deleteFromDB(dat.songName)}>Delete</button>
              <button onClick={() => this.setModifying(index, dat.singerName, dat.genre, dat.mode, dat.chords)}>Modify</button>
              </div>)
              
            ))}
      </ul>)
    }
}