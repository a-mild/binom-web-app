import { calculateMu, calculateSigma, binomPDF, binomCDF } from "../functions/myMath";


function PlotData(id=0, name="Default Plot", visible=true, n=20, p=50, z=1, color="#000000", functionType="binomPDF") {
    this.type = "bar";
    this.name = name;
    this.visible = visible;
    this.showlegend = true;
    this._n = n;
    this._p = p;
    this.mu = calculateMu(n, p/100);
    this.sigma = calculateSigma(n, p/100);
    this._z = z;
    this._functionType = functionType;
    this.x = this.createXArray();
    this.y = this.createYArray();
    this.yaxis = this.setYAxis();
    this.offsetgroup = id + 1;
    this.marker = {
        color: color,
    };
}


PlotData.prototype = {
    createXArray() {
        let x = []
        for (let k=0; k <= this.n; k++) {
            x.push(k);
        }
        return x
    },

    createYArray() {
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
        let y = [];
        for (let k=0; k<=this._n; k++) {
            y.push(func(this._n, this._p/100, k));
        }
        return y;
    },

    setYAxis() {
        switch(this.functionType) {
            case "binomPDF":
                return ""
            case "binomCDF":
                return "y2"
            case "1-binomCDF":
                return "y2"
            default:
                return ""
        }
    },

    get functionType() {
        return this._functionType;
    },

    set functionType(value) {
        this._functionType = value;
        this.x = this.createXArray();
        this.y = this.createYArray();
        this.yaxis = this.setYAxis();
    },

    get n() {
        return this._n;
    },

    set n(value) {
        this._n = value;
        this.x = this.createXArray();
        this.y = this.createYArray();
		this.mu = calculateMu(this._n, this._p/100);
		this.sigma = calculateSigma(this._n, this._p/100);
    },

    get p() {
        return this._p;
    },

    set p(value) {
        this._p = value;
        this.x = this.createXArray();
        this.y = this.createYArray();
        this.mu = calculateMu(this._n, this._p/100);
    	this.sigma = calculateSigma(this._n, this._p/100);
    },

    get z() {
        return this._z;
    },

    set z(value) {
        this._z = value;
    },
}

export default PlotData;
