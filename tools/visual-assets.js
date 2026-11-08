import { readFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve, relative, isAbsolute, join } from 'node:path';

const expected = ['greet', 'chuna', 'acupuncture', 'examination', 'walk'];
const sections = ['about', 'experience', 'education', 'research', 'additional'];

function internalPath(root, file) {
  const path = resolve(root, file);
  const rel = relative(root, path);
  if (rel.startsWith('..') || isAbsolute(rel) || !existsSync(path)) throw new Error(`장식 자산 경로를 확인해 주세요: ${file}`);
  return path;
}
function pngDimensions(path) {
  const bytes = readFileSync(path);
  if (bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error('캐릭터 시트는 PNG여야 합니다.');
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}
export function checkVisualAssets(projectRoot, assetRoot = join(projectRoot, 'public')) {
  const directory = join(assetRoot, 'assets/characters/300');
  const motions = JSON.parse(readFileSync(join(directory, 'motions.json'), 'utf8'));
  if (motions.character !== '300' || motions.direction !== 'SE' || motions.outfit !== 'mint-scrubs-white-coat') throw new Error('300 캐릭터의 SE 방향·기본 의상을 확인해 주세요.');
  for (const key of expected) {
    const action = motions.actions?.[key];
    if (!action || !Number.isInteger(action.frames) || action.frames < 2 || action.columns !== action.frames || action.rows !== 1) throw new Error(`캐릭터 모션 프레임 구성이 잘못됐습니다: ${key}`);
    if (action.durations.length !== action.frames || action.durations.some(ms => !Number.isFinite(ms) || ms <= 0)) throw new Error(`캐릭터 모션 시간을 확인해 주세요: ${key}`);
    if (Math.abs(action.durations.reduce((sum, ms) => sum + ms, 0) - action.durationMs) > .01) throw new Error(`캐릭터 모션 총 시간이 다릅니다: ${key}`);
    for (const [field, width, height, hash] of [
      ['sheet', action.frames * action.frameWidth, action.frameHeight, action.sheetSha256],
      ['poster', action.frameWidth, action.frameHeight, action.posterSha256],
    ]) {
      const path = internalPath(directory, action[field]);
      const dimensions = pngDimensions(path);
      if (dimensions.width !== width || dimensions.height !== height) throw new Error(`캐릭터 시트 크기가 다릅니다: ${key}/${field}`);
      if (createHash('sha256').update(readFileSync(path)).digest('hex') !== hash) throw new Error(`캐릭터 자산 해시가 다릅니다: ${key}/${field}`);
    }
  }
  for (const name of sections) {
    const path = internalPath(assetRoot, `assets/section-art/${name}.webp`);
    const bytes = readFileSync(path);
    if (bytes.subarray(0, 4).toString() !== 'RIFF' || bytes.subarray(8, 12).toString() !== 'WEBP') throw new Error(`섹션 배경 파일을 확인해 주세요: ${name}`);
  }
  const assetManifest = JSON.parse(readFileSync(join(projectRoot, 'assets-manifest.json'), 'utf8'));
  for (const asset of assetManifest.assets) {
    if (!asset.path.startsWith('public/')) throw new Error('공개 자산 목록의 경로를 확인해 주세요.');
    const bytes = readFileSync(internalPath(assetRoot, asset.path.slice('public/'.length)));
    if (bytes.length !== asset.bytes || createHash('sha256').update(bytes).digest('hex') !== asset.sha256) throw new Error(`공개 자산 목록의 크기·해시가 다릅니다: ${asset.path}`);
  }
  const html = readFileSync(join(projectRoot, 'index.html'), 'utf8');
  const used = [...html.matchAll(/data-medical-motion="([^"]+)"/g)].map(match => match[1]);
  if (used.join() !== expected.join()) throw new Error('프로필 제목과 5개 의료 모션 연결 순서를 확인해 주세요.');
  return { motions: expected.length, frames: expected.reduce((sum, key) => sum + motions.actions[key].frames, 0), backgrounds: sections.length };
}
