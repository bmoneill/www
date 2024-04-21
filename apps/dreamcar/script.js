var inputs = document.getElementById("inputs");
var result = document.getElementById("results");
var wrapper = document.getElementById("wrapper");
var carName = "car";

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
	carName = document.getElementById("car").value.trim();
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
	document.getElementById("carName").innerHTML = carName;

	for (var score in interestRates) {
		document.getElementById("rate" + score).innerHTML = results[score].rate + "%";
		document.getElementById("monthly" + score).innerHTML = formatNumber(results[score].payment);
		document.getElementById("interest" + score).innerHTML = formatNumber(results[score].interest);
		document.getElementById("total" + score).innerHTML = formatNumber(results[score].total);
	}

	document.getElementById(scoreRange).classList.add("highlighted");
	document.getElementById("rate" + scoreRange).classList.add("highlighted");
	document.getElementById("monthly" + scoreRange).classList.add("highlighted");
	document.getElementById("interest" + scoreRange).classList.add("highlighted");
	document.getElementById("total" + scoreRange).classList.add("highlighted");
}

getInputs();
console.log("Test");
