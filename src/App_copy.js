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

function calculateMu(n, p) {
	return n*p
}

function calculateSigma(n, p) {
	return Math.sqrt(n*p*(1-p))
}

/* from http://mathworld.wolfram.com/NormalDistributionFunction.html (14) */
function Phi(z) {
	return 0.5*Math.sqrt( 1 - (1/30)*(7*Math.exp(-0.5*z*z) + 16*Math.exp(-(2-Math.sqrt(2))*z*z) + (7 + 0.25*Math.PI*z*z)*Math.exp(-z*z)))
}

/* taken from https://arxiv.org/pdf/1002.0567.pdf*/
function inversePhi(p) {
	const q = p - 0.5;

	const a0 = 0.389422403767615;
	const a1 = -1.699385796345221;
	const a2 =  1.246899760652504;
	const b0 = 0.155331081623168;
	const b1 = -0.839293158122257;
	const c0 = 16.896201479841517652;
	const c1 = -2.793522347562718412;
	const c2 = -8.731478129786263127;
	const c3 = -1.000182518730158122;
	const d0 = 7.173787663925508066;
	const d1 = 8.759693508958633869;

	if (p < 0.0465) {
		const r = Math.sqrt(Math.log(1/(p*p)));

		return (c3*r**3 + c2*r**2 + c1*r + c0)/(r**2 + d1*r + d0)
	}
	else if (p < 0.9535) {
		const r = q*q;

		return q*(a2*r**2 + a1*r + a0)/(r**2 + b1*r + b0)
	}
	else {
		const r = Math.sqrt(Math.log(1/((1-p)*(1-p))));

		return -(c3*r**3 + c2*r**2 + c1*r + c0)/(r**2 + d1*r + d0)
	}
}

function calculateQuantile(p) {
	return inversePhi((p+1)/2)
}

function createDataPoints(n, p) {
	let datapoints = []
	for (let k=0; k<=n; k++) {
		datapoints.push({x: k, y: binomPDF(n, p, k)});
	}
	return datapoints
}

function hexToRBG(hexString) {
	const r = parseInt(hexString.slice(1, 3), 16);
	const g = parseInt(hexString.slice(3, 5), 16);
	const b = parseInt(hexString.slice(5, -1), 16);

	return {r: r, g: g, b: b}
}

function toRgbaString({r, g, b, a}) {
	return `rgba(${r},${g},${b},${a})`
}

class BasicOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {show: true};
		this.toggleOptions = this.toggleOptions.bind(this);
		this.handleNChange = this.handleNChange.bind(this);
		this.handlePChange = this.handlePChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
	}

	toggleOptions() {
		this.setState({show: !this.state.show})
	}

	renderTypeController() {
		return (
			<div className="input-column">
				<input 
					type="radio" 
					name="plot-type" 
					id="binom-pdf" 
					value="BinomPDF"
					checked={true} />
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
		this.props.functions.onNChange(this.props.plotId, e.target.value);
	}

	handlePChange(e) {
		this.props.functions.onPChange(this.props.plotId, e.target.value);
	}

	handleColorChange(e) {
		this.props.functions.onColorChange(this.props.plotId, e.target.value);
	}

	render() {
		const n = this.props.plotOptions.n;
		const p = this.props.plotOptions.p;
		const mu = calculateMu(n, p/100);
		const sigma = Math.round(1000*calculateSigma(n, p/100))/1000;

		return (
			<div className="plot-options-controller">
				<button 
					className="plot-options-dropbutton"
					onClick={this.toggleOptions}>
					{this.state.show ? <i className="fa fa-angle-down"/> : 
				<i className="fa fa-angle-right"/>} Basic Options
				</button>
				<div className="plot-controller" 
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
						&mu; =
						</div>
						{mu}
					</div>
					<div className="controller-row">
						<div className="label-column">
						&sigma; =
						</div>
						{sigma}
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

class FurtherOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			showSigma: false,
			sigma: 0,
			sigmaScale: "percent",
		};
		this.toggleOptions = this.toggleOptions.bind(this);
		this.toggleSigmaRadius = this.toggleSigmaRadius.bind(this);
		this.handleSigmaChange = this.handleSigmaChange.bind(this);
		this.renderSigmaInPercent = this.renderSigmaInPercent.bind(this);
		this.renderZSigma = this.renderZSigma.bind(this);
	}

	toggleOptions() {
		this.setState({show: !this.state.show});
	}

	toggleSigmaRadius() {
		this.setState({showSigma: !this.state.showSigma});
		this.props.functions.toggleSigmaRadius(this.props.plotId);
	}

	handleSigmaChange(percent, e) {
		if (percent) {
			const p = e.target.value;
			const z = calculateQuantile(p/100);
			this.props.functions.showSigmaRadius(this.props.plotId, z);
			this.setState({sigma: p, sigmaScale: "percent"});
		}
		else {
			const z = e.target.value;
			this.props.functions.showSigmaRadius(this.props.plotId, z);
			this.setState({sigma: z, sigmaScale: "z"});
		}
	}

	renderSigmaInPercent() {
		let p = (this.state.sigmaScale == "percent") ? this.state.sigma : 100*2*Phi(this.state.sigma);
		p = Math.round(p*1000)/1000;

		return (
			<input
				type="number"
				min="0" max="100" step="0.001"
				value={p}
				disabled={!this.state.showSigma}
				onChange={(e) => this.handleSigmaChange(true, e)}
			/>
			);
	}

	renderZSigma() {
		let z = (this.state.sigmaScale == "z") ? this.state.sigma : calculateQuantile(this.state.sigma/100);
		z = Math.round(z*1000)/1000;

		return (
			<input
				type="number"
				min="0" step="0.001"
				value={z}
				disabled={!this.state.showSigma}
				onChange={(e) => this.handleSigmaChange(false, e)}
			/>
		);
	}

	render() {
		return (
			<div className="plot-options-controller">
				<button 
					className="plot-options-dropbutton"
					onClick={this.toggleOptions}>
					{this.state.show ? <i className="fa fa-angle-down"/> : 
					<i className="fa fa-angle-right" />} Extra Options
				</button>
				<div 
					className="plot-controller"
					style={this.state.show ? {display: "block"} : {display: "none"}
				}>
					<div className="controller-row">
							<input
								type="checkBox"
								id="showSigma"
								checked={this.state.showSigma}
								onChange={this.toggleSigmaRadius}
							/>
							<label for="showSigma">
							Show &sigma;-environment
							</label>
						
					</div>
					<div className="controller-row">
						<div className="label-column">
							%
						</div>
						{this.renderSigmaInPercent()}
					</div>
					<div className="controller-row">
						<div className="label-column">
							z&sigma;
						</div>
						{this.renderZSigma()}
					</div>
				</div>
			</div>
			);
	}
}

class PlotController extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
		};

		this.togglePlotOptions = this.togglePlotOptions.bind(this);
	}

	togglePlotOptions() {
		this.setState({show: !this.state.show});
	}

	render() {
		const basicOptionsFunctions = {
			onNChange: this.props.onNChange,
			onPChange: this.props.onPChange,
			onColorChange: this.props.onColorChange,
		};

		const furtherOptionsFunctions = {
			showSigmaRadius: this.props.showSigmaRadius,
			toggleSigmaRadius: this.props.toggleSigmaRadius,
		};

		return (
			<div className="plot-controller-container">
				<button 
					className="plot-options-dropbutton"
					onClick={this.togglePlotOptions}>
				{this.state.show ? <i className="fa fa-angle-down"/> : 
					<i className="fa fa-angle-right" />} Plot {this.props.plotId}
				</button>
				<div 
					className="plot-options-container"
					style={this.state.show ? {display: "block"} : {display: "none"}}
				>
					<BasicOptions
						plotId={this.props.plotId}
						plotOptions={this.props.plotOptions}
						functions={basicOptionsFunctions}
					/>
					<FurtherOptions
						plotId={this.props.plotId}
						plotOptions={this.props.plotOptions}
						functions={furtherOptionsFunctions}
					/>
				</div>
			</div>
			);
	}
}

class ChartController extends Component {
	constructor(props) {
		super(props);
		this.state = {show: true};
		this.toggleSidebar = this.toggleSidebar.bind(this);
	}

	toggleSidebar() {
		this.setState({show: !this.state.show});
	}


	render() {
		const plotData = this.props.plotData;
		const plotControllers = plotData.map( (plotOptions, plotId) => {
			return (
					<PlotController
					plotId={plotId}
					plotOptions={plotOptions}
					onNChange={this.props.onNChange}
					onPChange={this.props.onPChange}
					onColorChange={this.props.onColorChange}
					toggleSigmaRadius={this.props.toggleSigmaRadius}
					showSigmaRadius={this.props.showSigmaRadius}/>
			)}
		);

		return (
			<div id="sidebar-wrapper">
				<div 
					style={this.state.show ? {display: "inline-block"} : {display: "none"}}>
					<div id="chart-controller">
						{plotControllers}
					<button
						id="add-new-plot-button" 
						onClick={this.props.addPlot}>Add new plot</button>
					</div>
				</div>
				<button id="toggle-sidebar-button"
					onClick={this.toggleSidebar}
					/>
			</div>
		);
	}
}


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedPlot: 0,
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
				data: [ {
					type: "column",
					name: "Plot 1",
					showInLegend: true,
					color: "#000000",
					yValueFormatString: "##0.##%",
					dataPoints: createDataPoints(20, 0.5),
					n: 20,
					p: 50,
					stripLines: {
						sigmaRadius: {show: false},
						mu: {show: false},
					},
					}
				],
			}
		};
		this.handleNChange = this.handleNChange.bind(this);
		this.handlePChange = this.handlePChange.bind(this);
		this.handleColorChange = this.handleColorChange.bind(this);
		this.addPlot = this.addPlot.bind(this);
		this.setDataPointsColor = this.setDataPointsColor.bind(this);
		this.showSigmaRadius = this.showSigmaRadius.bind(this);
		this.toggleSigmaRadius = this.toggleSigmaRadius.bind(this);
		this.updateStriplines = this.updateStriplines.bind(this);
	}

	DefaultPlot() {
		this.type = "column";
		this.name = "plot 1";
		this.showInLegend = true;
		this.color = "#000000";
		this.yValueFormatString = "##0.##%";
		this.dataPoints = createDataPoints(20, 0.5);
		this.n = 20;
		this.p = 50;
		this.stripLines = {
			sigmaRadius: {show: false},
			mu: {show: false},
		}
	}

	addPlot() {
		const newstate = update(this.state, {
			chartOptions: {data: {$push: [new this.DefaultPlot()]}}
		});
		this.setState(newstate);
	}

	handleNChange(plotId, n) {
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

	handlePChange(plotId, p) {
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

	handleColorChange(plotId, color) {
		const newstate = update(this.state, {
			chartOptions: {
				data: {[plotId]: {color: {$set: color}}},
			}
		});
		this.setState(newstate);
	}

	updateStriplines(state) {
		const plots = state.chartOptions.data;
		const allStriplines = [];

		plots.forEach( (plot) => {
			const striplinesArray = Object.values(plot.stripLines);
			striplinesArray.forEach((stripline) => {
				if (stripline.show) {
					allStriplines.push(stripline);
				}
			});
		});
		alert(allStriplines.length);
		const newstate = update(this.state, {
			chartOptions: {axisX: {stripLines: {$set: allStriplines}}}
		});
		this.setState(newstate);
	}

	setDataPointsColor(plotId, from, to, color) {
		// not sure why color wont change from updating state
		for (let i=from; i <= to; i++) {
			const newstate = update(this.state, {
				chartOptions: {
					data: {[plotId]: {dataPoints: {[i]: {
						$merge: {color: color}}}}}}
			});
			this.setState(newstate);
			this.chart.data[plotId].dataPoints[i].color = color;
		}
	}

	showSigmaRadius(plotId, z) {
		const plot = this.state.chartOptions.data[plotId];
		const n = plot.n;
		const p = plot.p;
		const mu = calculateMu(n, p/100);
		const sigma = calculateSigma(n, p/100);
		const color = plot.color;
		const colorRgba = Object.assign(hexToRBG(color), {a: 0.5});
		const colorRgbaString = toRgbaString(colorRgba);
		
		const startValue = mu - z*sigma;
		const roundedStartValue = Math.round(startValue);
		const endValue = mu + z*sigma;
		const roundedEndValue = Math.round(endValue);

		this.setDataPointsColor(plotId, 0, roundedStartValue-1, colorRgbaString);
		this.setDataPointsColor(plotId, roundedEndValue+1, n , colorRgbaString);

		const stripline = {
			startValue: mu-z*sigma,
			endValue: mu+z*sigma,
			color: "#d8d8d8",
		};

		const newstate = update(this.state, {
			chartOptions: {data: {[plotId]: {stripLines: {sigmaRadius: 
				{$merge: stripline}}}}}
		});
		this.setState(newstate);

		this.updateStriplines(newstate);
		
		/*
		const newstate = update(this.state, {
			chartOptions: {axisX: {stripLines: {$set: stripline}}},
		});
		this.setState(newstate);*/
	}

	toggleSigmaRadius(plotId) {
		const showSigmaRadius = this.state.chartOptions.data[plotId].stripLines.sigmaRadius.show;
		const newstate = update(this.state, {
			chartOptions: {data: {[plotId]: {stripLines: 
				{sigmaRadius: {show: {$set: !showSigmaRadius}}}}}}}
		);
		this.setState(newstate);
		}

	toggleMuStripline(plotId) {

	}

	render() {
		return (
			<div id="main">
				<ChartController 
					plotData={this.state.chartOptions.data}
					onNChange={this.handleNChange}
					onPChange={this.handlePChange}
					onColorChange={this.handleColorChange}
					addPlot={this.addPlot}
					showSigmaRadius={this.showSigmaRadius}
					toggleSigmaRadius={this.toggleSigmaRadius}
				/>
				<div id="page-content-wrapper">
					<CanvasJSChart 

						options={this.state.chartOptions}
						onRef={ref => this.chart = ref}
					/>
				</div>
			</div>)
	}
}

export default App;