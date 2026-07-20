---
title: "bfx: A Tape-Based Esolang Interpreter, Compiler, and REPL"
description: "A writeup on bfx, an interpreter, compiler, and REPL for tape-based esolangs"
date: 2026-07-20T15:23:11-04:00
draft: false
tags:
  ["C", "Systems Programming", "Compiler Design", "Esolangs", "Interpreters"]
---

[bfx](https://github.com/bmoneill/bfx) is a Brainfuck toolkit written in C99
that includes an interpreter, compiler, and interactive REPL. Rather than
implementing only a basic interpreter, the project provides multiple ways to
execute Brainfuck programs while exposing the underlying compilation and
execution pipeline for experimentation and performance analysis.

## Motivation

I built bfx to explore language implementation from the ground up. Brainfuck's
minimal instruction set makes it possible to focus on the core concepts behind
interpreters, compilation, parsing, and optimization without the complexity of a
full programming language. The goal was to build a practical developer tool
rather than simply a proof of concept.

## Technical Highlights

- Implemented a complete Brainfuck interpreter in portable C99.
- Added support for the following Brainfuck derivatives: Brainfork, Grin,
  Pbrain, and Weave.
- Developed a compiler capable of translating Brainfuck programs into native executables.
- Built an interactive REPL for experimenting with Brainfuck code.
- Utilized a modular architecture that allows for easy addition of new language
  features.
- Built the project with CMake for cross-platform compatibility.

## Challenges

One of the more interesting challenges was designing the program in a way that allowed
for interpretation of similar Brainfuck-like languages without duplicating code.
I achieved this by creating a common language representation and a shared
execution engine. Files in `libbfx/src/langs` contain language-specific initialization,
deinitialization, and instruction functions, while the core interpreter logic is
implemented in `libbfx/src/interpret.c`. In C, this required careful use of
function pointers and structs to ensure that the language-specific code could be
cleanly separated from the shared interpreter logic.

In addition, some derivatives, such as Weave and Grin, modify the behavior of
the Brainfuck instruction set in ways that required additional logic to handle.
For example, Weave introduces a new instruction that toggles between a thread's
memory tape and a shared memory tape, while Grin changes the behavior of the
`+-,.` instructions. This made it necessary to include a language-specific data
structure to track the state of the interpreter for each language, and rewriting
certain parts of the interpreter to accommodate these differences.

## What I Learned

This project gave me hands-on experience with compiler construction, parsing,
and optimization techniques. It also provided insight into the challenges of
designing a language implementation that is both flexible and efficient.

## Future Work

- Add additional optimization passes and peephole optimizations.
- Add execution profiling and benchmarking tools.
- Expand the REPL with debugging features such as breakpoints, memory
  inspection, and step-by-step execution.
