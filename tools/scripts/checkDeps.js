#!/usr/bin/env node

// This script checks for dependency issues in the project.

// CHECK
// 1. Identify common dependencies
// 2. Ensure they're hoisted looking at package-lock.json file

// FIX
// 1. Remove the dependencies from all workspaces
// 2. Reinstall them at the root level

const {
  run,
  maxVersionGreater,
  getWorkspaces,
  getPackageLockData,
} = require('./utils');

const isFixing = process.argv.includes('--fix');

const lockJson = getPackageLockData();
const workspaces = getWorkspaces();

const dependencyUsageCount = {};
for (const workspace of workspaces) {
  const pkgData = lockJson.packages[workspace];
  // Dependencies
  const allDeps = new Set([
    ...Object.keys(pkgData.dependencies || {}),
    ...Object.keys(pkgData.devDependencies || {}),
    ...Object.keys(pkgData.peerDependencies || {}),
  ]);
  allDeps.forEach(
    depName =>
      (dependencyUsageCount[depName] =
        (dependencyUsageCount[depName] || 0) + 1),
  );
}
const commonDeps = Object.keys(dependencyUsageCount).filter(
  dep => dependencyUsageCount[dep] > 1,
);

// Now check if they're hoisted at the root level
const occurrences = {};
const SEARCH_KEY = 'node_modules/';
for (const key of Object.keys(lockJson.packages)) {
  if (!key) continue;
  // Use firstIndex since dependencies can have nested node_modules (e.g. node_modules/some-package/node_modules/another-package)
  const firstIndex = key.indexOf(SEARCH_KEY);
  if (firstIndex === -1) {
    continue;
  }
  const depName = key.substring(firstIndex + SEARCH_KEY.length);
  if (commonDeps.includes(depName)) {
    occurrences[depName] = (occurrences[depName] || 0) + 1;
  }
}

const issues = [];
for (const dep of Object.keys(occurrences)) {
  // If a common dependency is found in any workspace, it means it's not properly hoisted
  if (occurrences[dep] > 1) {
    issues.push(dep);
  }
}

if (issues.length === 0) {
  console.log(
    `✅ All (${commonDeps.length}) common dependencies are properly hoisted.`,
  );
  process.exit(0);
}

// For each issue, gather details about which workspaces have it and their versions
const physicalOccurrences = {};
for (const depName of issues) {
  const rootVersion =
    lockJson.packages[`node_modules/${depName}`]?.version ?? '(not present)';
  physicalOccurrences[depName] = {
    versions: [],
    rootVersion,
  };
  for (const workspace of workspaces) {
    const pkgData = lockJson.packages;
    const wsKey = `${workspace}/node_modules/${depName}`;
    if (pkgData[wsKey]) {
      physicalOccurrences[depName].versions.push({
        name: workspace,
        version: pkgData[wsKey].version,
      });
    } else {
      physicalOccurrences[depName].versions.push({
        name: workspace,
        version: rootVersion,
      });
    }
  }
}

// REPORTING

if (!isFixing) {
  console.log('\n❌ Found unhoisted dependency issues:\n');
  for (const depName of issues) {
    const data = physicalOccurrences[depName];
    const rootVer = data.rootVersion || '(not present)';
    console.log(`📦 ${depName}`);
    console.log(`   Root version:  ${rootVer}`);
    console.log(`   Workspaces:`);
    data.versions.forEach(ws => {
      const diffWarning = ws.version !== rootVer ? ' ⚠️  mismatch' : '';
      console.log(`     - ${ws.name.padEnd(20)} [${ws.version}]${diffWarning}`);
    });
    console.log('');
  }
  console.log('-----------------------------------------------------------');
  console.log(`💡 Found ${issues.length} package(s) with hoisting issues.`);
  console.log(`Run 'npm run deps:fix' to fix these automatically.`);
  process.exit(1);
}

// FIXING

if (isFixing) {
  console.log(`Found ${issues.length} dependency issues. Fixing...\n`);
  for (const dep of Object.keys(physicalOccurrences)) {
    const versions = physicalOccurrences[dep].versions;
    if (versions.length === 0) {
      continue; // No need to fix if it's not present in any workspace
    }
    const rootVer = physicalOccurrences[dep].rootVersion || '0.0.0';
    const maxVersion = versions.reduce((max, curr) => {
      return maxVersionGreater(max, curr.version) ? max : curr.version;
    }, rootVer);
    run(
      `npm run add ${dep}@${maxVersion} -- --workspaces ${versions
        .map(ws => ws.name)
        .join(' ')}`,
    );
  }
  console.log('\n✅ Dependency issues fixed.');
  process.exit(0);
}
