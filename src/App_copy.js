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
 
class ChartController extends Component {

	renderPlotSelectionBar() {
		const plots = this.props.options.plots;
		const width = (90/plots.length).toString() + "%";
		const plotButtons = this.props.options.plots.map((plot, plotId) => {
			return (
				<button 
					id={plotId}
					onClick={(e) => this.props.options.selectPlot(e)}>
				{plot.name}</button>
			)});
		return (
			<div id="plot-selection-bar">
			{plotButtons} {this.renderAddPlot()}
			</div>
			)
	}

	renderAddPlot() {
		return (
			<button id="add-plot" 
			onClick={(e) => this.props.options.addPlot(e)}
			>
			Add new plot
			</button>
			);
	}

	renderPlotTypeSelector() {
		return (
			<div id="plotTypeSelectionBar">
				<button 
					id="BinomPDF"
					className="plotTypeButton"
					onClick={this.props.options.selectPlotType}
				>BinomPDF</button>
				<button 
					id="BinomCDF"
					className="plotTypeButton"
					onClick={this.props.options.selectPlotType}
				>BinomCDF</button>
				<button 
					id="1-BinomPDF"
					className="plotTypeButton"
					onClick={this.props.options.selectPlotType}
				>1-BinomCDF</button>

			</div>
		);
	}

	renderPlotTypeSelector() {
		return
	}

	renderNInput() {
		return ( 
			<div id="inputN">
			<label for="inputNfield">
			n
			<input 
				type="number" 
				id="inputNfield"
				min="0" 
				onChange={(e) => this.props.options.onNChange(e)}
			/>
			</label>
			</div>
		);
	}

	renderPInput() {
		return (
			<div id="inputP">
				<label for="inputPSlider">
				p 
				<input 
					type="range" 
					id="inputPSlider"
					min="0" max="100" step="0.01"
					onChange={(e) => this.props.options.onPChange(e)}
				/>
				<input
				type="number"
				min="0" max="100" step="0.01"
				onChange={(e) => this.props.options.onPChange(e)}
				/>
				</label>
			</div>
		);
	}

	renderPlotColorSelector() {
		return (
			<div id="plot-color-selector">
				<label for="plot-color-input">
				Color
				<input 
					type="color"
					id="plot-color-input"
					onChange={(e) => this.props.options.onColorChange(e)}
				/>
				</label>
			</div>)
	}



	render() {
		return (
			<div id="chartcontroller">
				{this.renderPlotSelectionBar()}
				<div id="plot-controller">
					<div id="plot-type-selector">
					</div>
					<div id="plot-options-controller">
					{this.renderNInput()}
					{this.renderPInput()}
					{this.renderPlotColorSelector()}
					</div>

				</div>
			</div>
		);
	}
}



class App extends Component {
	get defaultPlotOptions() {
		return ({
			type: "column",
			name: "plot 1",
			n: 20,
			p: 50,
			yValueFormatString: "##0.##%",

			color: "black",
			showInLegend: true,
			dataPoints: createDataPoints(20, 0.5)
		})
	};

	constructor(props) {
		super(props);
		this.handleNChange = this.handleNChange.bind(this);
		this.handlePChange = this.handlePChange.bind(this);
		this.selectPlot = this.selectPlot.bind(this);
		this.addPlot = this.addPlot.bind(this);
		this.changePlotColor = this.changePlotColor.bind(this);
		this.state = {
			selectedPlot: 0,
			inputN: 20,
			inputP: 50,
			chartOptions: {
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
				data: [
				Object.assign({}, this.defaultPlotOptions)
				]
			}
		};
	}

	createLegendText() {
		return
	}

	addPlot(e) {
		const newplot = Object.assign({}, this.defaultPlotOptions)
		const newstate = update(this.state, {
			chartOptions: {data: {$push: [newplot]}},
			inputP: {$set: 50},
			inputN: {$set: 20},
			inputColor: {$set: "black"},
		});
		this.setState(newstate);
	}

	selectPlot(e) {
		const current = Number(e.target.id);
		alert(current);
		const plots = this.state.chartOptions.data;
		const newstate = update(this.state, {
			selectedPlot: {$set: current},
			inputN: {$set: plots[current].n},
			inputP: {$set: plots[current].p},
			inputColor: {$set: plots[current].color},
		})
		this.setState(newstate)
	}

	handleNChange(e) {
		const current = this.state.selectedPlot;
		const p = this.state.chartOptions.data[current].p;
		const newNval = e.target.value;
		const newdps = createDataPoints(newNval, p/100)
		
		const newstate = update(this.state, {
			inputN: {$set: newNval},
			chartOptions: {data: {[current]: {n: {$set: newNval}}}},
			chartOptions: {data: {[current]: {dataPoints: {$set: newdps}}}}
		})
		this.setState(newstate)
	}

	handlePChange(e) {
		const current = this.state.selectedPlot;
		const n = this.state.chartOptions.data[current].n;
		const newPval = e.target.value;
		const newdps = createDataPoints(n, newPval/100);
		
		const newstate = update(this.state, {
			inputP: {$set: newPval},
			chartOptions: {data: {[current]: {p: {$set: newPval}}}},
			chartOptions: {data: {[current]: {dataPoints: {$set: newdps}}}}
		});
		this.setState(newstate)
	}

	changePlotColor(e) {
		const current = this.state.selectedPlot;
		const newcolor = e.target.value;

		const newstate = update(this.state, {
			inputColor: {$set: newcolor},
			chartOptions: {data: {[current]: {color: {$set: newcolor}}}}
		});
		this.setState(newstate)
	}

	render() {
		const current = this.state.selectedPlot;
		const chartControllerOptions = {
			current: current,
			inputN: this.state.inputN,
			inputP: this.state.inputP,
			inputColor: this.state.inputColor,
			onPChange: this.handlePChange,
			onNChange: this.handleNChange,
			plots: this.state.chartOptions.data,
			addPlot: this.addPlot,
			selectPlot: this.selectPlot,
			onColorChange: this.changePlotColor,
		};
		const chartOptions = this.state.chartOptions;

		return (
			<div>
				<CanvasJSChart  
					options={chartOptions}
					onRef={ref => this.chart = ref}
				/>
				<ChartController 
					options={chartControllerOptions}
				/>
			</div>
			);
	}

}


export default App;
