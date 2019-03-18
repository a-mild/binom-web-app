import React, { Component, Fragment } from 'react';
import update from 'immutability-helper';

import { calculateMu, calculateSigma, hexToRgb, toRgbaString } from "./functions/myMath";

import SidebarMenu from "./components/SidebarMenu/SidebarMenu";
import PlotMenu from "./components/PlotMenu/PlotMenu";
import BasicOptions from "./components/PlotSubMenu/BasicOptions";
import AdvancedOptions from "./components/PlotSubMenu/AdvancedOptions";
import CanvasJSReact from './assets/js/canvasjs.react';

import Plot from "./components/PlotObject";

import "./App.css";

// var CanvasJSReact = require('./assets/js/canvasjs.react');
const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSidebarMenu: true,
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
                data: [ 
                    new Plot(),
                ],
                legend: {
                    cursor: "pointer",
                    itemclick: this.handleLegendClick,
                },
            },

        };
    }


    addPlot = () => {
        const newstate = update(this.state, {
            chartOptions: {data: {$push: [new Plot()]}}
        });
        this.setState(newstate);
    }

    deletePlot = (plotId) => {
        let plots = this.state.chartOptions.data.slice()
        plots.splice(plotId, 1);
        const newstate = update(this.state, {
            chartOptions: {data: {$set: plots}}
        });
        this.setState(newstate);
    }

    handlePlotNameChange = (plotId, plotName) => {
        const newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {name: {$set: plotName}}}
            }
        });
        this.setState(newstate);
    }

    handleFunctionTypeChange = (plotId, functionName) => {
        const newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {
                    functionType: {$set: functionName}}}
            }
        });
        this.setState(newstate);
    }

    handleNChange = (plotId, n) => {
        const newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {
                    n: {$set: n}}}},
        });
        this.setState(newstate);
    }

    handlePChange= (plotId, p) => {
        const newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {
                    p: {$set: p}}}},
        });
        this.setState(newstate);
    }

    handleColorChange = (plotId, color) => {
        const newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {color: {$set: color}}},
            }
        });
        this.setState(newstate);
    }

    toggleSigmaRadius = (plotId) => {
        const showSigmaRadius = this.state.chartOptions.data[plotId].showStriplines.sigmaRadius;
        let newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {
                    showStriplines: {sigmaRadius: {$set: !showSigmaRadius}}}}}
        });
        // updating state happens here:
        this.updateStriplines(newstate);
    }

    toggleMuStripline = (plotId) => {

    }

    handleSigmaRadiusChange = (plotId, z) => {
        let newstate = update(this.state, {
            chartOptions: {
                data: {[plotId]: {z: {$set: z}}}}
        });

        // updating state happens here:
        this.updateStriplines(newstate);
    }

    updateStriplines = (state) => {
        let allStriplines = [];

        state.chartOptions.data.forEach( (plot, plotId) => {
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
            chartOptions: {
                data: {[plotId]: {$toggle: ["visible"]}}
            }
        })
        this.setState(newstate);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.handleWindowClose);
        if (localStorage.getItem("plotOptions")) {
            this.loadPlotOptions();
        }
    }

    handleWindowClose = () => {
        this.savePlotOptions();
    }

    savePlotOptions = () => {
        const plotOptions = JSON.stringify(this.state.chartOptions.data);
        localStorage.setItem("plotOptions", plotOptions);
    }

    loadPlotOptions = () => {
        let plotOptions = JSON.parse(localStorage.getItem("plotOptions"));
        plotOptions = plotOptions.map( (plotOptions) => {
            const plotArguments = [
                plotOptions.name,
                plotOptions.visible,
                plotOptions._n,
                plotOptions._p,
                plotOptions._z,
                plotOptions.color,
                plotOptions._functionType
            ];
            return new Plot(...plotArguments);
        });
        const newstate = update(this.state, {
            chartOptions: {data: {$set: plotOptions}}
        });
        this.setState(newstate);
    }

    render() {
        const plotControllers = this.state.chartOptions.data.map( (plotOptions, plotId) => {
            return (
                <PlotMenu
                    plotId={plotId}
                    plotName={plotOptions.name}
                    visible={plotOptions.visible}
                    handlePlotNameChange={this.handlePlotNameChange}
                    toggleVisibility={this.togglePlotVisibility}
                    deletePlot={this.deletePlot}
                >
                    <BasicOptions
                        plotId={plotId}
                        plotOptions={plotOptions}
                        handleFunctionTypeChange={this.handleFunctionTypeChange}
                        handleNChange={this.handleNChange}
                        handlePChange={this.handlePChange}
                        handleColorChange={this.handleColorChange}
                    />
                    <AdvancedOptions
                        plotId={plotId}
                        plotOptions={plotOptions}
                        toggleSigmaRadius={this.toggleSigmaRadius}
                        handleSigmaRadiusChange={this.handleSigmaRadiusChange}
                    />
                </PlotMenu>
            )}
        );

        return (
            <Fragment>
                <SidebarMenu addPlot={this.addPlot}>
                    {plotControllers}
                </SidebarMenu>
                <main id="page-content">
                    <CanvasJSChart 
                        containerProps={{
                            width: "96%",
                            height: "96%", 
                            margin: "2%"}}
                        options={this.state.chartOptions}
                        onRef={ref => this.chart = ref}
                    />
                </main>
            </Fragment>
        );
    }
}

export default App;