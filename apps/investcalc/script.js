/* Excel FV function */
function FV(rate, nper, pmt, pv, type) {
	var pow = Math.pow(1 + rate, nper),
		fv;
	if (rate) {
		fv = (pmt*(1+rate*type)*(1-pow)/rate)-pv*pow;
	} else {
		fv = -1 * (pv + pmt * nper);
	}
	return fv.toFixed(2);
}

/* print number with commas */
function numberWithCommas(x) {
	return Math.floor(x).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/* get investment return after yr years */
function getReturn(investment, yr) {
	return ( FV( (0.09 / 52.0), yr * 52, investment, 0, 0) * -1 ) - (investment * 52 * yr);
}

function calculate() {
	var investment = document.getElementById('investment').value;

	var inv20 = investment * 20 * 52;
	var inv30 = investment * 30 * 52;
	var inv40 = investment * 40 * 52;
	var int20 = getReturn(investment, 20);
	var int30 = getReturn(investment, 30);
	var int40 = getReturn(investment, 40);
	display(inv20, inv30, inv40, int20, int30, int40);
}

function display(inv20, inv30, inv40, int20, int30, int40) {
	document.getElementById('v20').innerHTML = '$' + numberWithCommas(inv20 + int20);
	document.getElementById('v30').innerHTML = '$' + numberWithCommas(inv30 + int30);
	document.getElementById('v40').innerHTML = '$' + numberWithCommas(inv40 + int40);

	var trace1 = {
		x: ['20 years', '30 years', '40 years'],
		y: [inv20, inv30, inv40],
		name: 'Investment',
		type: 'bar',
		marker: {
			color: '#0d6efd',
			line: {
				color: '#0d6efd',
				width: 1.5
			}
		}
	};

	var trace2 = {
		x: ['20 years', '30 years', '40 years'],
		y: [int20, int30, int40],
		name: 'Interest',
		type: 'bar',
		marker: {
			color: '#20c997',
			line: {
				color: '#20c997',
				width: 1.5
			}
		}
	};

data = [trace1, trace2];
var layout = {barmode: 'stack'};

Plotly.newPlot('graph', data, layout);


	document.getElementById('result').style.visibility = 'visible';

}
