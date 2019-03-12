import React, { Component } from 'react';
//import update from 'immutability-helper';
import ToggleArrow from "./ToggleArrow";

import { calculateMu, calculateSigma } from "../../../functions/myMath";

import "./BasicOptions.css";


class BasicOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {show: true};
	}

	toggleOptions = () => {
		this.setState({show: !this.state.show})
	}

	isChecked = (type) => {
		return (type == this.props.plotOptions.functionType)? true : false
		}

	renderTypeController = () => {
		return (
			<div className="input-column">
				<label htmlFor="binom-pdf">
				<input 
					type="radio" 
					name="plot-type" 
					id="binom-pdf" 
					value="BinomPDF"
					checked={true}/> BinomPDF</label>
				<div>
				<label htmlFor="binom-cdf">
				<input 
					type="radio" 
					name="plot-type"
					id="binom-cdf"
					onChange={console.log(this)}
					value="BinomCDF"/> BinomCDF</label>
				</div>
				<div>
				<label htmlFor="1-binom-cdf">
				<input 
					type="radio" 
					name="plot-type" 
					id="1-binom-cdf"
					value="1-BinomCDF"/> 1 - BinomCDF</label>
				</div>
			</div>
			);
	}

	renderNController = () => {
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

	renderPController = () => {
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
				<input 
					type="range" 
					list="tickmarks"
					min="0" max="100" step="0.01"
					value={this.props.plotOptions.p}
					onChange={this.handlePChange}
					/>
			</div>
		);
	}

	renderColorController = () => {
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

	handleNChange = (e) => {
		this.props.functions.onNChange(this.props.plotId, e.target.value);
	}

	handlePChange = (e) => {
		this.props.functions.onPChange(this.props.plotId, e.target.value);
	}

	handleColorChange = (e) => {
		this.props.functions.onColorChange(this.props.plotId, e.target.value);
	}

	render() {
		const n = this.props.plotOptions.n;
		const p = this.props.plotOptions.p;
		const mu = Math.round(1000*calculateMu(n, p/100))/1000;
		const sigma = Math.round(1000*calculateSigma(n, p/100))/1000;

		return (
			<div className="plot-options-controller">
				<button 
					className="plot-options-dropbutton"
					onClick={this.toggleOptions}>
					<ToggleArrow show={this.state.show}/> Basic Options
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
						n =
						</div>
						{this.renderNController()}
					</div>
					<div className="controller-row">
						<div className="label-column">
						p[%] =
						</div>
						{this.renderPController()}
					</div>
					<div className="controller-row">
						<div className="label-column">
						&mu; =
						</div>
						<div className="input-column">
						{mu}
						</div>
					</div>
					<div className="controller-row">
						<div className="label-column">
						&sigma; =
						</div>
						<div className="input-column">
						{sigma}
						</div>
					</div>
					<div className="controller-row">
						<div className="label-column">
						<label htmlFor="plot-color-input">Color</label>
						</div>
						{this.renderColorController()}
					</div>
				</div>
			</div>
		);
	}
}

export default BasicOptions;