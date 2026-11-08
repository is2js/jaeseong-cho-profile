# 한의사 조재성

한의사 조재성의 공개 프로필을 위한 독립 정적 사이트입니다. 강의노트와 저장소·데이터·배포를 공유하지 않습니다. 크림·세이지 색상과 원본 프로필 사진을 사용하며 한의사 학력·수련·임상 경력을 중심으로 소개합니다.

- 사이트: [한의사 조재성](https://is2js.github.io/jaeseong-cho-profile/)
- 저장소: [is2js/jaeseong-cho-profile](https://github.com/is2js/jaeseong-cho-profile)
- 구성: Alpine.js, Tailwind CSS, Vite → GitHub Pages 정적 배포

## 로컬에서 보기

Node.js 24를 준비한 뒤 프로젝트 폴더에서 실행합니다.

```powershell
npm ci
npm run dev
```

[로컬 미리보기](http://127.0.0.1:5192/)는 PC에서 개발 서버가 켜져 있는 동안 열립니다.

## 소개 내용과 사진 수정

공개 프로필 데이터는 `data/profile.json`에 있습니다. 이력의 날짜·기관·설명·항목 순서와 링크를 수정한 후 파일을 저장하면 로컬 화면에 반영됩니다. 실제 화면 구성과 강조 방식은 `index.html`, `src/`에서 관리합니다.

사진은 아래의 파일을 같은 이름으로 교체합니다. 투명 PNG와 원본 비율을 유지하는 것을 권합니다.

| 파일 | 용도 |
| --- | --- |
| `public/assets/white-coat.png` | 가운 차림의 메인 소개 사진 |
| `public/assets/suit.png` | 양복 차림의 보조 프로필 사진 |
| `public/assets/favicon.png` | 브라우저 탭 아이콘 |

## 소주제 일러스트와 제목 캐릭터

장식 일러스트는 아래의 소주제 `h2` 제목에 하나씩, 총 다섯 개만 표시합니다. 학력·자격·논문·기관명 등 내부 콘텐츠에는 소품을 넣지 않습니다. 큰 생성 배경도 현재 화면에서는 표시하지 않습니다. 기존 생성 이미지와 프롬프트·출처는 `public/assets/section-art/`에 보관합니다.

| 소주제 | 일러스트 (`floating-props/`) | 300 캐릭터 모션 |
| --- | --- | --- |
| 안녕하세요 | `herbal-pot.webp` | 인사 `greet` |
| 임상에서 쌓아온 경험 | `chuna.webp` | 추나 `chuna` |
| 배움의 바탕과 수련 | `acupuncture.webp` | 침 `acupuncture` |
| 연구로 넓혀온 시선 | `ultrasound.webp` | 이학적검사 `examination` |
| 그 밖의 배움과 자격 | `ginseng.webp` | 걷기 `walk` |

캐릭터는 원본 PVP의 300 / SE(남동쪽) / 기본 mint 외형입니다. 기본 외형은 **민트 초록 스크럽 위에 흰 가운**을 입습니다. 프레임을 다시 그리거나 게임 원본을 수정하지 않고, 원본 프레임을 공통 비율로 축소해 독립 가로 시트로 보관했습니다. 침 동작은 원본 침 레이어를 원래 배치대로 합성합니다.

`public/assets/characters/300/motions.json`에 5개 동작의 프레임 수·크기·원본 시간이 있습니다. 재생은 `src/medical-motions.js`에서 다루고, 걷기를 제외한 동작 사이에는 짧은 대기를 둡니다. 화면 밖과 숨겨진 탭에서는 재생을 멈춥니다. 브라우저의 움직임 줄이기 설정을 기본으로 따르며, 하단 **장식 움직임 켜기/끄기** 버튼으로 캐릭터·떠다니는 소품·등장 효과를 함께 조절합니다. 선택은 해당 브라우저에 저장됩니다.

작은 소품 원본 8종은 `public/assets/floating-props/`에 보관합니다. PVP의 투명 의료 모티프를 재색칠·재생성 없이 자르고 축소한 이미지이며, 출처·변환·해시는 해당 폴더의 `provenance.json`에 기록합니다. 그중 다섯 개만 각 소주제 제목의 `.subtitle-props` 래퍼에 하나씩 연결하고 그 안에서 absolute 배치합니다. `src/ambient-motion.css`에서 크기·부유 주기·위상차를 조정합니다. `src/ambient-motion.js`는 섹션과 탭의 표시 상태를 관찰하여 화면 밖의 소품 움직임을 정지시킵니다. 제목 옆 캐릭터 크기는 `src/section-visuals.css`의 `.heading-motion`에서 조정합니다.

PVP 상대 경로·리비전·파일 해시와 기술적 변환은 `public/assets/characters/300/source-provenance.json`에 있습니다. 생성 원본과 검수용 접촉 시트는 공개 사이트 파일에 포함하지 않습니다.

HWP 이력서 원본은 저장소와 배포 결과에 포함하지 않습니다. 개인 주소·전화번호·생년월일·개인 식별번호도 공개 프로필에 넣지 않습니다. 이력 데이터의 출처 문서가 바뀌면 날짜와 표현을 확인한 뒤 공개할 경력만 반영합니다. 본인 경력 확인을 넘어서는 진료 효과나 전문 자격을 새로 단정하지 않습니다.

이력서에는 바이오통계학 석사 **졸업(2024.02)**으로 기재되어 이를 반영했습니다. 백구한의원 경력의 `2026.01–2027.01`은 원문에 기재된 기간이며, 미래 종료일을 포함한다는 안내를 화면에 표시합니다. `RMSK`는 이력서 표기와 함께 적었고 확인되지 않은 자격명이나 인증기관 명칭을 추가하지 않았습니다. 강의노트에서 제공된 연구·대외 활동 중 공개 프로필에 적합한 이력도 함께 정리했습니다.

공개 이미지의 출처·해시와 파비콘의 단순 크기 변환은 `assets-manifest.json`에 기록했습니다. 이미지를 교체할 때에는 해당 파일의 해시도 갱신해 주세요.

## 검증 및 GitHub Pages 업데이트

```powershell
npm run check
npm test
npm run build
npm run check:dist
```

Vite가 상대 경로로 `dist/`를 생성하므로 GitHub Pages 저장소 하위 경로에서도 자산을 불러올 수 있습니다. 변경 내용을 검토해 `main`에 커밋·푸시하면 `.github/workflows/pages.yml`이 검사·빌드 후 `dist/`만 배포합니다. GitHub Actions의 **Deploy GitHub Pages → Run workflow**로도 실행할 수 있습니다.

```powershell
git add index.html src data public README.md
git commit -m "Update public profile"
git push origin main
```

Actions의 build·deploy가 모두 성공한 뒤 공개 주소를 새로고침해 확인합니다. 푸시만 성공한 상태는 배포 완료가 아닙니다. 문제가 있으면 직전 정상 내용을 새 커밋으로 복원해 다시 배포합니다.

선택 자산 교체 후 `node tools/update-assets.js`로 해시 목록을 갱신하고 검사를 실행합니다. 의료 모션을 변경하면 `motions.json`의 프레임 크기·시간·해시도 실제 파일과 일치해야 합니다. 프로필 데이터·그림·모션 검사와 원본 문서 제외 검사를 통과한 결과만 배포합니다.
