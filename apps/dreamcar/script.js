var inputs = document.getElementById("inputs");
var result = document.getElementById("results");
var wrapper = document.getElementById("wrapper");

const interestRates = {
	"Poor": 0.1879,
	"Fair": 0.1259,
	"Good": 0.0709,
	"Excellent": 0.0429
};
const loanTerm = 7; // years

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

function formatNumber(n) {
	return "$" + Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getCreditScoreRange(n) {
	if (n > 750) return "Excellent";
	if (n > 700) return "Good";
	if (n > 600) return "Fair";
	return "Poor";
}

function getInputs() {
	if (wrapper.contains(result)) result.remove();
	if (!wrapper.contains(inputs)) wrapper.appendChild(inputs);
}

function calculate() {
	var creditScore = parseInt(document.getElementById("creditScore").value);
	var carPrice = parseInt(document.getElementById("carPrice").value);
	var results = {};

	for (var key in interestRates) {
		var interestRate = interestRates[key];
		var monthlyPayment = PMT(interestRate / 12, loanTerm * 12, carPrice * -1);
		var interest = monthlyPayment * loanTerm * 12 - carPrice;
		var total = carPrice + interest;

		results[key] = {
			rate: parseFloat(interestRate * 100).toFixed(2),
			payment: monthlyPayment,
			interest: interest,
			total: total
		};
	}

	var scoreRange = getCreditScoreRange(creditScore);
	display(scoreRange, carPrice, results);
}

function display(scoreRange, carPrice, results) {
	if (wrapper.contains(inputs)) inputs.remove();
	if (!wrapper.contains(result)) wrapper.appendChild(result);

	document.getElementById("scoreRange").innerHTML = scoreRange;
	document.getElementById("interestRate").innerHTML = results[scoreRange].rate + "%";
	document.getElementById("monthlyPayment").innerHTML = formatNumber(results[scoreRange].payment);
	document.getElementById("interest").innerHTML = formatNumber(results[scoreRange].interest);
	document.getElementById("total").innerHTML = formatNumber(results[scoreRange].total);

	var interest = [];

	for (var key in results) {
		interest.push(results[key].interest);
	}
	console.log(results.keys);
	var trace1 = {
		x: Object.keys(results),
		y: [carPrice, carPrice, carPrice, carPrice],
		name: 'Base Price',
		type: 'bar',
		marker: {
			color: '#0d6efd',
			line: {
				color: '#0d6efd',
				width: 1.5
			}
		},
	};

	var trace2 = {
		x: Object.keys(results),
		y: interest,
		name: 'Interest',
		type: 'bar',
		marker: {
			color: '#20c997',
			line: {
				color: '#20c997',
				width: 1.5
			}
		},
	};

	data = [trace1, trace2];
	var layout = {
		barmode: 'stack',
        xaxis: {fixedrange: true},
        yaxis: {fixedrange: true}
	};
	var config = {displayModeBar: false};
	Plotly.newPlot('graph', data, layout, config);
}

getInputs();
