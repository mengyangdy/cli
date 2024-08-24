import type { CliOption } from "../types";
import { loadConfig } from "c12";
import process from "node:process";

const defaultOptions: CliOption = {
  cwd: process.cwd(),
  cleanupDirs: [
    "**/dist",
    "**/package-lock.json",
    "**/yarn.lock",
    "**/pnpm-lock.yaml",
    "**/node_modules",
    "!node_modules/**",
  ],
  ncuCommandArgs: ["--deep", "-u"],
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*?))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/,
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/,
  ],
};

export async function loadCliOptions(
  overrides?: Partial<CliOption>,
  cwd = process.cwd()
) {
  const { config } = await loadConfig<Partial<CliOption>>({
    name: "dylan",
    defaults: defaultOptions,
    overrides,
    cwd,
    packageJson: true,
  });
  return config as CliOption;
}