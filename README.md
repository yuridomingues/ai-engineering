# AI Engineering

Um sistema reutilizável para **engenharia de software agent-first**: não apenas prompts ou MCPs, mas o harness completo que permite a agentes planejar, executar, verificar, colaborar e melhorar o próprio ambiente com segurança.

Última revisão arquitetural: 2026-09-12.

## A ideia central

O modelo é só uma peça. O desempenho real de um agente de engenharia depende de cinco camadas:

```text
intent/spec
    ↓
orchestration
    ↓
execution environment
    ↓
verification
    ↓
learning loop
```

Este repositório transforma essas camadas em componentes reutilizáveis.

### 1. Intent e contratos

O agente precisa saber **o resultado observável**, não apenas "escreva código".

Artefatos:

- `AGENTS.md`: mapa curto do repositório e regras duráveis
- `templates/EXEC_PLAN.md`: plano executável para trabalho longo
- `templates/SPRINT_CONTRACT.md`: contrato entre builder e verifier
- `templates/FEATURE_MAP.md`: mapa de funcionalidades do ponto de vista do usuário

### 2. Orquestração

Escolha a topologia pelo problema:

- single-agent loop
- planner → builder → verifier
- supervisor + specialists
- DAG de tarefas com workers paralelos
- arena: N soluções independentes + juiz
- adversarial review
- background maintainers

O repo inclui um task graph determinístico e contratos para handoff.

### 3. Ambiente de execução

Agentes devem trabalhar em ambientes que consigam entender e operar:

- worktree/checkout isolado por tarefa
- boot determinístico
- fixtures/seed reproduzíveis
- ferramentas com contratos estreitos
- logs, traces e métricas acessíveis
- arquitetura explícita e mecanicamente verificável

### 4. Verificação

A regra mais importante deste repo:

> **"done" precisa de evidência executável.**

A escada de verificação é:

```text
static checks
  → unit/property tests
  → contract/integration
  → real runtime
  → user-path E2E
  → perf/observability
  → adversarial review
```

Nem toda mudança precisa chegar ao último nível. Mas a verificação deve corresponder ao risco e ao comportamento alterado.

### 5. Learning loop

Falhas não devem virar prompts maiores. Devem virar, na ordem de preferência:

1. teste/regression case
2. tipo/schema/invariante
3. lint/CI guardrail
4. ferramenta/harness
5. skill/playbook
6. documentação

Isso faz o sistema acumular capacidade sem acumular instruções frágeis.

---

## Estrutura

```text
.
├── AGENTS.md
├── .agents/skills/
│   ├── engineering-mode/        # roteador principal
│   ├── runtime-verification/
│   ├── agent-ready-repo/
│   ├── task-graph/
│   ├── parallel-arena/
│   ├── adversarial-review/
│   ├── handoff/
│   └── runtime-forensics/
├── .cursor/
│   ├── agents/
│   └── rules/
├── .opencode/agents/
├── configs/
├── docs/
│   ├── harness-engineering.md
│   ├── multi-agent-systems.md
│   ├── agent-ready-codebase.md
│   ├── verification-system.md
│   ├── task-graphs-control-plane.md
│   ├── long-running-agents.md
│   ├── software-engineering-for-agents.md
│   └── learning-loop.md
├── orchestration/
│   ├── task-graph.schema.json
│   └── example.taskgraph.json
├── evals/
├── mcp/starter-typescript/
├── scripts/
│   ├── taskgraph.mjs
│   ├── repo-readiness.mjs
│   └── architecture-lint.mjs
└── templates/
```

## Começo rápido

Clone este repo e instale o kit no projeto alvo:

```bash
node scripts/install.mjs ../meu-projeto --all
```

Depois faça o diagnóstico:

```bash
node scripts/doctor.mjs ../meu-projeto
node scripts/repo-readiness.mjs ../meu-projeto
```

### Executar um trabalho grande como DAG

Valide o grafo:

```bash
node scripts/taskgraph.mjs validate orchestration/example.taskgraph.json
```

Veja tarefas desbloqueadas:

```bash
node scripts/taskgraph.mjs ready orchestration/example.taskgraph.json
```

O estado de execução é separado da especificação, permitindo retries e múltiplos workers sem reescrever o plano.

---

## O que vai em cada mecanismo

| Necessidade | Mecanismo |
|---|---|
| Regra estável do repositório | AGENTS.md |
| Workflow especializado | Skill |
| Contexto isolado / papel independente | Subagent |
| Trabalho paralelo independente | Worktree + worker |
| Dependências entre trabalhos | Task DAG |
| Acesso a sistema externo | MCP/tool |
| Provar comportamento real | Verification harness |
| Regressão probabilística | Eval |
| Invariante arquitetural | Lint/test/schema |
| Trabalho longo | Exec plan + handoff |
| Falha recorrente | Guardrail/skill/test |

## Topologias multiagentes

### Planner → Builder → Verifier

Default para trabalho não trivial quando há valor em separar construção de julgamento.

### Supervisor + specialists

Bom quando o trabalho atravessa domínios diferentes e o supervisor precisa rotear contexto.

### DAG + parallel workers

Bom quando existem tarefas independentes com dependências explícitas. Cada worker recebe um workspace isolado.

### Arena

Use quando o problema é de design ou arquitetura e há mais valor em diversidade de soluções do que em decomposição.

### Adversarial review

Um agente constrói; outro tenta quebrar. Melhor que pedir ao mesmo agente para certificar o próprio trabalho.

Veja `docs/multi-agent-systems.md`.

---

## Codebase agent-ready

Um repositório preparado para agentes deve oferecer:

- mapa curto de arquitetura
- documentação versionada junto ao código
- limites de módulos visíveis
- schemas nas fronteiras
- comandos únicos para boot/test/verify
- ambientes isoláveis
- fixtures determinísticas
- user paths automatizáveis
- logs/traces consultáveis
- tarefas pequenas e verificáveis
- decisões registradas
- dívida técnica explícita
- linters para regras que não podem depender de memória

Veja `docs/agent-ready-codebase.md`.

---

## Catálogo de Skills

### Core

- `engineering-mode`: classifica a tarefa e escolhe o playbook correto
- `runtime-verification`: prova mudanças no artefato real
- `agent-ready-repo`: torna um projeto legível e operável por agentes
- `task-graph`: decompõe trabalho em DAG com dependências
- `handoff`: transfere estado entre sessões/agentes sem depender de chat

### Parallelismo e review

- `parallel-arena`: múltiplas soluções independentes + síntese
- `adversarial-review`: reviewer cético independente
- `runtime-forensics`: CPU, memória, logs, traces e sintomas reais

### Especialistas existentes

- `ai-feature`
- `frontend-quality`
- `backend-api`
- `security-review`
- `mcp-server`
- `eval-driven`
- `prompt-context`
- `growth-marketing`

---

## Filosofia de engenharia

**Proof over prose.** Um resultado que não consegue ser provado ainda é hipótese.

**Maps over manuals.** Dê ao agente um mapa progressivo; não despeje uma enciclopédia no contexto.

**Invariants over instructions.** Se uma regra pode virar tipo, teste, lint ou schema, faça isso.

**Parallelize independent work, not shared state.** Multiagente sem isolamento produz contenção e merge churn.

**External verification over self-confidence.** O builder não é a única fonte de verdade sobre o próprio trabalho.

**Boring architecture is leverage.** Estruturas previsíveis, interfaces estáveis e dependências explícitas aumentam legibilidade para humanos e agentes.

**Harness complexity must earn its cost.** Comece simples; adicione planner, evaluator, swarm ou loops só quando o baseline não for suficiente.

---

## Pesquisa de 2026 que orienta este repo

A arquitetura foi atualizada com base em práticas observadas em:

- OpenAI Harness Engineering e Symphony
- Anthropic long-running harnesses, agent teams e evaluator loops
- Cursor pstack / práticas de verification-first
- LangGraph para stateful graphs e multi-actor workflows
- MCP 2026-07-28
- evals e observabilidade para agentes

As fontes e decisões ficam em `docs/market-2026.md`.

## Licença

MIT.
