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
  revert: '⏪',
  init: '🎉',
  types: '🏷️',
  release: '🚀',
  deps: '⬆️',
  security: '🔒️'
};

export async function gitCommit(lang: Lang = 'en-us') {
  const { gitCommitMessages, gitCommitTypes } = locales[lang];

  const typesChoices = gitCommitTypes.map(([value, msg]) => {
    const nameWithSuffix = `${value}:`;

    const message = `${nameWithSuffix.padEnd(12)}${msg}`;

    return {
      name: value,
      message,
    };
  });



  const result = await prompt<PromptObject>([
    {
      name: "types",
      type: "select",
      message: gitCommitMessages.types,
      choices: typesChoices,
    },
    {
      name: "scopes",
      type: "text",
      message: gitCommitMessages.scopes,
    },
    {
      name: "description",
      type: "text",
      message: gitCommitMessages.description,
    },
  ]);

  const isBreaking = result.description.startsWith("!");

  const emoji = isBreaking ? '💥' : (TYPE_EMOJIS[result.types] || ""); // 如果是破坏性改动，显示爆炸图标

  const emojiStr = emoji ? `${emoji} ` : "";

  const breaking = isBreaking ? "!" : "";

  const description = result.description.replace(/^!/, "").trim();

  const scope = result.scopes ? `(${result.scopes})` : "";

  const commitMsg = `${emojiStr}${result.types}${scope}${breaking}: ${description}`;

  await execCommand("git", ["commit", "-m", commitMsg], { stdio: "inherit" });
}

export async function gitCommitVerify(lang: Lang = 'en-us', ignores: RegExp[] = []) {
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  if (ignores.some(regExp => regExp.test(commitMsg))) return;

  const REG_EXP = /^(?:.+ )?(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify;

    throw new Error(errorMsg);
  }
}
