var prog = [], tape = [], loops = [];
var tp = 0, ip = 0;
const TAPESIZE = 30000;

function buildLoops() {
	var stack = [];
	for (var i = 0; i < prog.length; i++) {
		if (prog[i] == '[') {
			loops.push([i, -1]);
		} else if (prog[i] == ']') {
			for (var j = loops.length - 1; j >= 0; j--) {
				if (loops[j][1] == -1) {
					loops[j][1] = i;
				}
			}
		}
	}
}

function eval(ins) {
	switch(ins) {
		case '+': tape[tp]++; break;
		case '-': if (tape[tp] > 0) tape[tp]--; break;
		case '.': putc(tape[tp]); break;
		case ',': tape[tp] = getc(); break;
		case '<': if (tp > 0) tp--; break;
		case '>': tp++; break;
		case '[':
			if (tape[tp] == 0) {
				for (var i = 0; i < loops.length; i++) {
					loop = loops[i];
					if (loop[0] == ip) {
						ip = loop[1];
					}
				}
			}
			break;
		case ']':
			if (tape[tp] > 0) {
				for (var i = 0; i < loops.length; i++) {
					loop = loops[i];
					if (loop[1] == ip) {
						ip = loop[0];
					}
				}
			}
			break;
	}
}

function putc(c) {
	document.getElementById('output').innerHTML += String.fromCharCode(c);
}

function getc() {
	return 0;
}

function run() {
	prog = document.getElementById('program').value.split('');
	buildLoops();

	for (var i = 0; i < TAPESIZE; i++) tape.push(0);


	while (ip < prog.length) {
		eval(prog[ip]);
		ip++;
	}
}

