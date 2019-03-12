import React, { Component } from 'react';
import update from 'immutability-helper';

import { createDataPoints, calculateMu, calculateSigma, hexToRgb, toRgbaString } from "./functions/myMath";

import ChartController from "./components/ChartController/ChartController";
import CanvasJSReact from './assets/js/canvasjs.react';

import "./App.css"

// var CanvasJSReact = require('./assets/js/canvasjs.react');
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showChartController: true,
			chartOptions: {
				interactivityEnabled: true,
				exportEnabled: true,
				axisX: {
					title: "k",
					stripLines: [],
				},
				axisY: {
					title: "Probability",
					minimum: 0,
					valueFormatString: "##0.##%",
				},
				data: [ 
					new this.DefaultPlot(),
				],
			}
		};
	}

	DefaultPlot() {
		this.type = "column";
		this.name = "Plot 1";
		this.showInLegend = true;
		this.color = "#000000";
		this.yValueFormatString = "##0.##%";
		this.functionType = "binomPDF";
		this.dataPoints = createDataPoints(20, 0.5);
		this.n = 20;
		this.p = 50;
		this.z = 0;
		this.showStriplines = {
			sigmaRadius: false,
			mu: false,
		}
	}

	/*toggleChartController = () => {
		this.setState(prevState => {
			return {showChartController: !prevState.showChartController}}
		);
		this.chart.render();
	}*/

	addPlot = () => {
		const newstate = update(this.state, {
			chartOptions: {data: {$push: [new this.DefaultPlot()]}}
		});
		this.setState(newstate);
	}

	deletePlot = (plotId) => {
		let plots = this.state.chartOptions.data.slice()
		plots.splice(plotId, 1);
		const newstate = update(this.state, {
			chartOptions: {data: {$set: plots}}
		});
		this.setState(newstate);
	}

	changePlotName = (e, name) => {

	}

	handleNChange = (plotId, n) => {
		const p = this.state.chartOptions.data[plotId].p;
		const newdps = createDataPoints(n, p/100);
		const newstate = update(this.state, {
			chartOptions: {
				data: {[plotId]: {
					n: {$set: n},
					dataPoints: {$set: newdps}}}},
			});
		this.setState(newstate)
	}

	handlePChange= (plotId, p) => {
		const n = this.state.chartOptions.data[plotId].n;
		const newdps = createDataPoints(n, p/100);
		const newstate = update(this.state, {
			chartOptions: {
				data: {[plotId]: {
					p: {$set: p},
					dataPoints: {$set: newdps}}}},
			});
		this.setState(newstate);
	}

	handleColorChange = (plotId, color) => {
		const newstate = update(this.state, {
			chartOptions: {
				data: {[plotId]: {color: {$set: color}}},
			}
		});
		this.setState(newstate);
	}

	toggleSigmaRadius = (plotId) => {
		const showSigmaRadius = this.state.chartOptions.data[plotId].showStriplines.sigmaRadius;
		let newstate = update(this.state, {
			chartOptions: {data: {[plotId]: {showStriplines: 
				{sigmaRadius: {$set: !showSigmaRadius}}}}}
		});

		// updating state happens here:
		this.updateStriplines(newstate);
	}

	toggleMuStripline = (plotId) => {

	}

	handleSigmaRadiusChange = (plotId, z) => {
		let newstate = update(this.state, {
			chartOptions: {data: {[plotId]: {z: {$set: z}}}}
		});

		// updating state happens here:
		this.updateStriplines(newstate);
	}

	updateStriplines = (state) => {
		let allStriplines = [];

		state.chartOptions.data.forEach( (plot, plotId) => {
			state = this.setDataPointsColor(state, plotId, 
						0, plot.n, 
						plot.color);

			const showStriplines = Object.values(plot.showStriplines);

			showStriplines.forEach( showStripline => {
				if (showStripline) {
					const mu = calculateMu(plot.n, plot.p/100);
					const sigma = calculateSigma(plot.n, plot.p/100);
					const startValue = mu - plot.z*sigma;
					const endValue = mu + plot.z*sigma;
					const rgbaColorString = toRgbaString(hexToRgb(plot.color), 0.2);

					const newStripline = {
						startValue,
						endValue,
						color: plot.color,
						opacity: 0.3,
					}

					allStriplines.push(newStripline);

					// paint the bars
					state = this.setDataPointsColor(state, plotId, 
						0, plot.n, 
						rgbaColorString);
					state = this.setDataPointsColor(state, plotId, 
						Math.round(startValue), Math.round(endValue), 
						plot.color);
				}
			})

		});

		state = update(state, {
			chartOptions: {axisX: {stripLines: {$set: allStriplines}}}
		});
		this.setState(state);
	}

	setDataPointsColor = (state, plotId, from, to, color) => {
		//console.log(from, to);
		if (to < 0) {to = 0}
		if (from > to) {from = to} 

		for (let i=from; i <= to; i++) {
			state = update(state, {
				chartOptions: {
					data: {[plotId]: {dataPoints: {[i]: {
						$merge: {color: color}}}}}}
			});
		}
		return state
	}

	render() {
		let wrapperClasses = "page-content-wrapper";

		if (!this.state.showChartController) {
			wrapperClasses = "page-content-wrapper full";
		}

		return (
			<div id="main">
				<ChartController 
					show={this.state.showChartController}
					plotData={this.state.chartOptions.data}
					addPlot={this.addPlot}
					deletePlot={this.deletePlot}
					changePlotName={this.changePlotName}
					onNChange={this.handleNChange}
					onPChange={this.handlePChange}
					onColorChange={this.handleColorChange}
					toggleSigmaRadius={this.toggleSigmaRadius}
					onSigmaRadiusChange={this.handleSigmaRadiusChange}
				/>
				<div className={wrapperClasses}>
					<button id="chart-controller-togglebutton"
						onClick={this.toggleChartController}
					/>
					<CanvasJSChart 
						containerProps={{
							width: "100%",
							height: "96%", 
							margin: "2%"}}
						options={this.state.chartOptions}
						onRef={ref => this.chart = ref}
					/>
				</div>
			</div>);
	}
}


export default App;