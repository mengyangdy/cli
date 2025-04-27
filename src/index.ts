#!/usr/bin/env node
import cac from "cac";
import {version} from "../package.json";
import {loadCliOptions} from "./config";
import {cleanup, genChangelog, gitCommit, gitCommitVerify, ncu, release} from "./command";
import type {Lang} from "./locales";
import type {CliOption} from './types'

type Command = "git-commit" | "git-commit-verify" | "cleanup" | "ncu" | "release" | "changelog";

type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

type CommandWithAction<A extends object = object> = Record<
  Command,
  { desc: string; action: CommandAction<A> }
>;

interface CommandArg {
  /** 在版本提升后和 git 提交前执行额外的命令，默认为 '~~npx dy changelog~~' */
  execute?: string;
  /** 表示是否推送 git 提交和标签，默认为 true */
  push?: boolean;
  /** 通过总标签生成变更日志 */
  total?: boolean;
  /**
   * 要清理的目录的全局模式
   *
   * 如果未设置，则使用默认值
   *
   * 多个值使用 "," 分隔
   */
  cleanupDir?: string;
  lang?: Lang;
}

async function setupCli() {
  const cliOptions = await loadCliOptions()
  const cli = cac('dylan')
  cli
    .version(version)
    .option(
      "-e, --execute [command]",
      "Execute additional command after bumping and before git commit. Defaults to 'npx dy changelog'"
    )
    .option('-l, --lang <lang>', 'display lang of cli', { default: 'en-us', type: [String] })
    .help()

  const commands: CommandWithAction<CommandArg> = {
    cleanup: {
      desc: 'delete dirs: node_modules, dist, pnpm-lock.yaml...',
      action: async args => {
        const cleanupDirs = args?.cleanupDir?.split(',') || [];
        const formattedDirs = cleanupDirs.map(dir => dir.trim()).filter(Boolean);
        if (formattedDirs.length) {
          cliOptions.cleanupDirs = formattedDirs;
        }

        await cleanup(cliOptions.cleanupDirs);
      }
    },
    "git-commit": {
      desc: "git commit, generate commit message which match Conventional Commits standard",
      action: async (args) => {
        await gitCommit(args?.lang);
      },
    },
    "git-commit-verify": {
      desc: "verify git commit message, make sure it match Conventional Commits standard",
      action: async (args) => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores);
      },
    },
    ncu: {
      desc: 'npm-check-updates, it can update package.json dependencies to the latest version',
      action: async () => {
        await ncu()
      }
    },
    release: {
      desc: 'release: update version, generate changelog, commit code',
      action: async args => {
        await release(args?.execute, args?.push);
      }
    },
    changelog: {
      desc: 'generate changelog',
      action: async args => {
        await genChangelog(cliOptions.changelogOptions, args?.total);
      }
    },
  }

  for await (const [command, {desc, action}] of Object.entries(commands)) {
    cli.command(command, desc).action(action);
  }

  cli.parse();
}

setupCli()

export function defineConfig(config?: Partial<CliOption>) {
  return config;
}

export type {CliOption};