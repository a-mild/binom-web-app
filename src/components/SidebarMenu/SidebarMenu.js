import React from 'react';

import "./SidebarMenu.css";

function SidebarMenu(props) {
    return (
        <div id="sidebar-menu">
            {props.children}
            <div className="bottom-content">
                <div
                    id="add-new-plot"
                    onClick={(e) => props.addPlot()}
                >
                    <i className="fa fa-plus fw"/>
                    Add new plot
                </div>
            </div>
        </div>
    );
}

export default SidebarMenu;