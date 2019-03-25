function Rectangle(mu, zsigma, visible=false) {
    this.type = "rect";
    this.visible = visible; // read by the plotly react-component
    this._visible = visible; // used to save state when plot is set to invis
    this.layer = "above";
    this.xref = "x";
    this.x0 = mu - zsigma;
    this.x1 = mu + zsigma;
    this.yref = "paper";
    this.y0 = 0;
    this.y1 = 1;
}

// no idea why ... react-plotly only accepts objects as parameters
Rectangle.prototype = Object.prototype;

export default Rectangle;