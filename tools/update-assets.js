import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const inputs = [
  ['white-coat.png', '메인 프로필', '사용자 제공 가운 PNG', '원본 복사'],
  ['suit.png', '보조 프로필', '사용자 제공 양복 PNG', '원본 복사'],
  ['favicon.png', '브라우저 아이콘', '사용자 제공 가운 PNG', '얼굴 영역 기술적 크롭 및 192×192 축소 · 인물 재생성 없음'],
];
const assets = inputs.map(([name, purpose, source, processing]) => {
  const path = `public/assets/${name}`;
  const bytes = readFileSync(resolve(root, path));
  return { path, purpose, source, processing, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
});
writeFileSync(resolve(root, 'assets-manifest.json'), JSON.stringify({ assets }, null, 2) + '\n');
console.log('선택 프로필 이미지 3개의 해시를 기록했습니다.');
