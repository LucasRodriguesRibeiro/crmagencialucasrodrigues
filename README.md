# CRM Agência Lucas Rodrigues

CRM comercial e painel de gestão de leads desenvolvido sob medida para a **Agência Lucas Rodrigues**, com foco em alta conversão, controle de faturamento e independência de servidores ou banco de dados externo.

---

## 🎨 Identidade Visual
- **Tipografia**: Montserrat (Google Fonts)
- **Paleta de Cores**: Dourado Metálico (`#D4AF37`, `#F3E5AB`), Preto Profundo (`#0A0B0E`, `#12141A`) e Branco (`#FFFFFF`)
- **Estilo**: Dark Luxo, Glassmorphism e microinterações modernas

---

## 🚀 Como Executar o CRM

Você não precisa instalar dependências complexas. O sistema foi desenvolvido com tecnologias web puras (HTML5, CSS3 e JavaScript Moderno).

### Opção 1 (Mais Simples):
Basta dar **dois cliques no arquivo `index.html`** para abri-lo diretamente no seu navegador padrão (Google Chrome, Edge, etc.).

### Opção 2 (Com servidor local via Node.js):
Se preferir rodar em um servidor local com live preview:
```bash
npx serve .
```
ou
```bash
npx http-server .
```

---

## 💼 Funcionalidades Principais

### 1. Cadastro e Gestão de Leads
- **Campos do Lead**:
  - **Nome do Lead**: Nome do contato ou escritório.
  - **Número (Telefone/WhatsApp)**: Com máscara automática `(XX) XXXXX-XXXX` e botão com link direto para iniciar conversa no WhatsApp.
  - **Nome do Serviço**: Ex: *Gestão de Tráfego Pago*, *Criação de Site*, *Assessoria Jurídica Digital*, etc.
  - **Status do Funil**:
    - `Em conversa`
    - `Apresentação de proposta`
    - `Lead convertido` (Habilita e solicita o **Valor da Venda**)
    - `Lead perdido`
  - **Observações**: Histórico, detalhes da reunião e próximos passos.

### 2. Dashboard Comercial em Tempo Real
- **Total de Leads**: Contagem total de contatos no sistema.
- **Valor Faturado (Vendas)**: Soma automática de todos os leads com status *Lead convertido*.
- **Taxa de Conversão (%)**: Proporção percentual de fechamentos sobre o total de leads.
- **Ticket Médio**: Média de faturamento por contrato fechado.
- **Barra de Distribuição do Funil**: Gráfico visual em barra mostrando a proporção de cada etapa do funil.

### 3. Modos de Visualização
- **Modo Lista / Tabela**: Tabela executiva com troca rápida de status em 1 clique, link para WhatsApp, visualização de valores e ações rápidas (Ver, Editar, Excluir).
- **Modo Funil / Kanban**: Visualização em 4 colunas verticais com cards interativos.

### 4. Sistema de Salvar e Restaurar em JSON (Sem Banco de Dados)
- **Salvar JSON (Exportar)**:
  - Clique no botão **"Salvar JSON"** no cabeçalho.
  - O sistema gera e faz o download automático de um arquivo `.json` com todos os seus dados atualizados e com data.
  - Guarde esse arquivo no seu Google Drive, computador ou envie por e-mail como backup seguro.
- **Restaurar JSON (Importar)**:
  - Clique em **"Restaurar JSON"** no cabeçalho.
  - Selecione o arquivo `.json` salvo anteriormente.
  - O CRM lê os dados instantaneamente e atualiza todos os leads e o painel de faturamento.
- **Salvamento Automático Local**: Além do JSON, o CRM mantém os dados salvos automaticamente na memória do navegador (`localStorage`) para que você não perca nada se atualizar a página.
