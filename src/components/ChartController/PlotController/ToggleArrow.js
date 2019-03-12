import React from 'react';

function ToggleArrow(props) {
	if (props.show) {
		return (<i className="fa fa-angle-down" style={toggleArrowStyle}/>)
	} else {
		return (<i className="fa fa-angle-right"  style={toggleArrowStyle}/>)
	}
}

const toggleArrowStyle = {

}

export default ToggleArrow;