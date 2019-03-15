import React, { Component } from 'react';
//import update from 'immutability-helper';
import ToggleArrow from "./ToggleArrow";

import { calculateQuantile, Phi} from "../../../functions/myMath";

import "./AdvancedOptions.css";

class AdvancedOptions extends Component {
	constructor(props) {
		super(props);
		this.state = {
			show: false,
			sigma: 0,
			sigmaScale: "percent",
		};
	}

	toggleOptions = () => {
		this.setState({show: !this.state.show});
	}

	toggleSigmaRadius = () => {
		this.props.toggleSigmaRadius(this.props.plotId);
	}

	handleSigmaChange = (percent, e) => {
		if (percent===true) {
			const p = e.target.value;
			const z = calculateQuantile(p/100);
			this.props.handleSigmaRadiusChange(this.props.plotId, z);
			this.setState({sigma: p, sigmaScale: "percent"});
		}
		else {
			const z = e.target.value;
			this.props.handleSigmaRadiusChange(this.props.plotId, z);
			this.setState({sigma: z, sigmaScale: "z"});
		}
	}

	renderSigmaInPercent = () => {
		const showSigmaRadius = this.props.plotOptions.showStriplines.sigmaRadius;
		let p = (this.state.sigmaScale === "percent") ? this.state.sigma : 100*2*Phi(this.state.sigma);
		p = Math.round(p*1000)/1000;

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
					min="0" max="100" step="0.001"
					value={p}
					disabled={!showSigmaRadius}
					onChange={(e) => this.handleSigmaChange(true, e)}
				/>
				<input 
					type="range" 
					list="tickmarks"
					min="0" max="100" step="0.01"
					value={p}
					disabled={!showSigmaRadius}
					onChange={(e) => this.handleSigmaChange(true, e)}
				/>
			</div>
			);
	}

	renderZSigma = () => {
		let z = (this.state.sigmaScale === "z") ? this.state.sigma : calculateQuantile(this.state.sigma/100);
		z = Math.round(z*1000)/1000;
		const showSigmaRadius = this.props.plotOptions.showStriplines.sigmaRadius;

		return (
			<div className="input-column">
			<input
				type="number"
				min="0" step="0.001"
				value={z}
				disabled={!showSigmaRadius}
				onChange={(e) => this.handleSigmaChange(false, e)}
			/>
			</div>
		);
	}

	render() {
		const showSigmaRadius = this.props.plotOptions.showStriplines.sigmaRadius;

		return (
			<div className="plot-options-controller">
				<button 
					className="plot-options-dropbutton"
					onClick={this.toggleOptions}>
					<ToggleArrow show={this.state.show}/> Extra Options
				</button>
				<div 
					className="plot-controller"
					style={this.state.show ? {display: "block"} : {display: "none"}
				}>
					<div className="controller-row">
						<label htmlFor="showSigma">
							<input
								type="checkBox"
								id="showSigma"
								checked={showSigmaRadius}
								onChange={this.toggleSigmaRadius}
							/>
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

export default AdvancedOptions;