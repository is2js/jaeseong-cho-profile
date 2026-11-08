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

HWP 이력서 원본은 저장소와 배포 결과에 포함하지 않습니다. 개인 주소·전화번호·생년월일·개인 식별번호도 공개 프로필에 넣지 않습니다. 이력 데이터의 출처 문서가 바뀌면 날짜와 표현을 확인한 뒤 공개할 경력만 반영합니다. 본인 경력 확인을 넘어서는 진료 효과나 전문 자격을 새로 단정하지 않습니다.

이력서에는 바이오통계학 석사 **졸업(2024.02)**으로 기재되어 이를 반영했습니다. 백구한의원 경력의 `2026.01–2027.01`은 원문에 기재된 기간이며, 미래 종료일을 포함한다는 안내를 화면에 표시합니다. `RMSK`는 이력서 표기와 함께 적었고 확인되지 않은 자격명이나 인증기관 명칭을 추가하지 않았습니다. 강의노트에서 제공된 연구·대외 활동 중 공개 프로필에 적합한 이력도 함께 정리했습니다.

공개 이미지의 출처·해시와 파비콘의 단순 크기 변환은 `assets-manifest.json`에 기록했습니다. 이미지를 교체할 때에는 해당 파일의 해시도 갱신해 주세요.

## 검증 및 GitHub Pages 업데이트

```powershell
npm run check
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
