import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, relative, isAbsolute, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const origin = 'https://pages-check.invalid';
const prefix = '/jaeseong-cho-profile/';
const seen = new Set();

function inspectReference(reference, from) {
  if (!reference || /^(?:#|data:|mailto:|tel:)/i.test(reference)) return;
  const url = new URL(reference, from);
  if (url.origin !== origin) return;
  if (!url.pathname.startsWith(prefix)) throw new Error(`Pages 하위 경로를 벗어난 참조: ${reference}`);
  let local = resolve(dist, decodeURIComponent(url.pathname.slice(prefix.length)));
  const rel = relative(dist, local);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`배포 폴더를 벗어난 참조: ${reference}`);
  if (url.pathname.endsWith('/')) local = join(local, 'index.html');
  if (!existsSync(local) || !statSync(local).isFile()) throw new Error(`배포 파일이 없습니다: ${reference}`);
  if (seen.has(local)) return;
  seen.add(local);
  if (local.endsWith('.css')) {
    for (const match of readFileSync(local, 'utf8').matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)) inspectReference(match[1], url.href);
  }
  if (local.endsWith('.js') && /\/@vite\/client|import\.meta\.(?:env|hot)\b/.test(readFileSync(local, 'utf8'))) throw new Error('개발 서버 전용 코드가 배포 파일에 남아 있습니다.');
}

function inspectFiles(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, item.name);
    if (item.isDirectory()) inspectFiles(path);
    else if (/\.(?:hwp|hwpx)$/i.test(item.name) || /^\.env(?:\.|$)/.test(item.name)) throw new Error(`원본 문서 또는 비공개 설정이 배포에 포함되었습니다: ${item.name}`);
  }
}

try {
  const html = readFileSync(join(dist, 'index.html'), 'utf8');
  if (!/<html\b[^>]*lang=["']ko["']/.test(html)) throw new Error('문서 언어 설정을 확인해 주세요.');
  if (/\/@vite\/client/.test(html)) throw new Error('개발 HTML이 배포 결과에 포함되었습니다.');
  for (const match of html.matchAll(/(?<![:\w-])(?:src|href)\s*=\s*["']([^"']+)["']/g)) inspectReference(match[1], origin + prefix);
  for (const name of ['white-coat.png', 'suit.png', 'favicon.png']) inspectReference(`./assets/${name}`, origin + prefix);
  inspectFiles(dist);
  if (!seen.size) throw new Error('배포 자산을 확인할 수 없습니다.');
  console.log(`정적 배포 검사 통과: ${prefix}, 파일 ${seen.size}개`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
