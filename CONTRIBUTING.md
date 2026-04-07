# Contributing

First off, thank you for considering contributing to this project. Here are a few things you may find helpful.

## Prerequisites

You can work on this project on any platform: Windows, macOS or Linux.

In order to work on this project you'll need git and a recent version of Node.js (ideally
the [gallium](https://nodejs.org/download/release/v16.16.0/) LTS release).  
[Nvm](https://github.com/nvm-sh/nvm) can be used to automatically select the correct version enforced
by [.nvmrc](./.nvmrc), see [Deeper Shell integration](https://github.com/nvm-sh/nvm#deeper-shell-integration).

### Add a GitHub Personal Access Token

GitHub requires the usage of a personal access token to pull from public registries.

To work on this project, you'll need to configure it correctly in order to be able to pull the PoliTo API clients.

You'll need to create a personal access token with the `read:packages` scope and add it to your `.npmrc` file.

To generate a personal access token head to [GitHub Tokens settings](https://github.com/settings/tokens) and click
on `Generate new token (classic)`.
Then, select the `read:packages` scope and click on `Generate token`.

Finally, add a .npmrc file in your home directory (`/home/YOUR_USER/` on Linux or macOS, `C:\Users\YOUR_USER\` on
Windows) with the following content:

```
@polito:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
```

### Add a MapBox token

MapBox requires a token in order to install the `@rnmapbox/maps` npm package and pull native dependencies. Create a
MapBox account and [create a new token](https://account.mapbox.com/access-tokens/create) with all the public scopes and
the `DOWNLOADS:READ` scope. Paste the generated token in the following files:

- `.env`
- `android/local.properties`
- a `.netrc` file in your home directory with the following content:
  ```
  machine api.mapbox.com
    login mapbox
    password <TOKEN HERE>
  ```

## Project setup

```shell
$ git clone https://github.com/polito/rn-apps.git # Clone the monorepo
$ cd rn-apps
$ npm install # Install root dependencies
```

See [Running on Device](https://reactnative.dev/docs/running-on-device) for guidance on how to prepare your
environment to run the app.

## Dependency Management

To keep all applications in sync and avoid version conflicts, we use custom wrappers for dependency management. These scripts ensure that the `package-lock.json` at the root remains the single source of truth.

- **Adding/Removing/Updating:**
  Use `npm run add`, `npm run remove`, or `npm run update`.
  - If run from a **workspace folder**: it targets only that app/library.
  - If run from the **root**: it executes the action across the entire monorepo.
  - **Help**: Append `-h` or `--help` to any of these three commands to see the full command structure and available options.
- **Consistency Checks:**
  Run `npm run deps:check` to identify hoisting issues or version mismatches between workspaces. Use `npm run deps:fix` to attempt an automatic repair.

## iOS local development

In order to build and run the application locally (especially if you're not part of the official Apple Development Team)
[select the `dev` scheme](https://developer.apple.com/documentation/xcode/building-and-running-an-app#Select-a-scheme-for-your-target).
This scheme is pre-configured to automatically manage signing and will show up with a `DEV` badge and a dedicated bundle
identifier on the destination device in order to distinguish it from the production app.

### FixPilot

The iOS toolchain is quite fragile and may break due to various reasons (Xcode updates, library updates, etc...).
To help with this, a small helper script called `fixpilot` is provided to automatically fix common issues.

Fixpilot is designed to be context-aware: it automatically identifies the correct workspace to ensure that all recovery actions are applied to the right environment. Notably, if triggered from the monorepo root, it will automatically detect and run the fix across all apps present in the project.

You can run it with:

```shell
$ npm run fixpilot
```

## Project structure

Each app workspace in this monorepo (for example, `students/`) uses feature modules to keep the main areas semantically organized. Each module should be divided by entity
type (`components`, `hooks`, `styles`, `screens`). The `core` module contains general-purpose items, used across the
app.

A typical app workspace (e.g. `students/`) is structured as follows:

```
├── assets
├── src
│   ├── App.tsx              # App entry point
│   ├── core                 # Core module
│   │   ├── components
│   │   │   └── RootNavigator.tsx
│   │   ├── hooks
│   │   └── screens
│   ├── features             # Feature modules
│   │   ├── teaching
│   │   │   ├── components
│   │   :   ├── hooks
│   │       └── screens
│   └── utils                # Utilities
```

## Lib

The `lib` folder is used to isolate library/design-system-level components that are shared across all apps.

Imports from `@polito/lib` are intentionally split into three main entry points, to keep concerns well separated:

- `@polito/lib/core` – shared logic, hooks, types, utilities and cross-cutting infrastructure
- `@polito/lib/features/<feature>` – feature-specific building blocks and domain helpers
- `@polito/lib/ui` – design-system components, layout primitives, theming and navigation helpers

## Npm scripts

The table below describes the npm scripts defined inside each app workspace (for example, in `students/package.json`).
When working from the monorepo root, you can either:

- run them directly from the specific package directory
- or use the root-level convenience scripts.

| Name          | Description                                                                 |
| ------------- | --------------------------------------------------------------------------- |
| `start`       | Start the React Native dev server                                           |
| `android`     | Start the app on Android device                                             |
| `ios`         | Start the app on iOS device                                                 |
| `lint`        | Lints and fixes the code using ESLint (use `lint:check` to run checks only) |
| `format`      | Formats the code using Prettier (use `format:check` to run checks only)     |
| `types:check` | Runs static type checking                                                   |
| `check`       | Runs all code checks                                                        |
| `commit`      | Runs commitlint's CLI                                                       |

### Root-level scripts

At the monorepo root there are additional scripts to orchestrate work across all workspaces:

- `npm run lint` / `lint:check` – lint the TypeScript/TSX codebase with ESLint.
- `npm run format` / `format:check` – format (or just check) the codebase with Prettier.
- `npm run types:check` – run static type checking across all workspaces.
- `npm run check` – run the full quality pipeline (lint, format check, types, dependency checks, knip).
- `npm run start:students` / `start:faculty` / `start:base` – start the React Native dev server for each app.
- `npm run students:ios` / `students:android` (and similar for `faculty` and `base`) – run the apps on device/emulator.
- `npm run deps:check` / `deps:fix` – check and fix dependency hoisting issues.
- `npm run add` / `remove` / `update` – Core dependency management helpers. See [Dependency Management](#dependency-management) for usage and help.

## Code style

While not strictly enforced through formatting, conformance
to [Google's TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
is encouraged. Notably, here are some rules we think are important:

- Don't use `// @ts-ignore` comments. Try to use type narrowing/casting/patching and, when inevitable,
  use `// @ts-expect-error` comments describing the cause of the error.
- Do not mark interfaces specially (`IMyInterface` or `MyFooInterface`) unless it's idiomatic in its environment.
- Respect identifiers casing.
- When possible, use lambda expressions instead of functions.
- Don't leave commented statements without a textual explanation.

## Performance considerations

- Avoid introducing bulky libraries for common actions that can be performed with built-ins or internal utils.
- Discuss the adoption of libraries with a big impact on bundle size with the rest of the team.
- If possible, avoid default or namespace imports (`import * as`) and other constructs that impact tree-shaking.

## Git workflow

### Commits

We use [Conventional Commits](https://conventionalcommits.org/) to keep a consistent style and automatically generate
changelog entries for new releases. The `npm run commit` script can be of help with this: it runs the commitlint cli to
help you
write good commit messages.

### Git flow

We use a [Git Flow](https://danielkummer.github.io/git-flow-cheatsheet/)-like branching model. In short:

- `main` is the stable trunk.
- Use `feature/...` branches to work on new features.
- Use `hotfix/...`branches to perform urgent fixes.
- When useful, add a scope to your commits (ie `feat(teaching): implement trascript page`). Don't repeat branch
  prefixes here.
- Use kebab-case for branch names and scopes (ie `feature/data-fetching`).
- Use commit footers to reference related issues (ie `Refs #10`). Be sure to mark resolved issues
  with `Closes/Fixes #<issue_number>`.

> ⚠️ Respecting these rules is important in order to obtain a clean and coherent changelog. If you have any doubt don't
> hesitate to ask for help.

### Hooks

We use git hooks to automatically check, lint and format the code and commit messages.

### Internal contribution process - For Politecnico di Torino employees

- Work on a branch according to the rules described above.
- Carefully review any linting/formatting errors (ask for help if you don't know how to resolve them).
- If you can, rebase or pre-merge your branch before submitting the PR.
- Open a PR against `main`.

### External contribution process - For external contributors

- Fork the repo.
- Work on a branch according to the rules described above.
- Carefully review any linting/formatting errors (ask for help if you don't know how to resolve them).
- Open a PR against `main`.
