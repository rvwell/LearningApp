# LearningApp

Aplicativo desktop open source para aprender programação com trilhas, projetos locais independentes e revisão opcional por IA. O app não é uma IDE: a pessoa edita e executa os projetos no próprio ambiente.

Este repositório contém o bootstrap inicial de Tauri 2, Vue 3, TypeScript e Vite. A interface seguirá Feature-Sliced Design (FSD); o backend Rust será organizado por domínio. O conteúdo da primeira trilha — Rust em pt-BR — ainda será criado.

## Desenvolvimento

Requisitos: Node.js compatível com Vite 8 (20.19+ ou 22.12+), pnpm 12.15.0, Rust stable 1.90 ou superior, Cargo e os pré-requisitos de build do Tauri para Windows.

```powershell
pnpm install
pnpm tauri dev
```

Verificações do frontend:

```powershell
pnpm test --run
pnpm build
```

Verificações do backend desktop:

```powershell
cargo test --manifest-path src-tauri/Cargo.toml
```

## Arquitetura do frontend

As camadas FSD começam em `src/app`, `src/pages`, `src/widgets`, `src/features`, `src/entities` e `src/shared`. Módulos importam somente camadas inferiores. Slices da mesma camada não importam uns aos outros diretamente; use as entradas públicas de cada slice. A lógica nativa continua em `src-tauri` e será organizada por domínio.

## Licenças

- Código do aplicativo: MIT, em [LICENSE](LICENSE).
- Lições originais: CC BY 4.0, em [CONTENT-LICENSE](CONTENT-LICENSE).
