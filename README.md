# Browser LLM

Browser-Based Chat with Client-Side LLMs (WASM-Powered).

This project aims to create a chat application that runs Large Language Models (LLMs) directly in the user's browser using WebAssembly (WASM). This allows for private, client-side AI interactions without needing server-side GPU resources for inference.

## Project Setup

### Requirements

- **Node.js**: Version 22 or higher (as specified in CI workflow).
- **pnpm**: Version 10.11.0 or higher (as specified in `package.json` `packageManager`).

### Installation

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Available Scripts

The following scripts are available in `package.json`:

- `pnpm run dev`: Starts the Vite development server.
- `pnpm run build`: Builds the application for production (includes TypeScript compilation and Vite build).
- `pnpm run lint`: Lints the codebase using ESLint.
- `pnpm run preview`: Serves the production build locally for preview.
- `pnpm run format`: Formats the codebase using Prettier.
- `pnpm run format:check`: Checks if the codebase is formatted correctly with Prettier (used in CI).

## Development Workflow

### Formatting and Linting

This project uses Prettier for code formatting and ESLint for linting.

- **Formatting**: Ensure your code is formatted by running `pnpm run format` before committing.
- **Linting**: Check for linting errors by running `pnpm run lint`.

These checks are also enforced by the CI pipeline.

## CI/CD (Continuous Integration / Continuous Deployment)

The project uses GitHub Actions for CI/CD, defined in `.github/workflows/deploy.yml`.

### CI (Continuous Integration)

- **Trigger**: The CI process runs automatically on:
  - Every push to any branch in the repository.
  - Every pull request targeting the `main` branch.
- **Checks**: The `build_and_test` job performs the following:
  1.  Checks out the code.
  2.  Sets up Node.js and pnpm.
  3.  Installs dependencies (`pnpm install`).
  4.  Runs ESLint (`pnpm run lint`).
  5.  Checks code formatting with Prettier (`pnpm run format:check`).
- **Requirement for Developers**: For the CI pipeline to pass (and thus allow merging to `main` or successful deployment), your code **must be free of linting errors and correctly formatted** according to Prettier rules.

### CD (Continuous Deployment)

- **Trigger**: Deployment to GitHub Pages occurs automatically only on a `push` event to the `main` branch (e.g., after a pull request is merged).
- **Condition**: The deployment job (`deploy_to_github_pages`) will **only run if the `build_and_test` (CI) job completes successfully** for that commit on the `main` branch.
- **Process**: The deployment job performs the following:
  1.  Checks out the code.
  2.  Sets up Node.js and pnpm.
  3.  Installs dependencies.
  4.  Builds the application (`pnpm run build`) with the correct `BASE_URL` for GitHub Pages.
  5.  Configures GitHub Pages.
  6.  Uploads the build artifact (from the `./dist` directory).
  7.  Deploys the artifact to GitHub Pages.
