#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SCRIPT_DIR = __dirname;
const RULES_DIR = path.join(SCRIPT_DIR, 'rules');
const SEPARATOR = '\n\n<!-- --- Everything Droid Rules --- -->\n\n';

const LANG_NAME_RE = /^[a-zA-Z0-9_-]+$/;

function usage() {
  console.log('Usage: edroid-install <language> [<language> ...]');
  console.log('');
  console.log('Appends common + language-specific rules to AGENTS.md in the current directory.');
  console.log('');
  console.log('Available languages:');
  if (fs.existsSync(RULES_DIR)) {
    for (const entry of fs.readdirSync(RULES_DIR, { withFileTypes: true })) {
      if (entry.isDirectory() && entry.name !== 'common') {
        console.log('  - ' + entry.name);
      }
    }
  }
  console.log('');
  console.log('Examples:');
  console.log('  edroid-install typescript');
  console.log('  edroid-install typescript python');
  console.log('  node install.js typescript golang');
  process.exit(1);
}

function readMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return '';

  const files = fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .sort();

  let content = '';
  for (const file of files) {
    const filePath = path.join(dir, file);
    const text = fs.readFileSync(filePath, 'utf8').trim();

    // Strip YAML frontmatter (---...---)
    const stripped = text.replace(/^---[\s\S]*?---\s*/, '').trim();
    if (stripped) {
      content += stripped + '\n\n';
    }
  }
  return content;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args.includes('--help') || args.includes('-h')) {
    usage();
  }

  // Validate language names
  for (const lang of args) {
    if (!LANG_NAME_RE.test(lang)) {
      console.error('Error: invalid language name "' + lang + '". Only alphanumeric, dash, and underscore allowed.');
      process.exit(1);
    }
    const langDir = path.join(RULES_DIR, lang);
    if (!fs.existsSync(langDir)) {
      console.error('Warning: rules/' + lang + '/ does not exist, skipping.');
    }
  }

  // Read common rules (always included)
  const commonDir = path.join(RULES_DIR, 'common');
  if (!fs.existsSync(commonDir)) {
    console.error('Error: rules/common/ directory not found at ' + commonDir);
    process.exit(1);
  }

  console.log('Reading common rules...');
  let rulesContent = readMarkdownFiles(commonDir);

  // Read language-specific rules
  for (const lang of args) {
    const langDir = path.join(RULES_DIR, lang);
    if (fs.existsSync(langDir)) {
      console.log('Reading ' + lang + ' rules...');
      rulesContent += readMarkdownFiles(langDir);
    }
  }

  if (!rulesContent.trim()) {
    console.error('Error: no rules content found.');
    process.exit(1);
  }

  // Target AGENTS.md in current working directory
  const agentsPath = path.join(process.cwd(), 'AGENTS.md');
  let existingContent = '';

  if (fs.existsSync(agentsPath)) {
    existingContent = fs.readFileSync(agentsPath, 'utf8');

    // Remove previous everything-droid rules if present (for re-runs)
    const sepIndex = existingContent.indexOf('<!-- --- Everything Droid Rules --- -->');
    if (sepIndex !== -1) {
      existingContent = existingContent.substring(0, sepIndex).trimEnd();
      console.log('Replacing previous Everything Droid rules section...');
    } else {
      console.log('Appending to existing AGENTS.md...');
    }
  } else {
    console.log('Creating new AGENTS.md...');
  }

  const finalContent = existingContent
    ? existingContent + SEPARATOR + rulesContent.trimEnd() + '\n'
    : rulesContent.trimEnd() + '\n';

  fs.writeFileSync(agentsPath, finalContent, 'utf8');

  console.log('Done. Rules installed to ' + agentsPath);
  console.log('');
  console.log('Installed: common + ' + args.join(', '));
}

main();
