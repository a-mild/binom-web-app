
export function factorial(n) {
	if (n < 0) {
		return -1;
	}
	else if (n === 0) {
		return 1;
	}
	else {
		return (n*factorial(n-1))
	}
}

export function binomial(n, k) {
	if (n < k ) {
		return -1
	}
	else {
		return factorial(n)/(factorial(k)*factorial(n-k))
	}
}

export function binomPDF(n, p, k) {
	return binomial(n, k)*Math.pow(p, k)*Math.pow(1-p, n-k)
}

export function binomCDF(n, p, k) {
	let sum = 0;
	for (let i=0; i<=k; i++) {
		sum += binomPDF(n, p, i)
	}
	return sum
}

export function calculateMu(n, p) {
	return n*p
}

export function calculateSigma(n, p) {
	return Math.sqrt(n*p*(1-p))
}

/* from http://mathworld.wolfram.com/NormalDistributionFunction.html (14) */
export function Phi(z) {
	return 0.5*Math.sqrt( 1 - (1/30)*(7*Math.exp(-0.5*z*z) + 16*Math.exp(-(2-Math.sqrt(2))*z*z) + (7 + 0.25*Math.PI*z*z)*Math.exp(-z*z)))
}

/* taken from https://arxiv.org/pdf/1002.0567.pdf*/
export function inversePhi(p) {
	const q = p - 0.5;

	const a0 = 0.389422403767615;
	const a1 = -1.699385796345221;
	const a2 =  1.246899760652504;
	const b0 = 0.155331081623168;
	const b1 = -0.839293158122257;
	const c0 = 16.896201479841517652;
	const c1 = -2.793522347562718412;
	const c2 = -8.731478129786263127;
	const c3 = -1.000182518730158122;
	const d0 = 7.173787663925508066;
	const d1 = 8.759693508958633869;

	if (p < 0.0465) {
		const r = Math.sqrt(Math.log(1/(p*p)));

		return (c3*r**3 + c2*r**2 + c1*r + c0)/(r**2 + d1*r + d0)
	}
	else if (p < 0.9535) {
		const r = q*q;

		return q*(a2*r**2 + a1*r + a0)/(r**2 + b1*r + b0)
	}
	else {
		const r = Math.sqrt(Math.log(1/((1-p)*(1-p))));

		return -(c3*r**3 + c2*r**2 + c1*r + c0)/(r**2 + d1*r + d0)
	}
}

export function calculateQuantile(p) {
	return inversePhi((p+1)/2)
}

export function createDataPoints(n, p) {
	let datapoints = []
	for (let k=0; k<=n; k++) {
		datapoints.push({x: k, y: binomPDF(n, p, k)});
	}
	return datapoints
}

export function hexToRgb(hexString) {
	const r = parseInt(hexString.slice(1, 3), 16);
	const g = parseInt(hexString.slice(3, 5), 16);
	const b = parseInt(hexString.slice(5, -1), 16);

	return {r: r, g: g, b: b}
}

export function toRgbaString({r, g, b}, a) {
	return `rgba(${r},${g},${b},${a})`
}

