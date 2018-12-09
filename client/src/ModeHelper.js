import React, { Component } from "react";
require('./css/ModeHelper.css');

export default class ModeHelper extends Component {
    render() {
        return (
            <div className="modeHelperDiv">
                {this.props.mode}，构成音如下:
            </div>
        );
    }
}