import { binomPDF, binomCDF } from "../functions/myMath";

function Plot(name="Default Plot", visible=true, n=20, p=50, z=1, color="#000000", functionType="binomPDF") {
    this.type = "column";
    this.name = name;
    this.visible = visible;
    this.showInLegend = true;
    this.color = color;
    this.yValueFormatString = "##0.##%";
    this._functionType = functionType;
    this._n = n;
    this._p = p;
    this._z = z;
    this.showStriplines = {
        sigmaRadius: false,
        mu: false,
    };
    this.dataPoints = this.createDataPoints();
}

Plot.prototype = {
    createDataPoints() {
        let func;
        switch(this.functionType) {
            case "binomPDF":
                func = binomPDF;
                break;
            case "binomCDF":
                func = binomCDF;
                break;
            case "1-binomCDF":
                func = (n, p, k) => 1 - binomCDF(n, p, k);
                break;
        };
        let dataPoints = []
        for (let k=0; k<=this._n; k++) {
            dataPoints.push({x: k, y: func(this._n, this._p/100, k)});
        }
        return dataPoints;
    },

    get functionType() {
        return this._functionType;
    },

    set functionType(value) {
        this._functionType = value;
        this.dataPoints = this.createDataPoints(); 
    },

    get n() {
        return this._n;
    },

    set n(value) {
        this._n = value;
        this.dataPoints = this.createDataPoints();
    },

    get p() {
        return this._p;
    },

    set p(value) {
        this._p = value;
        this.dataPoints = this.createDataPoints();
    },
}

export default Plot;
