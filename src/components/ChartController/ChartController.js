import React from 'react';
//import update from 'immutability-helper';

import "./ChartController.css";

function ChartController(props) {
	return (
		<div id="chart-controller">
			{props.children}
			<button
				id="add-new-plot-button" 
				onClick={props.addPlot}
			>
				Add new plot
			</button>
		</div>
	);
}

export default ChartController;