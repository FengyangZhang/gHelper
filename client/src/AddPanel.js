import React, { Component } from "react";
import axios from "axios";
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
            imgUrl: "",
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
        if(chordsInput === "") {
          return;
        }
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
        axios.get("/api/getChordImage", {
          params: {
              chord: this.state.partAndChords[partIndex].chordsOfPart[chordIndex]
          }
        })
        .then(response => {
          if(JSON.stringify(response.data) === "{}") {
            this.setState({imgUrl: require('./pic/cantfind.png')})
          }
          else{
            this.setState({imgUrl: response.data});            
          }
        })
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

      onDeleteChord(partIndex, chordIndex) {
        var cur = this.state.partAndChords;
        cur[partIndex].chordsOfPart.splice(chordIndex, 1);
        this.setState({
          partAndChords: cur,
          chosenPart: -1,
          chosenChord: -1,
        })
      }

      render() {
        const currentChords = this.state.partAndChords.map((entry, index) => {
            const chordsButtons = entry.chordsOfPart.map((chord, chordIndex) => {
              if(index === this.state.chosenPart && chordIndex === this.state.chosenChord) {
                return <div id="chordButtonOuter" key={chordIndex}>
                  <button className="chordButtonChosen" onClick={() => this.onResetChord()}>{chord}</button>
                  <button id="chordButtonInner" onClick={() => this.onDeleteChord(index, chordIndex)}></button>
                </div>
              }
              else {
                return <div id="chordButtonOuter" key={chordIndex}>
                  <button className="chordButton" onClick={() => this.onChooseChord(index, chordIndex)}> {chord}</button>
                </div>
              }
            });
            return <div className="chordEntryDiv" key={index}> {entry.part + "   " }{chordsButtons}</div>
        })


        const chordImg = this.state.chosenChord !== -1 ?
          <div>
            <img alt="chord" src={this.state.imgUrl} width="100px"/> 
            <i>Chords images are fetched from Chordie.com</i>
          </div>
          : 
          <br/>
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
            <select className = "modeNameList"
              style={{ width: "200px" }}
              placeholder="调式名"
              value={this.state.mode}
              onChange={e=>this.setState({mode: e.target.value})}>
                <option value=""> 选择调式：</option>
                <option value="C大调"> C大调</option>
                <option value="Db大调"> Db大调</option>
                <option value="D大调"> D大调</option>
                <option value="Eb大调"> Eb大调</option>
                <option value="E大调"> E大调</option>
                <option value="F大调"> F大调</option>
                <option value="Gb大调"> Gb大调</option>
                <option value="G大调"> G大调</option>
                <option value="Ab大调"> Ab大调</option>
                <option value="A大调"> A大调</option>
                <option value="Bb大调"> Bb大调</option>
                <option value="B大调"> B大调</option>
                <option value="a小调"> a小调</option>
                <option value="bb小调"> bb小调</option>
                <option value="b小调"> b小调</option>
                <option value="c小调"> c小调</option>
                <option value="c#小调"> c#小调</option>
                <option value="d小调"> d小调</option>
                <option value="eb小调"> eb小调</option>
                <option value="e小调"> e小调</option>
                <option value="f小调"> f小调</option>
                <option value="f#小调"> f#小调</option>
                <option value="g小调"> g小调</option>
                <option value="g#小调"> g#小调</option>
            </select>
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
          {chordImg}
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