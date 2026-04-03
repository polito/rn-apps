#!/usr/bin/env node
const { Command } = require('commander');
const {
  run,
  getPackageLockData,
  validateWorkspaces,
  getWorkspaces,
  getCurrentWorkspace,
  MONOREPO_ROOT,
} = require('./utils');
const path = require('path');

const action = process.env.npm_lifecycle_event;
if (!['update', 'remove'].includes(action)) {
  console.error(
    '❌ Unknown action. Use "npm run update" to update dependencies or "npm run remove" to remove them.',
  );
  process.exit(1);
}

const isUpdate = action === 'update';
const program = new Command();

program.showHelpAfterError();

if (isUpdate) {
  program
    .name('npm run update')
    .usage('<dep1[@version]> [dep2[@version] ...] [options]')
    .description('Update dependencies to latest version across workspaces');
} else {
  program
    .name('npm run remove')
    .usage('<dep1> [dep2 ...] [options]')
    .description('Remove dependencies across workspaces');
}

program
  .argument('<dependencies...>', 'Dependencies to manage')
  .option('-a, --all', 'Target all workspaces')
  .option('-w, --workspaces <workspaces...>', 'Target workspaces');

// NPM uses "--" to separate script args; ensure commander
// sees only the user-provided arguments.
const userArgs = process.argv.slice(2).filter(arg => arg !== '--');
program.parse(['node', 'manageDeps.js', ...userArgs]);

const { all: allFlag, workspaces: workspacesFlag } = program.opts();

if (allFlag && workspacesFlag) {
  program.error('Cannot use both --all and --workspaces flags together.');
}

let targetWorkspaces = [];
const currentWorkspace = getCurrentWorkspace();
const hasWorkspaces =
  Array.isArray(workspacesFlag) && workspacesFlag.length > 0;

if (allFlag) {
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

const deps = program.args || [];
const clearDeps = deps.map(dep => {
  const lastAtIndex = dep.lastIndexOf('@');
  if (lastAtIndex > 0) {
    const name = dep.substring(0, lastAtIndex);
    if (isUpdate) {
      console.warn(
        `⚠️  Warning: Version specified for ${dep} will be ignored. Updating ${name} to latest version.`,
      );
    }
    return name;
  }
  return dep;
});

const lockData = getPackageLockData();

const packages = lockData.packages || {};
const pDeps = {};
for (const workspace of targetWorkspaces) {
  const set = new Set([
    ...Object.keys(packages[workspace]?.dependencies || {}),
    ...Object.keys(packages[workspace]?.devDependencies || {}),
    ...Object.keys(packages[workspace]?.peerDependencies || {}),
  ]);
  pDeps[workspace] = set;
}

// Change to project root directory to execute the command
const originalDir = process.cwd();
const isLibWorkspace = path.basename(originalDir) === 'lib';
process.chdir(MONOREPO_ROOT);

for (const dep of clearDeps) {
  const needDep = Object.keys(pDeps).filter(ws => pDeps[ws].has(dep));
  if (needDep.length === 0) {
    console.warn(`⚠️  Warning: Dependency ${dep} not found.`);
    continue;
  }
  const command = `npm ${isUpdate ? 'install' : 'uninstall'} ${dep}${isUpdate ? '@latest' : ''} -w ${needDep.join(' -w ')}`;
  run(command);
}

if (!isLibWorkspace) {
  process.chdir(allFlag || workspacesFlag ? MONOREPO_ROOT : originalDir);
  run('npm run fixpilot -- --skip-modules --skip-derived');
}
