import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['node_modules', 'dist', '.git', 'private', 'artifacts']);
const privateField = /^(?:phone|mobile|telephone|email|address|birth(?:day|date)?|dateOfBirth|resident(?:Number|Id)?|주민등록번호|생년월일|주소|연락처|전화번호)$/i;

function inspectData(value, key = '') {
  if (privateField.test(key)) throw new Error(`공개 프로필에서 개인정보 필드를 확인해 주세요: ${key}`);
  if (Array.isArray(value)) return value.forEach(item => inspectData(item));
  if (value && typeof value === 'object') return Object.entries(value).forEach(([name, item]) => inspectData(item, name));
  if (typeof value !== 'string') return;
  if (/\b01[016789][- .]?\d{3,4}[- .]?\d{4}\b/.test(value)) throw new Error('공개 프로필에 휴대전화 번호 형식이 있습니다.');
  if (/\b\d{6}-[1-8]\d{6}\b/.test(value)) throw new Error('공개 프로필에 개인 식별번호 형식이 있습니다.');
  if (/^\s*(?:javascript|file):/i.test(value)) throw new Error('공개 프로필에 허용하지 않는 링크가 있습니다.');
  if (/[A-Z]:[\\/](?:Users|Windows)[\\/]/i.test(value)) throw new Error('공개 프로필에 로컬 파일 경로가 있습니다.');
}

function inspectSources(directory) {
  for (const item of readdirSync(directory, { withFileTypes: true })) {
    if (excluded.has(item.name)) continue;
    const path = join(directory, item.name);
    if (item.isDirectory()) inspectSources(path);
    else if (/\.(?:hwp|hwpx|bak|env)$/i.test(item.name) || /^\.env(?:\.|$)/.test(item.name)) {
      throw new Error(`공개 저장소에 원본 문서 또는 비공개 설정 파일이 있습니다: ${item.name}`);
    }
  }
}

try {
  const profile = JSON.parse(readFileSync(join(root, 'data/profile.json'), 'utf8'));
  if (!profile || typeof profile !== 'object' || Array.isArray(profile) || !Object.keys(profile).length) throw new Error('프로필 JSON은 비어 있지 않은 객체여야 합니다.');
  if (!profile.site?.title || !profile.about?.lead || !profile.about?.description) throw new Error('사이트 제목과 소개 문구를 확인해 주세요.');
  for (const field of ['highlights', 'experience', 'education', 'medicalQualifications', 'publications', 'activities', 'additional']) {
    if (!Array.isArray(profile[field])) throw new Error(`프로필 목록을 확인해 주세요: ${field}`);
    const ids = new Set();
    for (const item of profile[field]) {
      if (!item.id || ids.has(item.id)) throw new Error(`프로필 항목의 ID가 없거나 중복됩니다: ${field}`);
      ids.add(item.id);
      if (item.url && !/^https?:\/\//i.test(item.url)) throw new Error(`프로필 외부 링크를 확인해 주세요: ${item.id}`);
      if (field === 'experience' && (!item.organization || !item.role || !item.period)) throw new Error(`임상 경력의 날짜·기관·역할을 확인해 주세요: ${item.id}`);
    }
  }
  if (!Array.isArray(profile.about.clinicalFocus)) throw new Error('진료 경험 목록을 확인해 주세요.');
  inspectData(profile);
  inspectSources(root);
  for (const name of ['white-coat.png', 'suit.png', 'favicon.png']) {
    const path = join(root, 'public/assets', name);
    if (!existsSync(path) || !statSync(path).isFile()) throw new Error(`사진 파일이 없습니다: ${name}`);
    const bytes = readFileSync(path);
    if (bytes.length < 24 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a') throw new Error(`PNG 사진 파일을 확인해 주세요: ${name}`);
  }
  console.log('공개 프로필 JSON·사진·원본 문서 제외 검사 통과');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
