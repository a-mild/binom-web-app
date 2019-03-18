import React from 'react';

function ToggleArrow(props) {
	const iconClass = (props.menuOpen)? "fas fa-angle-down fa-fw":"fas fa-angle-right fa-fw";

	return (
		<i className={iconClass}/>
	);
}

export default ToggleArrow;