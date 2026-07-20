---
title: "enigma: A library for simulating and cracking the Enigma machine"
description: "A writeup on enigma, a library for simulating and cracking the Enigma machine"
draft: false
---

[enigma](https://github.com/bmoneill/enigma) is a C99 library for simulating and
analyzing World War II Enigma machines. The library implements historically
accurate machine behavior, including configurable rotors, reflectors, ring
settings, plugboard wiring, and rotor stepping. In addition to encryption and
decryption, it provides cryptanalysis routines for recovering machine settings
and exploring historical attacks against Enigma-encrypted messages.

## Motivation

I built Enigma to combine an interest in the history of cryptography with
low-level systems programming. Rather than creating a standalone simulator, I
wanted to develop a reusable library that could serve as the foundation for
command-line tools, graphical applications, and educational demonstrations while
accurately modeling the behavior of the original machines.

## Technical Highlights

- Implemented historically accurate simulation of multiple Enigma machine variants.
- Modeled rotor wiring, reflectors, ring settings, plugboard configuration, and
  turnover notches.
- Correctly reproduced the Enigma's rotor stepping behavior, including the
  double-stepping anomaly.
- Designed a modular API that allows machine configurations to be constructed programmatically.
- Implemented cryptanalysis routines for recovering machine settings from
  intercepted ciphertext utilizing n-gram, index-of-coincidence, and dictionary
  attacks.
- Built a portable C99 library with CMake for cross-platform compatibility.
- Developed comprehensive unit tests using historical examples and known test
  vectors to verify correctness.
- WebAssembly support for running the library in a browser environment, enabling
  interactive demonstrations and educational tools.

## Challenges

The most challenging aspect of the project was reproducing the machine's
mechanical behavior with complete accuracy. While the basic encryption algorithm
is relatively straightforward, details such as rotor turnover positions, ring
settings, and the double-stepping mechanism are subtle and easy to implement
incorrectly. Developing the cryptanalysis components also required balancing
algorithmic performance with code clarity, as exhaustive search techniques can
quickly become computationally expensive. I initially utilized a brute-force
approach for key recovery, but later implemented more efficient heuristics based
on known weaknesses in the Enigma's design. Today, it would still take a significiant
amount of time (potentially years) to crack a message without additional
information, even on top-of-the-line modern hardware.

## What I Learned

This project strengthened my understanding of systems programming, API design,
and implementing complex state machines in C. It also provided practical
experience translating historical technical documentation into working software
and reinforced the importance of validating implementations against
authoritative reference material and known outputs.

## Future Work

- Expand support for additional historical Enigma variants and accessories.
- Optimize cryptanalysis algorithms through parallelization and search-space reduction.
- Add performance benchmarking and profiling tools.
- Continue expanding documentation and historical reference material alongside
  the library.
