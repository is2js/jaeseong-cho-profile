import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
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
for (const [folder, source] of [
  ['section-art', 'built-in imagegen · PVP 의료 도구 모티프'],
  ['characters/300', 'PVP RPG 300 기본 mint 의상 · SE 방향 원본 모션'],
  ['floating-props', 'PVP RPG LK 진료실 투명 의료 모티프 · 단순 추출·축소'],
]) {
  for (const name of readdirSync(resolve(root, 'public/assets', folder))) {
    if (!/\.(png|webp|json)$/.test(name)) continue;
    const path = `public/assets/${folder}/${name}`;
    const assetPath = resolve(root, path);
    // Hash the canonical JSON bytes that Git checks out on the Linux runner.
    if (name.endsWith('.json')) writeFileSync(assetPath, readFileSync(assetPath, 'utf8').replace(/\r\n/g, '\n'));
    const bytes = readFileSync(assetPath);
    assets.push({ path, source, bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') });
  }
}
writeFileSync(resolve(root, 'assets-manifest.json'), JSON.stringify({ assets }, null, 2) + '\n');
console.log(`선택 프로필·의료 일러스트·캐릭터 파일 ${assets.length}개의 해시를 기록했습니다.`);
