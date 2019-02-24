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
		this.state = {show: false}
		this.handleNChange = this.handleNChange.bind(this);
		this.handlePChange = this.handlePChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.togglePlotOptions = this.togglePlotOptions.bind(this);
	}

	togglePlotOptions() {
		this.setState({show: !this.state.show});
	}

	renderTypeController() {
		return (
			<div className="input-column">
				<input 
					type="radio" 
					name="plot-type" 
					id="binom-pdf" 
					value="BinomPDF
					checked"/>
				<label for="binom-pdf">BinomPDF</label><br/>
				<input 
					type="radio" 
					name="plot-type"
					id="binom-cdf" 
					value="BinomCDF"/>
				<label for="binom-cdf">BinomCDF</label><br/>
				<input 
					type="radio" 
					name="plot-type" 
					id="1-binom-cdf"
					value="1-BinomCDF"/>
				<label for="1-binom-cdf">1 - BinomCDF</label>
			</div>
			);
	}

	renderNController() {
		return (
			<div className="input-column">
				<input 
					type="number" 
					className="input-number"
					min="0"
					value={this.props.plotOptions.n}
					onChange={this.handleNChange}
				/>
			</div>
			);
	}

	renderPController() {
		return (
			<div className="input-column">
				<datalist id="tickmarks">
				  <option value="0"/>
				  <option value="10"/>
				  <option value="20"/>
				  <option value="30"/>
				  <option value="40"/>
				  <option value="50"/>
				  <option value="60"/>
				  <option value="70"/>
				  <option value="80"/>
				  <option value="90"/>
				  <option value="100"/>
				</datalist>
				<input
				type="number"
				className="input-number"
				min="0" max="100" step="0.01"
				value={this.props.plotOptions.p}
				onChange={this.handlePChange}
				/>
				<div className="slider-wrapper">
					<input 
						type="range" 
						list="tickmarks"
						id="inputPSlider"
						min="0" max="100" step="0.01"
						value={this.props.plotOptions.p}
						onChange={this.handlePChange}
					/>
				</div>
			</div>
		);
	}

	renderColorController() {
		return (
			<div className="input-column">
				<input 
					type="color"
					id="plot-color-input"
					value={this.props.plotOptions.color}
					onChange={this.handleColorChange}
				/>
			</div>)
	}

	handleNChange(e) {
		this.props.onNChange(this.props.plotId, e.target.value);
	}

	handlePChange(e) {
		this.props.onPChange(this.props.plotId, e.target.value);
	}

	handleColorChange(e) {
		this.props.onColorChange(this.props.plotId, e.target.value);
	}

	render() {
		const n = this.props.plotOptions.n;
		const p = this.props.plotOptions.p;
		const color = this.props.plotOptions.color;

		return (
			<div className="plot-controller-container">
				<button 
					className="drop-options-button"
					onClick={this.togglePlotOptions}>
					Plot {this.props.plotId}
				</button>
				<div id="plot-controller" 
					style={this.state.show ? {display: "block"} : {display: "none"}}
				>
					<div className="controller-row">
						<div className="label-column">
						Type
						</div>
						{this.renderTypeController()}
					</div>	
					<div className="controller-row">
						<div className="label-column">
						n
						</div>
						{this.renderNController()}
					</div>
					<div className="controller-row">
						<div className="label-column">
						p
						</div>
						{this.renderPController()}
					</div>
					<div className="controller-row">
						<div className="label-column">
						Color
						</div>
						{this.renderColorController()}
						</div>
				</div>
			</div>
			);
	}
}

class ChartController extends Component {
	render() {
		const plotData = this.props.plotData;
		const plotControllers = plotData.map( (plotOptions, plotId) => {
			return (
					<PlotController
					plotId={plotId}
					plotOptions={plotOptions}
					onNChange={this.props.onNChange}
					onPChange={this.props.onPChange}
					onColorChange={this.props.onColorChange}/>
			)});

		return (
			<div id="chart-controller">
				{plotControllers}
			<button onClick={this.props.addPlot}>Add new plot</button>
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
		this.addPlot = this.addPlot.bind(this);
	}

	addPlot() {
		const lastPlot = this.state.plotData.slice(-1);
		const newstate = update(this.state, {
			plotData: {$push: lastPlot}
		});
		this.setState(newstate);
	}

	handleNChange(plotId, n) {
		const p = this.state.plotData[plotId].p;
		const newdps = createDataPoints(n, p/100);
		const newstate = update(this.state, {
			plotData: {[plotId]: {
				n: {$set: n},
				dataPoints: {$set: newdps}}},
			});
		this.setState(newstate)
	}

	handlePChange(plotId, p) {
		const n = this.state.plotData[plotId].n;
		const newdps = createDataPoints(n, p/100);
		const newstate = update(this.state, {
			plotData: {[plotId]: {
				p: {$set: p},
				dataPoints: {$set: newdps}}},
			});
		this.setState(newstate);
	}

	handleColorChange(plotId, color) {
		const newstate = update(this.state, {
			plotData: {[plotId]: {color: {$set: color}},
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
			<div id="main">
				<ChartController 
					plotData={chartOptions.data}
					onNChange={this.handleNChange}
					onPChange={this.handlePChange}
					onColorChange={this.handleColorChange}
					addPlot={this.addPlot}
				/>
				<CanvasJSChart 
					containerProps={ {
						width: "90%",
						height: "100%",
					} }
					options={chartOptions}
					onRef={ref => this.chart = ref}
				/>
			</div>)
	}
}

export default App;