# AI Engineering

Base reutilizável para desenvolver software com agentes de IA sem depender de um único editor, modelo ou provedor.

Última revisão da arquitetura: 2026-09-11.

## O que este repositório resolve

Este projeto organiza AI Engineering em camadas diferentes, porque cada problema pede um mecanismo diferente:

1. **AGENTS.md**: contexto e regras duráveis do repositório.
2. **Skills**: workflows especializados e carregados sob demanda.
3. **Subagents**: papéis com contexto isolado para tarefas complexas ou paralelas.
4. **MCP**: conexão com dados, APIs e ações externas.
5. **Hooks e permissões**: guardrails para execução.
6. **Evals**: testes de comportamento para sistemas probabilísticos.
7. **Observabilidade**: tracing, custo, latência, tool calls e regressões.

A regra central deste repo é: **não transforme tudo em prompt e não transforme tudo em MCP**.

Um especialista de frontend é melhor modelado como skill/subagent. Um conector para Figma, GitHub, banco, analytics ou observabilidade é um bom caso para MCP.

## Estrutura

~~~text
.
├── AGENTS.md
├── .agents/skills/              # skills portáveis
├── .cursor/
│   ├── agents/                  # subagents do Cursor
│   └── rules/                   # regras persistentes
├── .opencode/agents/            # agentes do OpenCode
├── configs/                     # exemplos de providers e MCP
├── docs/                        # decisões e guias
├── evals/                       # datasets e contratos de avaliação
├── mcp/starter-typescript/      # starter MCP 2026-07-28
├── scripts/                     # instalação e doctor
└── templates/                   # specs reutilizáveis
~~~

## Começo rápido

### Usar este repo como biblioteca

Clone o repositório e instale o kit em outro projeto:

~~~bash
node scripts/install.mjs ../meu-projeto --all
~~~

O instalador é conservador: não sobrescreve AGENTS.md existente e copia apenas os adapters escolhidos.

Targets:

~~~bash
node scripts/install.mjs ../meu-projeto --portable
node scripts/install.mjs ../meu-projeto --cursor
node scripts/install.mjs ../meu-projeto --opencode
node scripts/install.mjs ../meu-projeto --all
~~~

Depois valide:

~~~bash
node scripts/doctor.mjs ../meu-projeto
~~~

### Cursor

O repo inclui:

- regras em .cursor/rules
- subagents em .cursor/agents
- skills portáveis em .agents/skills

Use os subagents quando precisar de isolamento de contexto ou trabalho paralelo. Use skills para workflows repetíveis e focados.

### OpenCode

O arquivo opencode.jsonc carrega AGENTS.md e mantém permissões conservadoras. Há um exemplo de execução local em configs/opencode.local.example.jsonc.

Você pode usar provedores cloud ou modelos locais via Ollama e LM Studio.

### MCP

Há um starter em mcp/starter-typescript usando o SDK v2 e o protocolo 2026-07-28.

~~~bash
cd mcp/starter-typescript
npm install
npm run dev
~~~

O starter demonstra uma ferramenta de leitura limitada a uma raiz explícita, sem shell arbitrário e sem acesso irrestrito ao filesystem.

## Catálogo inicial

### Skills

- ai-feature: projetar features com LLMs/agentes do contrato ao rollout
- frontend-quality: UI, acessibilidade, responsividade, performance e estados
- backend-api: contratos, persistência, idempotência, filas e observabilidade
- security-review: revisão defensiva e threat modeling
- mcp-server: decidir quando MCP faz sentido e implementar com limites claros
- eval-driven: criar datasets, métricas e gates de regressão
- prompt-context: estruturar instruções, contexto, outputs e tool use
- growth-marketing: instrumentação, experimentos e conteúdo com critérios de medição

### Subagents

- frontend-engineer
- backend-engineer
- ai-engineer
- security-auditor
- growth-engineer
- verifier

## Qualidade automática\n\nA workflow em .github/workflows/ci.yml executa o doctor do toolkit e valida o starter MCP com typecheck + testes em pull requests e pushes para main.\n\n## Princípios

**Context engineering > prompt dumping.** O modelo precisa do contexto certo, na hora certa, não de um arquivo gigante carregado em toda requisição.

**Evals antes de escala.** Mudanças em prompt, modelo, ferramenta ou retrieval devem ser comparáveis contra um conjunto de casos.

**Ferramentas com least privilege.** Agentes não devem ganhar acesso destrutivo por padrão.

**Model agnostic.** Este repo não fixa um modelo como dogma. Modelos mudam rápido; contratos, evals e arquitetura devem sobreviver à troca.

**Humano no loop para ações sensíveis.** Mudanças destrutivas, deploy, dados de produção e operações irreversíveis exigem confirmação ou controles equivalentes.

## O que acompanhar em 2026

A base foi alinhada com:

- Cursor: Rules, Skills, Subagents, Hooks e MCP
- OpenCode: agents, skills, permissions, MCP e providers locais
- MCP 2026-07-28: core stateless, SDK v2 e deprecações atuais
- Codex: AGENTS.md, skills e execução multi-agent
- práticas de eval/observability para agentes

Veja docs/market-2026.md para fontes e decisões.

## Próximos módulos que fazem sentido adicionar

Este repo deve crescer por necessidade real, não por quantidade de prompts. Bons próximos módulos:

- adapters para Claude Code e Codex quando você quiser usá-los diretamente
- MCPs específicos para seus fluxos reais
- eval harness executável em CI
- tracing com OpenTelemetry/Langfuse
- templates de RAG e search
- policy gates para deploy, banco e secrets
- plugin distribuível do Cursor quando o catálogo estabilizar

## Licença

MIT.
