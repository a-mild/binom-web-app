import React, { Component } from 'react';

import { calculateQuantile, Phi} from "../../functions/myMath";

import PlotSubMenu from "./PlotSubMenu";
import "./AdvancedOptions.css";

class AdvancedOptions extends Component {
    toggleSigmaRadius = () => {
        this.props.toggleSigmaRadius(this.props.plotId);
    }

    handleSigmaChange = (percent, e) => {
        if (percent===true) {
            const p = e.target.value;
            const z = calculateQuantile(p/100);
            this.props.handleSigmaRadiusChange(this.props.plotId, z);
        }
        else {
            const z = e.target.value;
            this.props.handleSigmaRadiusChange(this.props.plotId, z);
        }
    }

    renderSigmaInPercent = () => {
        const plotData = this.props.plotData
        const showSigmaRadius = plotData.showStriplines.sigmaRadius;
        let p = 100*2*Phi(plotData.z);
        p = Math.round(p*1000)/1000;

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
            </form>
            );
    }

    renderZSigma = () => {
        let z = Math.round(this.props.plotData.z*1000)/1000;
        const showSigmaRadius = this.props.plotData.showStriplines.sigmaRadius;

        return (
            <form className="input-column">
                <input
                    type="number"
                    min="0" step="0.001"
                    value={z}
                    disabled={!showSigmaRadius}
                    onChange={(e) => this.handleSigmaChange(false, e)}
                />
            </form>
        );
    }

    render() {
        const showSigmaRadius = this.props.plotData.showStriplines.sigmaRadius;

        return (
            <PlotSubMenu name="Advanced Options" open={false}>
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
                        p[%]
                    </div>
                    {this.renderSigmaInPercent()}
                </div>
                <div className="controller-row">
                    <div className="label-column">
                        z&sigma;
                    </div>
                    {this.renderZSigma()}
                </div>
            </PlotSubMenu>
        );
    }
}

export default AdvancedOptions;