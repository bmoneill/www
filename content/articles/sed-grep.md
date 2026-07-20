---
title: "The Unbeatable Effectiveness of Sed and Grep"
description: ""
date: 2021-01-02T22:07:08-04:00
draft: false
---

Using the shell effectively in a Unix-like environment must show a
certain flow, which is comparable to poetry. According to former AT&T
Bell Labs employee Brian Kernighan in his book [Unix: A History and a Memoir](https://www.amazon.com/dp/1695978552),
many of the hackers who developed and utilized Research Unix
at Bell Labs in the early days were extremely fond of literature. Of
course, the arts and sciences are typically viewed as polar opposites,
but it is no where more prevalent than in computing that those who
create must learn from the work of the past, and must adapt that past
work to fit their present task. This is key because at the time,
people were in the early stages (not that the world is anywhere close
to finished today) of finding out how to effectively develop software,
and how to use computers to help with everyday tasks and to solve
problems that would be much more difficult to solve had computers not
existed.

With these ideas in mind, it is important to think about the idea that
is engrained in the minds of programmers since that era; an idea that
has stuck with programmers, even if they fail to live up to it: the
Unix philosophy of "do one thing and do it well";. Grep and Sed,
incredibly simple yet incredibly useful in an immense, seemingly
infinite range of scenarios, are prime justifications for the Unix
philosophy that have stood the test of time.

Variants of many Unix programs are still in wide use today, but why do
we still use Grep and Sed so often if there are so many programs out
there that we don&rsquo;t use anymore that can do so much more? It's a
testament to the rock solid stability and the ability to put trust in
a program that you know will do what you ask it to do promptly and
with minimal effort. That is one reason. Another is the universal
nature of these programs. Only when these are combined together, a
program will continue to be useful for many years.

Grep is admittedly much simpler than Sed, and in fact, the basic
functionality of Grep is easily replicable in Sed. However, Grep,
which is named after the Ed command `g/re/p` (which does exactly
what Grep does as well), is only Grep. It doesn't try to do anything
else but read a file and print the lines that match the given pattern
to standard output. Sed, which stands for "Stream EDitor";, is the same
way. All it does is edit the inputted stream of text. That's all it is
meant to do, and that is all it will do.

These useful programs can be applied in many different scripts as well
as be used in interactive shells due to their simple nature. It is
easy to find a case where you may want to `grep` a certain piece of
text from a source file (maybe to find a function definition or to
check if a header file is included). You could also want to print all
the lines of a file until a certain pattern is found, which can be
easily accomplished with `sed /re/q`. Learning Sed and Grep is a
very common and beneficial investment for command line users and
hackers in general. It really is no wonder they survived this long.
