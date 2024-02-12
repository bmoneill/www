var PERIODS = 52; // paycheck every week
const TAX_FACTOR = 0.8; // 20% tax rate assumed

/* result values */
var inv = 0, inv6 = 0, inv9 = 0, inv12 = 0, inc6 = 0, inc9 = 0, inc12 = 0;
var inc6T = 0, inc9T = 0, inc12T = 0;

var inputs = document.getElementById('inputs');
var results = document.getElementById('results');
var wrapper = document.getElementById('wrapper');

/* Excel FV function */
function FV(rate, nper, pmt, pv, type) {
	var pow = Math.pow(1 + rate, nper), fv;
	if (rate) {
		fv = (pmt*(1+rate*type)*(1-pow)/rate)-pv*pow;
	} else {
		fv = -1 * (pv + pmt * nper);
	}
	return fv.toFixed(2);
}

/* Excel PMT function */
function PMT(ir, np, pv, fv, type) {
	var pmt, pvif;
	fv || (fv = 0);
	type || (type = 0);

	if (ir === 0)
		return -(pv + fv)/np;

	pvif = Math.pow(1 + ir, np);
	pmt = - ir * (pv * pvif + fv) / (pvif - 1);

	if (type === 1)
		pmt /= (1 + ir);

	return pmt;
}

/* prinv number with commas */
function numberWithCommas(x) {
	return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* get investment return after yr years */
function getReturn(investment, yr, rate) {
	return ( FV( (rate / PERIODS), yr * PERIODS, investment, 0, 0) * -1 ) - (investment * PERIODS * yr);
}

function getInputs() {
	if (wrapper.contains(results)) { results.remove(); }
	if (!wrapper.contains(inputs)) { wrapper.appendChild(inputs); }
}

function calculate() {
	var investment = parseInt(document.getElementById('investment').value);
	var years = parseInt(document.getElementById('years').value);
	PERIODS = $('.bootstrap-select').val();

	inv = investment * years * PERIODS;

	inv6 = inv + getReturn(investment, years, 0.06);
	inv9 = inv + getReturn(investment, years, 0.09);
	inv12 = inv + getReturn(investment, years, 0.12);

	inc6 = PMT(0.06 / 12, years * 12, inv6 * -1);
	inc9 = PMT(0.06 / 12, years * 12, inv9 * -1);
	inc12 = PMT(0.06 / 12, years * 12, inv12 * -1);

	inc6T = inc6 * TAX_FACTOR;
	inc9T = inc9 * TAX_FACTOR;
	inc12T = inc12 * TAX_FACTOR;

	display();
}

function display() {
	if (wrapper.contains(inputs)) { inputs.remove(); }
	if (!wrapper.contains(results)) { wrapper.appendChild(results); }

	document.getElementById('inv6').innerHTML = '$' + numberWithCommas(inv6);
	document.getElementById('inv9').innerHTML = '$' + numberWithCommas(inv9);
	document.getElementById('inv12').innerHTML = '$' + numberWithCommas(inv12);
	document.getElementById('inc6').innerHTML = '$' + numberWithCommas(inc6);
	document.getElementById('inc9').innerHTML = '$' + numberWithCommas(inc9);
	document.getElementById('inc12').innerHTML = '$' + numberWithCommas(inc12);
	document.getElementById('inc6T').innerHTML = '$' + numberWithCommas(inc6 * TAX_FACTOR);
	document.getElementById('inc9T').innerHTML = '$' + numberWithCommas(inc9 * TAX_FACTOR);
	document.getElementById('inc12T').innerHTML = '$' + numberWithCommas(inc12 * TAX_FACTOR);
}

getInputs();
