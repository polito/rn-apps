#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Command } = require('commander');
const {
  run,
  validateWorkspaces,
  getWorkspaces,
  getCurrentWorkspace,
  MONOREPO_ROOT,
} = require('./utils');

// Checks

const program = new Command();
program.showHelpAfterError();

program
  .name('npm run add')
  .usage('<dependencies...> [options]')
  .description('Add dependencies to workspaces with proper hoisting')
  .argument('<dependencies...>', 'Dependencies to add')
  .option('-D', '--dev', 'Install to devDependencies') //  TODO: aggiungere, poi installare babel-preset-expo in dev, etc (INSTALL COMMAND SOTTO)
  .option('-a, --all', 'Target all workspaces')
  .option('-w, --workspaces <workspaces...>', 'Target workspaces');

// NPM uses "--" to separate script args; ensure commander
// sees only the user-provided arguments.
const userArgs = process.argv.slice(2).filter(arg => arg !== '--');
program.parse(['node', 'installDeps.js', ...userArgs]);

const { all: isAll, workspaces: workspacesFlag } = program.opts();

if (isAll && workspacesFlag) {
  program.error('Cannot use both --all and --workspaces flags together.');
}

let targetWorkspaces = [];
const currentWorkspace = getCurrentWorkspace();
const hasWorkspaces =
  Array.isArray(workspacesFlag) && workspacesFlag.length > 0;

if (isAll) {
  targetWorkspaces = getWorkspaces();
} else if (hasWorkspaces) {
  validateWorkspaces(workspacesFlag);
  targetWorkspaces = workspacesFlag;
} else if (currentWorkspace && currentWorkspace !== 'root') {
  targetWorkspaces = [currentWorkspace];
} else {
  program.error(
    'You must specify --all, --workspaces, or run this from a workspace directory.',
  );
}

const dependencies = program.args || [];
const cleanDependencies = dependencies.map(dep => {
  const lastAtIndex = dep.lastIndexOf('@');
  return lastAtIndex > 0 ? dep.substring(0, lastAtIndex) : dep;
});

// Logic

const libPath = path.join(MONOREPO_ROOT, 'lib');
const jsonPath = path.join(libPath, 'package.json');
const rawData = fs.readFileSync(jsonPath, 'utf-8');
const libJson = JSON.parse(rawData);

const libDeps = {
  ...(libJson.dependencies || {}),
  ...(libJson.peerDependencies || {}),
};

const needsLib = cleanDependencies.some(dep =>
  Object.keys(libDeps).includes(dep),
);
const existingWorkspaces = getWorkspaces();
let list = isAll ? existingWorkspaces : targetWorkspaces;
const wsSet = new Set(list);
if (needsLib) wsSet.add('lib');
else if (isAll) wsSet.delete('lib');
const finalWorkspaces = Array.from(wsSet);

console.log(`📦 Deps to add: ${cleanDependencies.join(', ')}`);
console.log(
  `🏗  Target workspaces: ${isAll ? 'ALL' : finalWorkspaces.join(', ')}`,
);

const uninstallWorkspaceFlags = finalWorkspaces
  .filter(ws => ws !== 'lib')
  .map(ws => `-w ${ws}`)
  .join(' ');

const installWorkspaceFlags = finalWorkspaces.map(ws => `-w ${ws}`).join(' ');

const originalDir = process.cwd();
const isLibWorkspace = path.basename(originalDir) === 'lib';
// Change to project root directory to execute the command
process.chdir(MONOREPO_ROOT);
// Remove the dependency from all workspaces (except lib) to ensure a clean slate.
const uninstallCommand =
  `npm uninstall ${cleanDependencies.join(' ')} ${uninstallWorkspaceFlags}`.trim();
run(uninstallCommand);

// Reinstall the dependencies at the root level with the appropriate workspace flags
const command =
  `npm install ${dependencies.join(' ')} ${installWorkspaceFlags}`.trim();
run(command);

console.log(
  '✅ Dependencies added successfully! Running fixpilot to clean up...',
);

if (!isLibWorkspace) {
  process.chdir(isAll || workspacesFlag ? MONOREPO_ROOT : originalDir);
  run('npm run fixpilot -- --skip-modules --skip-derived');
}
