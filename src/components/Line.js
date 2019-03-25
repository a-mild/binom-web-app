function Line(mu, visible=false) {
    this.type = "line";
    this.visible = visible; // read by the plotly react-component
    this._visible = visible; // used to save state when plot is set to invis
    this.layer = "above";
    this.xref = "x";
    this.yref = "paper";
    this.x0 = mu;
    this.x1 = mu;
    this.y0 = 0;
    this.y1 = 1;
}

// no idea why ... react-plotly only accepts objects as parameters
Line.prototype = Object.prototype;



export default Line;