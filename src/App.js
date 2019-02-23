import React, { Component } from 'react';
import CanvasJSReact from './assets/js/canvasjs.react'
import update from 'immutability-helper';

// var CanvasJSReact = require('./assets/js/canvasjs.react');
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;



function factorial(n) {
	if (n < 0) {
		return -1;
	}
	else if (n == 0) {
		return 1;
	}
	else {
		return (n*factorial(n-1))
	}
}

function binomial(n, k) {
	if (n < k ) {
		return -1
	}
	else {
		return factorial(n)/(factorial(k)*factorial(n-k))
	}
}

function binomPDF(n, p, k) {
	return binomial(n, k)*Math.pow(p, k)*Math.pow(1-p, n-k)
}

function binomCDF(n, p, k) {
	let sum = 0;
	for (let i=0; i<=k; i++) {
		sum += binomPDF(n, p, i)
	}
	return sum
}

function mu(n, p) {
	return n*p
}

function sigma(n, p) {
	return Math.sqrt(n*p*(1-p))
}


function createDataPoints(n, p) {
	let datapoints = []
	for (let k=0; k<=n; k++) {
		datapoints.push({x: k, y: binomPDF(n, p, k)});
	}
	return datapoints
}

class PlotController extends Component {
	constructor(props) {
		super(props);
		this.handleNChange = this.handleNChange.bind(this);
		this.handlePChange = this.handlePChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
	}
	renderNController() {
		return (
			<div id="inputN">
				<label for="inputNfield">
				n
				<input 
					type="number" 
					id="inputNfield"
					min="0"
					value={this.props.plotOptions.n}
					onChange={this.handleNChange}
				/>
				</label>
			</div>
			);
	}

	renderPController() {
		return (
			<div id="inputP">
				<label for="inputPSlider">
				p 
				<input 
					type="range" 
					id="inputPSlider"
					min="0" max="100" step="0.01"
					value={this.props.plotOptions.p}
					onChange={this.handlePChange}
				/>
				<input
				type="number"
				min="0" max="100" step="0.01"
				value={this.props.plotOptions.p}
				onChange={this.handlePChange}
				/>
				</label>
			</div>
		);
	}

	renderColorController() {
		return (
			<div id="plot-color-selector">
				<label for="plot-color-input">
				Color
				<input 
					type="color"
					id="plot-color-input"
					value={this.props.plotOptions.color}
					onChange={this.handleColorChange}
				/>
				</label>
			</div>)
	}

	handleNChange(e) {
		this.props.onNChange(e.target.value);
	}

	handlePChange(e) {
		this.props.onPChange(e.target.value);
	}

	handleColorChange(e) {
		this.props.onColorChange(e.target.value);
	}

	render() {
		const n = this.props.plotOptions.n;
		const p = this.props.plotOptions.p;
		const color = this.props.plotOptions.color;

		return (
			<div>
				{this.renderNController()}
				{this.renderPController()}
				{this.renderColorController()}
			</div>
			);
	}
}

class PlotSelectionBar extends Component {
	render() {
		const plots = this.props.plotNames.map( (plotName, plotId) => {
			return (
				<li key={plotId}>
				{plotName}
				</li>
				);
		});

		return (
			<div>
				<ol>{plots}</ol>
				<button name="add plot" />
			</div>
			);
	}
}

class ChartController extends Component {
	render() {
		const plotData = this.props.plotData;
		const plotNames = plotData.map( 
			plot => plot.name
			);
		const current = 0;

		return (
			<div>
				<PlotSelectionBar plotNames={plotNames}/>
				<PlotController 
					plotOptions={plotData[current]}
					onNChange={this.props.onNChange}
					onPChange={this.props.onPChange}
					onColorChange={this.props.onColorChange}/>
			</div>
		);
	}
}


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPlot: 0,
			plotData: [ {
				type: "column",
				name: "Plot 1",
				n: 20,
				p: 50,
				yValueFormatString: "##0.##%",

				color: "black",
				showInLegend: true,
				dataPoints: createDataPoints(20, 0.5),
			}],
		};
		this.handleNChange = this.handleNChange.bind(this);
		this.handlePChange = this.handlePChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
	}

	handleNChange(n) {
		const current = this.state.selectedPlot;
		const p = this.state.plotData[current].p;
		const newdps = createDataPoints(n, p/100);
		const newstate = update(this.state, {
			plotData: {[current]: {
				n: {$set: n},
				dataPoints: {$set: newdps}}},
			});
		this.setState(newstate)
	}

	handlePChange(p) {
		const current = this.state.selectedPlot;
		const n = this.state.plotData[current].n;
		const newdps = createDataPoints(n, p/100);
		const newstate = update(this.state, {
			plotData: {[current]: {
				p: {$set: p},
				dataPoints: {$set: newdps}}},
			});
		this.setState(newstate);
	}

	handleColorChange(color) {
		const current = this.state.selectedPlot;
		const newstate = update(this.state, {
			plotData: {[current]: {color: {$set: color}},
			}
		})
		this.setState(newstate)
	}

	render() {
		const chartOptions= {
				interactivityEnabled: true,
				exportEnabled: true,
				axisX: {
					title: "k",
				},
				axisY: {
					title: "Probability",
					minimum: 0,
					valueFormatString: "##0.##%",
					interlacedColor: "lightblue"
				},
				data: this.state.plotData,
		};

		return (
			<div>
				<CanvasJSChart 
					options={chartOptions}
					onRef={ref => this.chart = ref}
				/>
				<ChartController 
					plotData={chartOptions.data}
					onNChange={this.handleNChange}
					onPChange={this.handlePChange}
					onColorChange={this.handleColorChange}
				/>
			</div>)
	}
}

export default App;