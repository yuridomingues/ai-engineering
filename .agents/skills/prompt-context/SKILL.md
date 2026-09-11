---
name: prompt-context
description: Design compact prompts and context pipelines with clear instruction hierarchy, schemas, examples, and tool boundaries. Use for prompt refactors, context engineering, structured outputs, or reducing context waste.
---
# Prompt and Context Engineering

## Principle

The goal is not the longest prompt. The goal is the smallest context that reliably produces the required behavior.

## Structure

Prefer:

1. role/purpose only when it changes behavior
2. explicit task
3. relevant constraints
4. supplied context
5. tool rules
6. output contract
7. examples only when they resolve ambiguity

## Context policy

- keep durable rules in AGENTS.md
- keep repeatable workflows in Skills
- retrieve large references on demand
- isolate broad exploration in subagents
- remove duplicated instructions
- do not paste documentation the model can access through a tool/reference

## Outputs

When software consumes the answer:

- prefer a schema
- validate it
- handle invalid output explicitly
- avoid regex parsing of unconstrained prose

## Prompt changes

Treat prompt changes like code changes:

- version them
- run evals
- compare regressions
- record the reason for the change
