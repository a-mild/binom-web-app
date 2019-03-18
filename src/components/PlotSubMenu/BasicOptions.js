import React, { Component } from 'react';

import { calculateMu, calculateSigma } from "../../functions/myMath";

import PlotSubMenu from "./PlotSubMenu";
import "./BasicOptions.css";


class BasicOptions extends Component {
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

    isRadioChecked = (type) => {
        return (type === this.props.plotOptions.functionType)? true : false
        }

    renderTypeController = () => {
        return (
            <form className="input-column">
                <div>
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
                <div>
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
                <div>
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
                    value={this.props.plotOptions.n}
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
            </form>
        );
    }

    renderColorController = () => {
        return (
            <form className="input-column">
                <input 
                    type="color"
                    id="plot-color-input"
                    value={this.props.plotOptions.color}
                    onChange={this.handleColorChange}
                />
            </form>)
    }

    render() {
        const n = this.props.plotOptions.n;
        const p = this.props.plotOptions.p;
        const mu = Math.round(1000*calculateMu(n, p/100))/1000;
        const sigma = Math.round(1000*calculateSigma(n, p/100))/1000;

        return (
            <PlotSubMenu name="Basic Options" open={true}>
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
            </PlotSubMenu>
        );
    }
}

export default BasicOptions;