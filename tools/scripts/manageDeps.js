#!/usr/bin/env node

const {
  run,
  getPackageLockData,
  createCliError,
  validateWorkspaces,
  getWorkspaces,
} = require('./utils');

const failUpdate = createCliError(`
  npm run update <dep1[@version]> [dep2[@version] ...] [--workspaces <ws1> <ws2> ...]\
  `);

const failRemove = createCliError(`
  npm run remove <dep1> [dep2 ...] [--workspaces <ws1> <ws2> ...]\
  `);

const action = process.env.npm_lifecycle_event;
if (!['update', 'remove'].includes(action)) {
  console.error(
    '❌ Unknown action. Use "npm run update" to update dependencies or "npm run remove" to remove them.',
  );
  process.exit(1);
}

const isUpdate = action === 'update';
const args = process.argv.slice(2);
const workspaceFlagIndex = args.indexOf('--workspaces');

const firstFlagIndex = Math.min(
  workspaceFlagIndex === -1 ? Infinity : workspaceFlagIndex,
);

const toManage = args.slice(0, firstFlagIndex);

if (toManage.length === 0) {
  if (isUpdate) {
    failUpdate('No dependencies specified to update.');
  } else {
    failRemove('No dependencies specified to remove.');
  }
}

const targetWorkspaces = args.slice(firstFlagIndex + 1);
if (targetWorkspaces.length > 0) {
  validateWorkspaces(targetWorkspaces);
}

const clearDeps = toManage.map(dep => {
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

// Update/Remove using workspaces if avaiable
if (targetWorkspaces.length > 0) {
  const workspacesArgs = targetWorkspaces.map(ws => `-w ${ws}`).join(' ');
  const depsArgs = clearDeps.join(' ');
  const command = `npm ${isUpdate ? 'install' : 'uninstall'} ${depsArgs}${isUpdate ? '@latest' : ''} ${workspacesArgs}`;
  run(command);
  process.exit(0);
}

const lockData = getPackageLockData();

const packages = lockData.packages || {};
const existingWorkspaces = getWorkspaces();
const pDeps = {};
for (const workspace of existingWorkspaces) {
  const set = new Set([
    ...Object.keys(packages[workspace]?.dependencies || {}),
    ...Object.keys(packages[workspace]?.devDependencies || {}),
    ...Object.keys(packages[workspace]?.peerDependencies || {}),
  ]);
  pDeps[workspace] = set;
}

for (const dep of clearDeps) {
  const needDep = Object.keys(pDeps).filter(ws => pDeps[ws].has(dep));
  if (needDep.length === 0) {
    console.warn(`⚠️  Warning: Dependency ${dep} not found in any workspace.`);
    continue;
  }
  const command = `npm ${isUpdate ? 'install' : 'uninstall'} ${dep}${isUpdate ? '@latest' : ''} -w ${needDep.join(' -w ')}`;
  run(command);
}
