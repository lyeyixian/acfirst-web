<!-- SKETCH — the ADR skeleton `border-collie init` (v0.6.0-sketch) writes. -->

# 1. Record architecture decisions

Date: 2026-08-15

## Status

Accepted

## Context

Workers arrive with a fresh context window and no memory of previous sessions.
Anything decided in a conversation, a pull request thread, or the operator's
head is invisible to the next Worker, which will re-litigate it — or quietly
contradict it.

## Decision

Record architecture decisions here, one file per decision, numbered. A Worker
that finds an ADR contradicting its ticket raises the conflict rather than
silently overriding it.

## Consequences

The set of ADRs is part of the repository's contract with the fleet. It costs a
few minutes per decision and saves the re-litigation.
