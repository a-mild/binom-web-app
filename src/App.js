import React, { Component, Fragment } from 'react';
import update from 'immutability-helper';

import { calculateMu, calculateSigma, hexToRgb, toRgbaString } from "./functions/myMath";

import PlotData from "./components/PlotObject";
import Plot from "react-plotly.js";
import SidebarMenu from "./components/SidebarMenu/SidebarMenu";
import PlotMenu from "./components/PlotMenu/PlotMenu";
import BasicOptions from "./components/PlotSubMenu/BasicOptions";
import AdvancedOptions from "./components/PlotSubMenu/AdvancedOptions";

import "./App.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [new PlotData()],
            layout: {
                xaxis: {
                    title: "k",
                },
                yaxis: {
                    title: "Probabilty",
                    visible: true,
                    side: "left",
                    tickformat: "%",
                    showgrid: true,
                },
                yaxis2: {
                    side: "right",
                    overlaying: 'y',
                    tickformat: "%",
                    range: [0, 1],
                },
                barmode: "group",
                bargap: 0.15,
                bargroupgap: 0.1,
                showlegend: true,
                legend: {
                    orientation: "h",

                },
                shapes: []

            },
        };
    }


    addPlot = () => {
        const newstate = update(this.state, {
            data: {$push: [new PlotData()]}
        });
        this.setState(newstate);
    }

    deletePlot = (plotId) => {
        let plots = this.state.data.slice()
        plots.splice(plotId, 1);
        const newstate = update(this.state, {
            data: {$set: plots}
        });
        this.setState(newstate);
    }

    handlePlotNameChange = (plotId, plotName) => {
        const newstate = update(this.state, {
            data: {[plotId]: {name: {$set: plotName}}}
        });
        this.setState(newstate);
    }

    handleFunctionTypeChange = (plotId, functionName) => {
        const newstate = update(this.state, {
            data: {[plotId]: {functionType: {$set: functionName}}}
        });
        this.setState(newstate);
    }

    handleNChange = (plotId, n) => {
        const newstate = update(this.state, {
            data: {[plotId]: {n: {$set: n}}}
        });
        this.setState(newstate);
    }

    handlePChange= (plotId, p) => {
        const newstate = update(this.state, {
            data: {[plotId]: {p: {$set: p}}}
        });
        this.setState(newstate);
    }

    handleColorChange = (plotId, color) => {
        const newstate = update(this.state, {
            data: {[plotId]: {color: {$set: color}}}
        });
        this.setState(newstate);
    }

    toggleSigmaRadius = (plotId) => {
        const showSigmaRadius = this.state.chartOptions.data[plotId].showStriplines.sigmaRadius;
        let newstate = update(this.state, {
            data: {[plotId]: {
                    showStriplines: {sigmaRadius: {$set: !showSigmaRadius}}}}
        });
        // updating state happens here:
        this.updateStriplines(newstate);
    }

    toggleMuStripline = (plotId) => {

    }

    handleSigmaRadiusChange = (plotId, z) => {
        let newstate = update(this.state, {
            data: {[plotId]: {z: {$set: z}}}
        });

        // updating state happens here:
        this.updateStriplines(newstate);
    }

    updateStriplines = (state) => {
        let allStriplines = [];

        state.data.forEach( (plot, plotId) => {
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

    handleLegendClick = (e) => {
        this.togglePlotVisibility(e.dataSeriesIndex);
    }

    togglePlotVisibility = (plotId) => {
        const newstate = update(this.state, {
            data: {[plotId]: {$toggle: ["visible"]}}
        })
        this.setState(newstate);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.handleWindowClose);
        if (localStorage.getItem("data")) {
            this.loadPlotOptions();
        }
    }

    handleWindowClose = () => {
        this.savePlotOptions();
    }

    savePlotOptions = () => {
        const data = JSON.stringify(this.state.data);
        localStorage.setItem("data", data);
    }

    loadPlotOptions = () => {
        let data = JSON.parse(localStorage.getItem("data"));
        data = data.map( (trace) => {
            const plotArguments = [
                trace.name,
                trace.visible,
                trace._n,
                trace._p,
                trace._z,
                trace.color,
                trace._functionType
            ];
            return new PlotData(...plotArguments);
        });
        const newstate = update(this.state, {
            data: {$set: data}
        });
        this.setState(newstate);
    }

    render() {
        const plotMenus = this.state.data.map( (plotData, plotId) => {
            return (
                <PlotMenu
                    plotId={plotId}
                    plotName={plotData.name}
                    visible={plotData.visible}
                    handlePlotNameChange={this.handlePlotNameChange}
                    toggleVisibility={this.togglePlotVisibility}
                    deletePlot={this.deletePlot}
                >
                    <BasicOptions
                        plotId={plotId}
                        plotData={plotData}
                        handleFunctionTypeChange={this.handleFunctionTypeChange}
                        handleNChange={this.handleNChange}
                        handlePChange={this.handlePChange}
                        handleColorChange={this.handleColorChange}
                    />
                    <AdvancedOptions
                        plotId={plotId}
                        plotData={plotData}
                        toggleSigmaRadius={this.toggleSigmaRadius}
                        handleSigmaRadiusChange={this.handleSigmaRadiusChange}
                    />
                </PlotMenu>
            )}
        );

        return (
            <Fragment>
                <SidebarMenu addPlot={this.addPlot}>
                    {plotMenus}
                </SidebarMenu>
                <main id="page-content">
                    <Plot
                        data={this.state.data}
                        layout={this.state.layout}
                        style={{width: "100%", height: "100%"}}
                    />
                </main>
            </Fragment>
        );
    }
}

export default App;