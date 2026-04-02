#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const {
  run,
  createCliError,
  validateWorkspaces,
  getWorkspaces,
} = require('./utils');

// Checks

const args = process.argv.slice(2);
const allFlagIndex = args.indexOf('--all');
const workspaceFlagIndex = args.indexOf('--workspaces');

const addCommandUsage = `
npm run add {dependencies} -- --all
npm run add {dependencies} -- --workspaces {workspaces}`;
const fail = createCliError(addCommandUsage);

if (allFlagIndex !== -1 && workspaceFlagIndex !== -1) {
  fail('Cannot use both --all and --workspaces flags together.');
}

if (allFlagIndex === -1 && workspaceFlagIndex === -1) {
  fail('You must specify either --all or --workspaces {workspaces}.');
}

const firstFlagIndex = Math.min(
  allFlagIndex === -1 ? Infinity : allFlagIndex,
  workspaceFlagIndex === -1 ? Infinity : workspaceFlagIndex,
);

const dependencies = args.slice(0, firstFlagIndex);
const cleanDependencies = dependencies.map(dep => {
  const lastAtIndex = dep.lastIndexOf('@');
  return lastAtIndex > 0 ? dep.substring(0, lastAtIndex) : dep;
});

if (dependencies.length === 0) {
  fail('Provide at least one dependency name before the flags.');
}

let targetWorkspaces = [];
const isAll = allFlagIndex !== -1;

if (!isAll) {
  targetWorkspaces = args.slice(workspaceFlagIndex + 1);
  if (targetWorkspaces.length === 0) {
    fail('Provide at least one workspace name after --workspaces flag.');
  }
  validateWorkspaces(targetWorkspaces);
}

// Logic

const libPath = path.resolve(__dirname, '../../lib');
const jsonPath = path.resolve(libPath, 'package.json');
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
run('npm run fixpilot -- --skip-modules --skip-derived');
