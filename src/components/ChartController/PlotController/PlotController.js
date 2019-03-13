import React, { Component } from 'react';
//import update from 'immutability-helper';

import { } from "../../../functions/myMath";

import ToggleArrow from "./ToggleArrow";
import TrashIcon from "./TrashIcon";
import PencilIcon from "./PencilIcon";
import BasicOptions from "./BasicOptions";
import AdvancedOptions from "./AdvancedOptions";

import "./PlotController.css";


class PlotController extends Component {
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
		this.props.deletePlot(this.props.plotId);
	}

	changePlotName = (e) => {
		this.props.changePlotName(this.props.plotId, e.target.value);
	}

	renderPlotControllerBar = () => {
		return (
			<div className="plot-controller-dropbutton"
				onClick={this.togglePlotOptions}
			>
				<ToggleArrow menuOpen={this.state.show}/>
				<input 
					type="text" 
					value={this.props.plotName} 
					disabled={!this.state.enteringName}
					onChange={(e) => this.changePlotName(e)}
				/>
				<button className="icon-button" 
					onClick={(e) => this.togglePlotNameInput(e)}>
				<i className="fa fa-pencil"/>
				</button>
				<button className="icon-button" 
					onClick={(e) => this.deletePlot(e)}>
				<i className="fa fa-trash"/>
				</button>
			</div>
		);
	}

	render() {
		const style = this.state.show ? {} : {display: "none"};

		return (
			<div className="plot-controller-container">
				{this.renderPlotControllerBar()}
				<div 
					className="plot-controller-content"
					style={style}
				>
					{this.props.children}
				</div>
			</div>
			);
	}
}

export default PlotController;