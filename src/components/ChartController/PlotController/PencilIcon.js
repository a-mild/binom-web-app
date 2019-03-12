import React from 'react';

function PencilIcon(props) {
	return (
		<i className="fa fa-pencil"
			onClick={props.onClick}
		/>
	);
}

export default PencilIcon;