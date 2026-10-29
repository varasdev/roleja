# 🎟️ RolêJá

**Descubra eventos e encontre o que fazer!**

O RolêJá é um aplicativo mobile desenvolvido com React Native e Expo que permite explorar eventos e descobrir opções de entretenimento por meio da integração com a API do Ticketmaster.

## ✨ Funcionalidades

- 🔎 Consulta de eventos usando a API do Ticketmaster.
- 📅 Exibição de eventos futuros, organizados por data.
- 🗂️ Navegação por categorias de eventos.
- 🎨 Interface moderna com tema escuro e tons de roxo.
- 📱 Navegação entre telas por meio do Expo Router.

## 🛠️ Tecnologias utilizadas

- React Native
- Expo SDK 58
- Expo Router
- TypeScript
- API do Ticketmaster
- Node.js e npm

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js instalado.
- npm instalado.
- Aplicativo Expo Go no celular ou um emulador compatível.

### 1. Clone o repositório

```bash
git clone https://github.com/varasdev/roleja.git
```

### 2. Entre na pasta do projeto

```bash
cd roleja
```

### 3. Instale as dependências

```bash
npm install
```

### 4. Configure a chave da API

Crie um arquivo `.env` na raiz do projeto e adicione sua chave da API do Ticketmaster:

```env
EXPO_PUBLIC_TICKETMASTER_API_KEY=sua_chave_aqui
```

Substitua `sua_chave_aqui` pela chave obtida no portal de desenvolvedores do Ticketmaster.

### 5. Inicie o aplicativo

```bash
npx expo start --clear
```

Escaneie o QR Code com o Expo Go ou execute o projeto em um emulador compatível.

## 🔑 API do Ticketmaster

O aplicativo utiliza a API do Ticketmaster para consultar informações sobre eventos.

Para obter uma chave, acesse o [portal de desenvolvedores do Ticketmaster](https://developer.ticketmaster.com/).

**Importante:** variáveis com o prefixo `EXPO_PUBLIC_` podem ser incorporadas ao aplicativo e ficar visíveis para seus usuários. Não utilize esse mecanismo para armazenar senhas ou credenciais privadas.

## 📁 Estrutura do projeto

```text
roleja/
├── src/
│   └── app/
│       ├── _layout.tsx
│       └── index.tsx
├── assets/
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## 🎓 Objetivo

Projeto acadêmico desenvolvido para praticar desenvolvimento mobile, integração com APIs externas, organização de código e versionamento com Git e GitHub.

## 👨‍💻 Desenvolvedor

Desenvolvido por **varasdev**.

[Repositório no GitHub](https://github.com/varasdev/roleja)
