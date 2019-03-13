import React from 'react';

function ToggleArrow(props) {
	if (props.menuOpen) {
		return (<i className="fa fa-angle-down" />)
	} else {
		return (<i className="fa fa-angle-right" />)
	}
}

export default ToggleArrow;