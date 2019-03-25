import React, { Component, Fragment } from 'react';
import Plot from "react-plotly.js";
import update from 'immutability-helper';

import PlotData from "./components/PlotObject";
import Line from "./components/Line";
import Rectangle from "./components/Rectangle";
import SidebarMenu from "./components/SidebarMenu/SidebarMenu";
import PlotMenu from "./components/PlotMenu/PlotMenu";
import PlotMenuContent from "./components/PlotMenuContent/PlotMenuContent";

import "./App.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            layout: {
                xaxis: {
                    title: "k",
                },
                yaxis: {
                    title: "Probability",
                    visible: true,
                    side: "left",
                    tickformat: "%",
                },
                yaxis2: {
                    title: "Accumulated Probability",
                    visible: true,
                    side: "right",
                    overlaying: 'y',
                    tickformat: "%",
                },
                barmode: "group",
                bargap: 0.15,
                bargroupgap: 0.1,
                showlegend: true,
                legend: {
                    orientation: "h",

                },
                shapes: [],

            },
        };
    }

    addPlot = (plotArgs) => {
        let newPlot;
        if (plotArgs) {
            newPlot = new PlotData(...plotArgs);
        } else {
            newPlot = new PlotData();
        }
        const mu = newPlot.mu;
        const zsigma = newPlot.z*newPlot.sigma;

        this.setState((prevState) => {
            return {
                data: prevState.data.concat(newPlot),
                layout: {
                    ...prevState.layout, 
                    shapes: prevState.layout.shapes.concat(new Line(mu), new Rectangle(mu, zsigma))} 
            };
        });
    }

    deletePlot = (plotId) => {
        let plots = this.state.data.slice()
        plots.splice(plotId, 1);
        let shapes = this.state.layout.shapes.slice();
        shapes.splice(plotId*2, 2);
        const newstate = update(this.state, {
            data: {$set: plots},
            layout: {shapes: {$set: shapes}}
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
        let newstate = update(this.state, {
            data: {[plotId]: {n: {$set: n}}}
        });

        const mu = newstate.data[plotId].mu;
        const sigma = newstate.data[plotId].sigma;
        const z = newstate.data[plotId].z;
        const x0 = mu - z*sigma;
        const x1 = mu + z*sigma;

        newstate = update(newstate, {
            layout: {shapes: {
                [2*plotId]: {
                    x0: {$set: mu},
                    x1: {$set: mu}
                },
                [2*plotId+1]: {
                    x0: {$set: x0},
                    x1: {$set: x1}
                }
            }}
        });
        this.setState(newstate);
    }

    handlePChange= (plotId, p) => {
        let newstate = update(this.state, {
            data: {[plotId]: {p: {$set: p}}},
        });

        const mu = newstate.data[plotId].mu;
        const sigma = newstate.data[plotId].sigma;
        const z = newstate.data[plotId].z;
        const x0 = mu - z*sigma;
        const x1 = mu + z*sigma;

        newstate = update(newstate, {
            layout: {shapes: {
                [2*plotId]: {
                    x0: {$set: newstate.data[plotId].mu},
                    x1: {$set: newstate.data[plotId].mu}
                },
                [2*plotId+1]: {
                    x0: {$set: x0},
                    x1: {$set: x1}
                }
            }}
        });
        this.setState(newstate);
    }

    handleColorChange = (plotId, color) => {
        const newstate = update(this.state, {
            data: {[plotId]: {marker: {color: {$set: color}}}}
        });
        this.setState(newstate);
    }

    toggleMu = (plotId) => {
        const newstate = update(this.state, {
            layout: {shapes: {[2*plotId]: {$toggle: ["visible", "_visible"]}}}
        });
        this.setState(newstate);
    }

    toggleSigma = (plotId) => {
        const newstate = update(this.state, {
            layout: {shapes: {[2*plotId+1]: {$toggle: ["visible", "_visible"]}}}
        });
        this.setState(newstate);
    }

    handleSigmaRadiusChange = (plotId, z) => {
        const mu = this.state.data[plotId].mu;
        const sigma = this.state.data[plotId].sigma;
        const x0 = mu - z*sigma;
        const x1 = mu + z*sigma;

        let newstate = update(this.state, {
            data: {[plotId]: {z: {$set: z}}},
            layout: {shapes: {[2*plotId+1]: {
                x0: {$set: x0},
                x1: {$set: x1}
            }}}
        });
        this.setState(newstate);
    }

    setDataPointsColor = (state, plotId, from, to, color) => {
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
            data: {[plotId]: {$toggle: ["visible"]}},
            layout: {shapes: {
                [2*plotId]: {visible: {$apply: () => {
                    if (!this.state.data[plotId].visible) {
                        // return saved visible state
                        return this.state.layout.shapes[2*plotId]._visible;
                    } else {
                        return false;
                    }
                }}},
                [2*plotId+1]: {visible: {$apply: () => {
                    if (!this.state.data[plotId].visible) {
                        // return saved visible state
                        return this.state.layout.shapes[2*plotId+1]._visible;
                    } else {
                        return false;
                    }
                }}}
            }}
        });
        this.setState(newstate);
    }

    componentDidMount() {
        window.addEventListener("beforeunload", this.handleWindowClose);
        if (localStorage.getItem("data")) {
            this.loadPlotOptions();
        } else {
            this.addPlot();
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
        console.log(data);
        data.forEach( (trace, plotId) => {
            console.log(trace);
            const plotArguments = [
                plotId,
                trace.name,
                trace.visible,
                trace._n,
                trace._p,
                trace._z,
                trace.marker.color,
                trace._functionType
            ];
            this.addPlot(plotArguments);
        });
        /*data = data.map( (trace) => {
            const plotArguments = [
                trace.name,
                trace.visible,
                trace._n,
                trace._p,
                trace._z,
                trace.marker.color,
                trace._functionType
            ];
            return new PlotData(...plotArguments);
        });
        const newstate = update(this.state, {
            data: {$set: data}
        });
        this.setState(newstate);*/
    }

    render() {
        const plotMenus = this.state.data.map( (plotData, plotId) => {
            let muShape = this.state.layout.shapes[2*plotId];
            let sigmaShape = this.state.layout.shapes[2*plotId+1];
            
            return (
                <PlotMenu
                    plotId={plotId}
                    plotName={plotData.name}
                    visible={plotData.visible}
                    toggleVisibility={this.togglePlotVisibility}
                    handlePlotNameChange={this.handlePlotNameChange}
                    deletePlot={this.deletePlot}
                >
                    <PlotMenuContent
                        plotId={plotId}
                        plotData={plotData}
                        handleFunctionTypeChange={this.handleFunctionTypeChange}
                        handleNChange={this.handleNChange}
                        handlePChange={this.handlePChange}
                        handleColorChange={this.handleColorChange}
                        showMu={muShape.visible}
                        toggleMu={this.toggleMu}
                        showSigma={sigmaShape.visible}
                        toggleSigma={this.toggleSigma}
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
                        useResizeHandler={true}
                    />
                </main>
            </Fragment>
        );
    }
}

export default App;