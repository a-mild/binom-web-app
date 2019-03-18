import React, { Component } from 'react';

import ToggleArrow from "../ToggleArrow";

import "./PlotSubMenu.css";

class PlotSubMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {show: this.props.open};
    }

    toggleOptions = () => {
        this.setState(prevState => {
            return {show: !prevState.show}});
    }

    render() {
        const style = (this.state.show)? {} : {display: "none"}
        return (
            <div className="plot-submenu">
                <div
                    className="plot-submenu-bar"
                    onClick={this.toggleOptions}
                >
                    <ToggleArrow menuOpen={this.state.show}/>
                    {this.props.name}
                </div>
                <div 
                    className="plot-submenu-content" 
                    style={style}
                >
                    {this.props.children}
                </div>
            </div>
            )
    }
}


export default PlotSubMenu;