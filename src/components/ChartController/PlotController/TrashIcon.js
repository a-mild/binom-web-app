import React from 'react';

function TrashIcon(props) {
	return (
		<button onClick={props.onClick}>
			<i className="fa fa-trash"/>
		</button>
	);
}

export default TrashIcon;