import React, { Component } from 'react';

import { } from "../../functions/myMath";

import ToggleArrow from "../ToggleArrow";
import IconButton from "../IconButton";

import "./PlotMenu.css";


class PlotMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            enteringName: false,
        };
    }

    togglePlotOptions = () => {
        if (!this.state.enteringName) {
            this.setState(prevState => {
                return {show: !prevState.show}
            });
        }
    }

    togglePlotNameInput = (e) => {
        e.stopPropagation();
        this.setState(prevState => {
            return {enteringName: !prevState.enteringName}
        });
    }

    deletePlot = (e) => {
        e.stopPropagation();
        const msg = `Do you really want to delete "${this.props.plotName}"?`;
        if ( window.confirm(msg) ) {
            this.props.deletePlot(this.props.plotId);
        }
    }

    handlePlotNameChange = (e) => {
        this.props.handlePlotNameChange(this.props.plotId, e.target.value);
    }

    toggleVisibility = (e) => {
        e.stopPropagation();
        this.props.toggleVisibility(this.props.plotId);
    }

    renderPlotMenuBar = () => {
        return (
            <div className="plot-menu-bar"
                onClick={this.togglePlotOptions}
            >
                <ToggleArrow 
                    menuOpen={this.state.show}
                />
                <input 
                    type="text" 
                    value={this.props.plotName}
                    size="15"
                    maxLength="30"
                    disabled={!this.state.enteringName}
                    onChange={(e) => this.handlePlotNameChange(e)}
                />
                    <IconButton 
                        on={this.state.enteringName}
                        iconOn="fas fa-check"
                        iconOff="fas fa-edit"
                        onClick={this.togglePlotNameInput}
                    />
                    <IconButton
                        on={this.props.visible}
                        iconOn="fas fa-eye"
                        iconOff="fas fa-eye-slash"
                        onClick={this.toggleVisibility}
                    />
                    <IconButton
                        onClick={this.deletePlot}
                        iconClass="fas fa-trash"
                    />
            </div>
        );
    }

    render() {
        const style = (this.state.show)? {} : {display: "none"};

        return (
            <div className="plot-menu-container">
                {this.renderPlotMenuBar()}
                <div 
                    className="plot-menu-content"
                    style={style}
                >
                    {this.props.children}
                </div>
            </div>
            );
    }
}

export default PlotMenu;