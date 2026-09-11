---
name: ai-feature
description: Design and implement production AI features using explicit contracts, context sources, tools, evals, observability, and rollout criteria. Use when adding LLM, RAG, agent, classification, extraction, generation, or tool-using behavior.
---
# AI Feature

## Goal

Turn an AI idea into an engineering contract that can be tested, observed, and safely changed.

## Workflow

1. Define the user outcome before choosing a model.
2. Separate deterministic logic from probabilistic logic.
3. Write the input contract and identify every context source.
4. Decide whether the feature needs:
   - plain model inference
   - structured output
   - retrieval
   - tool calling
   - an agent loop
   - MCP
5. Minimize context. Prefer retrieval or on-demand references over giant prompts.
6. Define an output schema wherever downstream code consumes the result.
7. Enumerate failure modes:
   - missing context
   - invalid output
   - tool failure
   - timeout
   - refusal
   - hallucinated unsupported claims
   - prompt injection
8. Create representative eval cases before optimizing the prompt or model.
9. Add traces for model calls, retrieval and tool calls without logging secrets.
10. Define fallback, retry and rollback behavior.

## Model selection

Do not choose a model by reputation alone.

Compare candidates on the actual eval dataset using:

- task success
- latency
- cost
- tool-call reliability
- schema adherence
- context capacity

Use the smallest/cheapest model that satisfies the acceptance threshold.

## Definition of done

The feature is not complete until:

- the contract is explicit
- eval cases exist
- failure behavior is handled
- sensitive tools use least privilege
- observability exists
- rollout and rollback are defined
