# AI Engineering

Um sistema reutilizável para **engenharia de software com agentes**, não uma coleção de prompts.

Revisão arquitetural: 2026-09-12.

## O que mudou na V2

A primeira versão organizava Skills, Subagents, MCP e evals. Isso é necessário, mas não suficiente para escalar agentes.

A V2 adiciona a camada que realmente muda throughput e confiabilidade:

- **agent harness** provider-neutral
- **workflows em DAG** para feature, bugfix, refactor e arena
- **verification-first**
- **feature maps** para o agente conseguir operar o produto
- **evidence ledger** com hash dos artefatos
- **isolamento por worktree**
- **separação entre implementador e verifier**
- **fan-out/fan-in, arena e adversarial review**
- **estado durável** para tarefas que sobrevivem a sessão/modelo
- **dispatcher local** para Cursor/OpenCode
- **reflection loop**: falhas viram testes, policies, skills ou tooling

## Arquitetura

```text
pedido
  |
  v
engineering-mode
  |
  v
workflow DAG
  |
  +-- research scouts
  +-- architecture gate
  +-- tests/baseline
  +-- isolated implementation
  +-- deterministic verification
  +-- real-product verification
  +-- adversarial reviewers
  |
  v
integrator
  |
  v
evidence-backed closeout
```

Leia `ARCHITECTURE.md` e `docs/agent-system/`.

## Workflow harness

Validar todos os conceitos começa com workflows explícitos:

```bash
node harness/workflow.mjs check workflows/feature.json
node harness/workflow.mjs graph workflows/feature.json
```

Criar uma execução durável:

```bash
node harness/workflow.mjs init workflows/feature.json
```

Depois:

```bash
node harness/workflow.mjs ready .ai/runs/<run>
node harness/workflow.mjs start .ai/runs/<run> frame --agent orchestrator
node harness/workflow.mjs status .ai/runs/<run>
```

Um node só termina com evidência:

```bash
node harness/workflow.mjs complete .ai/runs/<run> frame \
  --evidence ./plan.md \
  --summary "Acceptance criteria and risk were defined"
```

## Executar agentes localmente

O harness não amarra o workflow a um vendor.

OpenCode:

```bash
node harness/dispatch.mjs .ai/runs/<run> investigate \
  --driver opencode --workspace ../meu-projeto --execute
```

Cursor:

```bash
node harness/dispatch.mjs .ai/runs/<run> implement \
  --driver cursor --workspace ../meu-projeto --execute
```

Sem `--execute`, o dispatcher é dry-run.

O processo do agente terminar com exit 0 **não certifica o node**. Ele continua `running` até receber evidência de verificação.

## Time de agentes

O repo inclui especialistas de domínio e também papéis de processo:

- orchestrator
- researcher
- architecture-reviewer
- test-engineer
- product-engineer
- frontend-engineer
- backend-engineer
- ai-engineer
- product-verifier
- security-auditor
- verifier
- integrator

A ideia não é usar todos em toda tarefa. O workflow escolhe a menor topologia necessária.

## Skills de engenharia rigorosa

Além das skills de domínio:

- engineering-mode
- verify-product
- architect
- tdd
- arena
- interrogate
- reflect

Elas existem para transformar engenharia em playbooks verificáveis, não para criar personas decorativas.

## Worktrees

Para vários agentes escritores:

```bash
node harness/worktree.mjs create auth-fix main
node harness/worktree.mjs list
node harness/worktree.mjs remove auth-fix
```

O remove recusa worktree suja.

Cursor também possui worktrees/subagents nativos; use o mecanismo do host quando ele oferecer isolamento melhor.

## Reutilizar em outro projeto

```bash
node scripts/install.mjs ../meu-projeto --all
node scripts/doctor.mjs ../meu-projeto
```

O kit é copiado para `.ai/`, enquanto Skills/adapters vão para os locais esperados por Cursor/OpenCode. Um `AGENTS.md` já existente nunca é sobrescrito.

## Princípios

**Proof over confidence.** Completion requires observable evidence.

**Repository as harness.** Architecture, docs, commands, observability and CI are part of agent performance.

**Parallelism after verification.** Primeiro faça um agente ser confiável; depois replique.

**Separation of duties.** Quem implementa não deve ser a única autoridade que certifica.

**Hard constraints compound.** Tipos, testes, lints e policies são mais confiáveis que lembretes em prompt.

**Model agnostic.** Modelos mudam; contratos, workflows, evidence e guardrails devem sobreviver.

## Pesquisa 2026

`docs/agent-system/sources-2026.md` registra as referências usadas: harness engineering, Symphony, pstack, Microsoft Agent Framework, SWE-agent/ACI e Codex harness.

## Licença

MIT.
