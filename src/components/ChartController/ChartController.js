import React, { Component } from 'react';
//import update from 'immutability-helper';

import { } from "../../functions/myMath";

import PlotController from "./PlotController/PlotController";

import "./ChartController.css";

class ChartController extends Component {
	render() {
		const plotData = this.props.plotData;
		const plotControllers = plotData.map( (plotOptions, plotId) => {
			return (
				<PlotController
					plotId={plotId}
					plotOptions={plotOptions}
					changePlotName={this.props.changePlotName}
					deletePlot={this.props.deletePlot}
					onNChange={this.props.onNChange}
					onPChange={this.props.onPChange}
					onColorChange={this.props.onColorChange}
					toggleSigmaRadius={this.props.toggleSigmaRadius}
					onSigmaRadiusChange={this.props.onSigmaRadiusChange}
				/>
			)}
		);

		let wrapperClasses = "chart-controller-wrapper";
		if (this.props.show) {
			wrapperClasses = "chart-controller-wrapper open"
		}

		return (
			<div className={wrapperClasses}>
				<div id="chart-controller">
					{plotControllers}
					<button
						id="add-new-plot-button" 
						onClick={this.props.addPlot}>Add new plot</button>
				</div>
			</div>
		);
	}
}

export default ChartController;