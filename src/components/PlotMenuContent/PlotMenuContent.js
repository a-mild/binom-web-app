import React, { Component, Fragment } from 'react';

import { calculateQuantile, Phi } from "../../functions/myMath";

import IconButton from "../IconButton";
import "./PlotMenuContent.css";


class PlotMenuContent extends Component {
    handleFunctionTypeChange = (e) => {
        this.props.handleFunctionTypeChange(this.props.plotId, e.target.value);
    }

    handleNChange = (e) => {
        this.props.handleNChange(this.props.plotId, e.target.value);
    }

    handlePChange = (e) => {
        this.props.handlePChange(this.props.plotId, e.target.value);
    }

    handleColorChange = (e) => {
        this.props.handleColorChange(this.props.plotId, e.target.value);
    }

    handleSigmaChange = (e, inPercent) => {
        if (inPercent===true) {
            const p = e.target.value;
            const z = calculateQuantile(p/100);
            this.props.handleSigmaRadiusChange(this.props.plotId, z);
        }
        else {
            const z = e.target.value;
            this.props.handleSigmaRadiusChange(this.props.plotId, z);
        }
    }

    toggleMu = (e) => {
    	this.props.toggleMu(this.props.plotId);
    }

    toggleSigma = (e) => {
        this.props.toggleSigma(this.props.plotId);
    }

    isRadioChecked = (type) => {
        return (type === this.props.plotData.functionType)? true : false
        }

    renderTypeController = () => {
        return (
            <form className="input-column">
                <div className="input-column-row">
                <label htmlFor="binom-pdf">
                <input
                    type="radio"
                    name="plot-type"
                    id="binom-pdf"
                    value="binomPDF"
                    checked={this.isRadioChecked("binomPDF")}
                    onChange={(e) => this.handleFunctionTypeChange(e)}
                /> BinomPDF
                </label>
                </div>
                <div className="input-column-row">
                <label htmlFor="binom-cdf">
                <input 
                    type="radio" 
                    name="plot-type"
                    id="binom-cdf"
                    value="binomCDF"
                    checked={this.isRadioChecked("binomCDF")}
                    onChange={(e) => this.handleFunctionTypeChange(e)}
                /> BinomCDF</label>
                </div>
                <div className="input-column-row">
                <label htmlFor="1-binom-cdf">
                <input 
                    type="radio" 
                    name="plot-type" 
                    id="1-binom-cdf"
                    value="1-binomCDF"
                    checked={this.isRadioChecked("1-binomCDF")}
                    onChange={(e) => this.handleFunctionTypeChange(e)}
                /> 1 - BinomCDF</label>
                </div>
            </form>
            );
    }

    renderNController = () => {
        return (
            <form className="input-column">
                <input 
                    type="number" 
                    className="input-number"
                    min="0"
                    value={this.props.plotData.n}
                    onChange={this.handleNChange}
                />
            </form>
            );
    }

    renderPController = () => {
        return (
            <form className="input-column">
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
                    min="0" max="100" step="0.01"
                    value={this.props.plotData.p}
                    onChange={this.handlePChange}
                />
                <input 
                    type="range" 
                    list="tickmarks"
                    min="0" max="100" step="0.01"
                    value={this.props.plotData.p}
                    onChange={this.handlePChange}
                    />
            </form>
        );
    }

    renderColorController = () => {
        return (
            <form className="input-column">
                <input 
                    type="color"
                    value={this.props.plotData.marker.color}
                    onChange={this.handleColorChange}
                />
            </form>
        );
    }

    renderSigmaRadiusController = () => {
        const sigma = Math.round(this.props.plotData.sigma*1000)/1000;
        let pSigma = 100*2*Phi(this.props.plotData.z);
        pSigma = Math.round(pSigma*1000)/1000;
        let z = Math.round(this.props.plotData.z*1000)/1000;

        return (
            <div className="input-column">
                <div className="input-column-row">
                    {sigma}
                    <IconButton
                        style={{float: "right"}}
                        on={this.props.showSigma}
                        iconOn="fas fa-eye"
                        iconOff="fas fa-eye-slash"
                        onClick={this.toggleSigma}
                    />
                </div>
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
                    value={pSigma}
                    disabled={!this.props.showSigma}
                    onChange={(e) => this.handleSigmaChange(e, true)}
                />
                <input 
                    type="range" 
                    list="tickmarks"
                    min="0" max="100" step="0.01"
                    value={pSigma}
                    disabled={!this.props.showSigma}
                    onChange={(e) => this.handleSigmaChange(e, true)}
                />
                <input
                    type="number"
                    min="0" step="0.001"
                    value={z}
                    disabled={!this.props.showSigma}
                    onChange={(e) => this.handleSigmaChange(e, false)}
                />
            </div>
        );

    }

    render() {
        const mu = Math.round(this.props.plotData.mu*1000)/1000;

        return (
            <Fragment>
                <div className="controller-row">
                    <div className="label-column">
                    Type
                    </div>
                    {this.renderTypeController()}
                </div>  
                <div className="controller-row">
                    <div className="label-column">
                    <label htmlFor="plot-color-input">Color</label>
                    </div>
                    {this.renderColorController()}
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
                        <div className="input-column-row">
                        {mu}
                        <IconButton
                            style={{float: "right"}}
                        	on={this.props.showMu}
    	                    iconOn="fas fa-eye"
                            iconOff="fas fa-eye-slash"
                            onClick={this.toggleMu}
                        />
                        </div>
                    </div>
                </div>
                <div className="controller-row">
                    <div className="label-column">
                    &sigma; =
                    </div>
                    {this.renderSigmaRadiusController()}
                </div>

            </Fragment>
        );
    }
}

export default PlotMenuContent;