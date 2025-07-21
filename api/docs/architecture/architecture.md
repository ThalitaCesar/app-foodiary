# Arquitetura do Foodiary API

Este documento apresenta a arquitetura do sistema **Foodiary API**, utilizando o [C4 Model](https://c4model.com/) para organizar as visões de contexto e containers.

---

## Visão Geral

O Foodiary API é um backend serverless para controle alimentar, permitindo que usuários registrem, consultem e processem informações sobre suas refeições. A arquitetura utiliza recursos da AWS como Lambda, SQS e banco de dados PostgreSQL (Neon).

---

## 1. Diagrama de Contexto

O diagrama de contexto mostra o Foodiary API como sistema central, interagindo diretamente com o usuário.

**Principais elementos:**
- **Usuário:** Registra refeições e consulta informações.
- **Foodiary API:** Backend que processa requisições e gerencia dados.

**Relacionamento:**  
O usuário envia fotos e consulta refeições via API.

---

## 2. Diagrama de Containers

O diagrama de containers detalha os principais componentes internos do Foodiary API.

| Container                   | Tecnologia              | Descrição                                              |
|-----------------------------|------------------------|--------------------------------------------------------|
| **API HTTP**                | Node.js + AWS Lambda   | Exposição dos endpoints REST para o frontend           |
| **PostgreSQL (Neon)**       | PostgreSQL             | Armazenamento dos dados das refeições                  |
| **SQS Queue**               | AWS SQS                | Gerenciamento do processamento assíncrono              |
| **Processador de Refeições**| AWS Lambda             | Processa dados das refeições a partir da fila          |

**Fluxo de interação:**
- Usuário interage com a API HTTP.
- API consulta/grava dados no PostgreSQL.
- API envia mensagens para a fila SQS.
- Lambda processa mensagens da fila e atualiza o banco.

---

## 3. Tecnologias Utilizadas

- **Backend:** Node.js com AWS Lambda (serverless)
- **Mensageria:** AWS SQS
- **Banco de Dados:** PostgreSQL Neon (cloud)
- **Infraestrutura:** AWS Lambda, SQS, PostgreSQL

---

## 4. Estrutura de Pastas da Documentação

```
api/
├── docs/
│   └── architecture/
│       ├── context.puml         # Diagrama de contexto (PlantUML)
│       ├── container.puml       # Diagrama de containers (PlantUML)
│       ├── context.png          # imagem gerada do contexto
│       ├── container.png        # imagem gerada do container
│       └── README.md            # Documentação da arquitetura
```

---

## 5. Como visualizar os diagramas

- Instale a extensão PlantUML no VS Code.
- Abra o arquivo `.puml` e pressione `Alt + D` para visualizar.
- Para exportar, clique com o botão direito e escolha "Export Current Diagram".

