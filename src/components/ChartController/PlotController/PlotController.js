import React, { Component, Fragment } from 'react';
//import update from 'immutability-helper';

import { } from "../../../functions/myMath";

import ToggleArrow from "./ToggleArrow";
import TrashIcon from "./TrashIcon";
import PencilIcon from "./PencilIcon";
import BasicOptions from "./BasicOptions";
import AdvancedOptions from "./AdvancedOptions";

import "./PlotController.css";


function EditPlotNameButton(props) {
	const iconClass = (props.editing)? "fa fa-check": "fa fa-pencil";

	return (<Fragment>
				<button className="icon-button"	
					onClick={(e) =>props.onClick(e)}
				>
					<i className={iconClass}/>
				</button>
			</Fragment>
	);
}

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
		e.stopPropagation();
		const msg = `Do you really want to delete "${this.props.plotName}"?`;
		if ( window.confirm(msg) ) {
			this.props.deletePlot(this.props.plotId);
		}
	}

	handlePlotNameChange = (e) => {
		this.props.handlePlotNameChange(this.props.plotId, e.target.value);
	}

	renderPlotControllerBar = () => {
		return (
			<div className="plot-controller-dropbutton"
				onClick={this.togglePlotOptions}
			>
				<ToggleArrow 
					menuOpen={this.state.show}
				/>
				<input 
					type="text" 
					value={this.props.plotName} 
					disabled={!this.state.enteringName}
					onChange={(e) => this.handlePlotNameChange(e)}
				/>
				<EditPlotNameButton 
					editing={this.state.enteringName}
					onClick={this.togglePlotNameInput}
				/>
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