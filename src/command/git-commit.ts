import path from "node:path";
import {readFileSync} from "node:fs";
import {prompt} from 'enquirer'

import {execCommand} from "../shared";

import {locales} from '../locales';
import type {Lang} from '../locales';

interface PromptObject {
  types: string
  scopes: string
  description: string
}

// 添加emoji映射
const TYPE_EMOJIS: Record<string, string> = {
  feat: '✨',
  fix: '🐛',
  docs: '📝',
  style: '💄',
  refactor: '♻️',
  perf: '⚡',
  optimize: '🔧',
  test: '✅',
  build: '📦',
  ci: '🤖',
  chore: '🛠️',
  revert: '⏪'
};

export async function gitCommit(lang: Lang = 'en-us') {
  const { gitCommitMessages, gitCommitTypes, gitCommitScopes } = locales[lang];

  const typesChoices = gitCommitTypes.map(([value, msg]) => {
    const nameWithSuffix = `${value}:`;

    const message = `${nameWithSuffix.padEnd(12)}${msg}`;

    return {
      name: value,
      message,
    };
  });

  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    name: value,
    message: `${value.padEnd(30)} (${msg})`,
  }));

  const result = await prompt<PromptObject>([
    {
      name: "types",
      type: "select",
      message: gitCommitMessages.types,
      choices: typesChoices,
    },
    {
      name: "scopes",
      type: "select",
      message: gitCommitMessages.scopes,
      choices: scopesChoices,
    },
    {
      name: "description",
      type: "text",
      message: gitCommitMessages.description,
    },
  ]);

  const emoji = TYPE_EMOJIS[result.types] || ""; // 获取对应类型的emoji

  const breaking = result.description.startsWith("!") ? "!" : "";

  const description = result.description.replace(/^!/, "").trim();

  const commitMsg = `${result.types}(${result.scopes})${breaking}: ${emoji} ${description}`;

  await execCommand("git", ["commit", "-m", commitMsg], { stdio: "inherit" });
}

export async function gitCommitVerify(lang: Lang = 'en-us', ignores: RegExp[] = []) {
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  if (ignores.some(regExp => regExp.test(commitMsg))) return;

  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify;

    throw new Error(errorMsg);
  }
}
