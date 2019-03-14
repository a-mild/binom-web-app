import React from 'react';

function ToggleArrow(props) {
	const iconClass = (props.menuOpen)? "fa fa-angle-down":"fa fa-angle-right";

	return (
		<i className={iconClass} style={{width: "0.5em"}}/>
	);
}

export default ToggleArrow;