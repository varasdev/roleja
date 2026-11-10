# 🎟️ RolêJá

**Descubra eventos e encontre o que fazer!**

O RolêJá é um aplicativo mobile desenvolvido com React Native e Expo que permite explorar eventos e descobrir opções de entretenimento por meio da integração com a API do Ticketmaster.

## ✨ Funcionalidades

- 🔎 Consulta de eventos usando a API do Ticketmaster.
- 📅 Exibição de eventos futuros, organizados por data.
- 🗂️ Navegação por categorias de eventos (Shows, Festivais, Teatro, Comédia, Esportes).
- 🎨 Interface moderna com tema escuro e tons de roxo/lilás.
- 📱 Navegação real entre telas por meio do Expo Router (abas nativas).
- ❤️ Sistema de favoritos com persistência local via AsyncStorage.
- 👤 Tela de perfil com estatísticas do usuário.
- 🔗 Links diretos para compra de ingressos na Ticketmaster.
- 📱 Componentes React Native Paper integrados.

## 🛠️ Tecnologias utilizadas

- React Native
- Expo SDK 58
- Expo Router (navegação por abas nativas)
- TypeScript
- React Native Paper
- AsyncStorage (@react-native-async-storage/async-storage)
- API do Ticketmaster (Discovery API v2)
- React Native Reanimated
- Expo Vector Icons (Ionicons)
- Node.js e npm

## ⚙️ Como executar o projeto

### Pré-requisitos

- Node.js instalado (versão 18+ recomendada).
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
│   ├── app/
│   │   ├── _layout.tsx              # Layout raiz com PaperProvider e AppProvider
│   │   └── (tabs)/                  # Grupo de rotas de abas (Expo Router)
│   │       ├── _layout.tsx          # Configuração das abas nativas
│   │       ├── index.tsx            # Tela Início (eventos + busca + categorias)
│   │       ├── buscar.tsx           # Tela Buscar (foco em pesquisa)
│   │       ├── favoritos.tsx        # Tela Favoritos (eventos salvos)
│   │       └── perfil.tsx           # Tela Perfil (estatísticas e info)
│   ├── context/
│   │   └── AppContext.tsx           # Estado global (eventos, favoritos, busca, etc.)
│   ├── constants/
│   │   └── theme.ts                 # Constantes de cores e espaçamento
│   └── components/                  # Componentes auxiliares
├── assets/
│   └── images/                      # Ícones, logo, splash screen
├── .gitignore
├── app.json                         # Configuração do Expo
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

## 🎯 Telas do aplicativo

| Aba | Descrição |
|-----|-----------|
| **Início** | Lista de eventos futuros, busca, filtros por categoria |
| **Buscar** | Interface focada em pesquisa de eventos |
| **Favoritos** | Eventos salvos pelo usuário (persistidos no AsyncStorage) |
| **Perfil** | Estatísticas, informações do app e tecnologias |

## 🎓 Objetivo

Projeto acadêmico desenvolvido para praticar desenvolvimento mobile, integração com APIs externas, organização de código, navegação com Expo Router, persistência local com AsyncStorage, uso de React Native Paper e versionamento com Git e GitHub.

## ✅ Requisitos da atividade atendidos

- [x] **React Native e Expo** - Aplicativo executando corretamente
- [x] **Consumo de API** - Integração completa com Ticketmaster Discovery API
- [x] **Navegação** - Expo Router com abas nativas (4 telas)
- [x] **React Native Paper** - PaperProvider configurado e componentes disponíveis
- [x] **AsyncStorage** - Favoritos persistidos localmente
- [x] **GitHub público** - Código na branch `develop`

## 👨‍💻 Desenvolvedor

Desenvolvido por **varasdev**.

[Repositório no GitHub](https://github.com/varasdev/roleja)