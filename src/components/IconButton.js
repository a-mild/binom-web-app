import React, { Fragment } from 'react';

import "./IconButton.css";

function IconButton(props) {
    const iconClass = (props.iconClass)? props.iconClass : (props.on)? props.iconOn : props.iconOff;
    return (
        <Fragment>
            <button className="icon-button"
                style={props.style}
                onClick={props.onClick}>
                <i className={iconClass}/>
                {props.children}
            </button>
        </Fragment>
    )
}

export default IconButton;