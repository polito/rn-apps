#!/usr/bin/env node

const {
  run,
  getWorkspaces,
  getPackageLockData,
  createCliError,
} = require('./utils');

const failUpdate = createCliError(`
  npm run update <dep1[@version]> <dep2[@version]> ...\
  `);

const failRemove = createCliError(`
  npm run remove <dep1> <dep2> ...\
  `);

const action = process.env.npm_lifecycle_event;
if (!['update', 'remove'].includes(action)) {
  console.error(
    '❌ Unknown action. Use "npm run update" to update dependencies or "npm run remove" to remove them.',
  );
}
const isUpdate = action === 'update';
const toManage = process.argv.slice(2);

if (toManage.length === 0) {
  if (isUpdate) {
    failUpdate('No dependencies specified to update.');
  } else {
    failRemove('No dependencies specified to remove.');
  }
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

const existingWorkspaces = getWorkspaces();
const lockData = getPackageLockData();

const packages = lockData.packages || {};
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
