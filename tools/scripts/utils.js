#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const handleStop = () => {
  console.log('\n❌ Operation cancelled by user');
  process.exit(1);
};

process.on('SIGINT', handleStop);
process.on('SIGTERM', handleStop);

function run(
  cmd,
  {
    stdio = 'inherit',
    shell = process.env.SHELL || '/bin/bash',
    ...options
  } = {},
  stopOnError = true,
) {
  try {
    const out = execSync(cmd, { stdio, shell, ...options });
    const str = out?.toString();
    if (str) console.log(str);
  } catch (error) {
    if (error.signal === 'SIGINT' || error.signal === 'SIGTERM') {
      handleStop();
    }
    if (!stopOnError) {
      throw error;
    }
    console.error(`❌ ${error.message}`);
    process.exit(1);
  }
}

const createCliError = commandUsage => {
  return (message, showUsage = true) => {
    console.error(`\x1b[31m❌ Error:\x1b[0m ${message}`);
    if (showUsage && commandUsage) {
      console.error(`\n\x1b[2mUsage:\x1b[0m${commandUsage}\n`);
    } else {
      console.error('');
    }
    process.exit(1);
  };
};

const maxVersionGreater = (v1, v2) => {
  const parse = v =>
    v
      .split('.')
      .map(num => parseInt(num, 10))
      .filter(num => !isNaN(num));
  const [major1, minor1 = 0, patch1 = 0] = parse(v1);
  const [major2, minor2 = 0, patch2 = 0] = parse(v2);
  if (major1 !== major2) {
    return major1 > major2;
  }
  if (minor1 !== minor2) {
    return minor1 > minor2;
  }
  return patch1 > patch2;
};

const getPackageJsonData = () => {
  const jsonPath = path.resolve(__dirname, '../../package.json');
  if (!fs.existsSync(jsonPath)) {
    console.error('❌ package.json not found.');
    process.exit(1);
  }
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(rawData);
};

const getPackageLockData = () => {
  const lockPath = path.resolve(__dirname, '../../package-lock.json');
  if (!fs.existsSync(lockPath)) {
    console.error('❌ package-lock.json not found.');
    process.exit(1);
  }
  const rawData = fs.readFileSync(lockPath, 'utf-8');
  return JSON.parse(rawData);
};

function getWorkspaces() {
  const rootJson = getPackageJsonData();
  return rootJson.workspaces || [];
}

module.exports = {
  run,
  getWorkspaces,
  maxVersionGreater,
  getPackageJsonData,
  getPackageLockData,
  createCliError,
};
