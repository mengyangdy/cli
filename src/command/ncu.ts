import { execCommand } from '../shared';

export async function ncu(args: string[] = ['--deep', '-u']) {
  execCommand('npx', ['npm-check-updates@latest', ...args], { stdio: 'inherit' });
}
