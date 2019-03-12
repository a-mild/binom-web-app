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
		this.setState({show: !this.state.show});
	}

	deletePlot = (e) => {
		this.props.deletePlot(this.props.plotId);
	}

	changePlotName = (e) => {
		//e.stopPropagation();
		this.setState(prevState => {
			return {enteringName: !prevState.enteringName}
		});
	}

	PlotButton = () => {
		const name = this.props.plotOptions.name;

		const plotNameInput = <input type="text" value={name} disabled={!this.state.enteringName}/>
		return (
			<div 
				className="plot-options-dropbutton"
				onClick={this.togglePlotOptions}
			>
				<ToggleArrow show={this.state.show}/> {plotNameInput}
				
					<button className="icon-button" 
						onClick={(e) => this.changePlotName(e)}>
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
		const basicOptionsFunctions = {
			onNChange: this.props.onNChange,
			onPChange: this.props.onPChange,
			onColorChange: this.props.onColorChange,
		};

		const furtherOptionsFunctions = {
			onSigmaRadiusChange: this.props.onSigmaRadiusChange,
			toggleSigmaRadius: this.props.toggleSigmaRadius,
		};

		return (
			<div className="plot-controller-container">
				{this.PlotButton()}
				<div 
					className="plot-options-container"
					style={this.state.show ? {display: "block"} : {display: "none"}}
				>
					<BasicOptions
						plotId={this.props.plotId}
						plotOptions={this.props.plotOptions}
						functions={basicOptionsFunctions}
					/>
					<AdvancedOptions
						plotId={this.props.plotId}
						plotOptions={this.props.plotOptions}
						functions={furtherOptionsFunctions}
					/>
				</div>
			</div>
			);
	}
}

export default PlotController;