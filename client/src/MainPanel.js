import React, { Component } from "react";
import axios from "axios";
import SongList from "./SongList";
import AddPanel from "./AddPanel";
require('./css/MainPanel.css');

export default class MainPanel extends Component {
  state = {
    data: [],
    intervalIsSet: false,
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

  render() {
    return (
      <div>
        <SongList data={this.state.data}/>     
        <AddPanel />
      </div>
    );
  }
}
