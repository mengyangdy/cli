export interface CliOption {
  /**
   * 项目根目录
   */
  cwd: string;

  /**
   * 清除的目录
   */
  cleanupDirs: string[];

  /**
   * 更新包
   */
  ncuCommandArgs: string[];

  /**
   * git提交的忽略列表
   */
  gitCommitVerifyIgnores: RegExp[];
}
