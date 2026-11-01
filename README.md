# KUGOLF

수정한 Figma B안을 React Native + TypeScript + Expo로 구현한 화면 데모입니다. 흰 배경, KU 초록색, 수정한 KUGOLF 로고를 사용합니다. 영상 선택과 재생은 실제로 동작하며, 분석값은 더미 데이터입니다.

## iPhone에서 실행

Node.js 24 LTS와 npm을 준비한 뒤 PowerShell에서 실행하세요. 이 프로젝트는 Expo SDK 54, React Native 0.81.5, TypeScript를 사용합니다.

```powershell
git clone https://github.com/golf-posture/kugolf-app.git
Set-Location kugolf-app
npm ci
npm start
```

1. iPhone에 App Store의 **Expo Go**를 설치합니다.
2. PC와 iPhone을 같은 Wi-Fi에 연결합니다.
3. 위 명령의 터미널을 켜 둔 상태에서 iPhone 기본 카메라로 터미널의 QR 코드를 읽습니다.
4. **Expo Go에서 열기**를 선택합니다. 최초 실행에는 폰트와 영상 다운로드 시간이 필요합니다.
5. 홈의 **영상 불러오기**를 누르고 사진 보관함의 동영상을 선택합니다. 사진 접근 요청에는 사용할 영상에 접근할 수 있도록 허용합니다.

이미 설치한 폴더에서는 `npm start`로 다시 실행합니다. 로그인 안내가 뜨면 `npx expo login`과 iPhone Expo Go에 같은 Expo 계정을 사용하세요. Windows에서는 iOS 시뮬레이터 대신 실제 iPhone의 Expo Go로 확인합니다.

연결이 안 되면 같은 Wi-Fi와 iPhone의 Expo Go 로컬 네트워크 권한을 확인하세요. 회사/학교 네트워크가 기기 간 연결을 막는 경우 터미널을 `Ctrl+C`로 종료하고 아래 대안을 사용할 수 있습니다. 최초 실행 시 Expo CLI가 터널 패키지 설치를 요청할 수 있습니다.

```powershell
npx expo start --tunnel
```

캐시 문제에는 `npx expo start --clear`를 사용합니다. 정상 종료는 `Ctrl+C`입니다.

**버전 선택:** [Expo 공식 호환 안내](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/)에 맞춰 프로젝트의 SDK 54와 호환되는 Expo Go를 사용하세요. SDK를 업그레이드하기 전에는 실제 기기의 Expo Go와 호환되는지 확인해야 합니다.

## 10번 영상으로 빠르게 확인

개발 모드에서 **홈의 KUGOLF 로고를 길게 누르면** `화면 테스트` 메뉴가 열립니다.

- `문제점 3개`, `문제점 1개`, `문제점 없음`, `분석하기 어려워요` 중 하나를 고릅니다.
- `10번 영상으로 시작` → `분석하기`를 누릅니다. 사진 보관함에 샘플을 따로 넣을 필요가 없습니다.
- `권한 거부 화면`, `읽기 실패 화면`은 해당 오류 UI를 바로 보여줍니다. OS 권한을 실제로 변경하지는 않습니다.
- 앱을 새로 시작하면 기본값은 `문제점 3개`입니다. 개발 메뉴는 production 번들에서는 노출되지 않습니다.

## 연결된 동작

- KUGOLF 시작 화면 약 1초 → 홈 → 시스템 영상 선택 → 영상 확인 → 분석 중 → 결과.
- 영상 선택 취소 시 기존 화면 유지. 영상 읽기가 끝난 뒤 분석 버튼 활성화.
- 분석 중 얇은 가로선이 초록색으로 채워지고 끝의 점이 이동. 퍼센트나 별도 흰 카드 없음.
- 분석 중 뒤로가기 → 중단 확인. 계속하면 진행 위치 유지, 중단하면 선택한 영상을 유지한 채 영상 확인으로 복귀. 이전 작업은 결과 화면을 열지 않음.
- 결과 상단에 자세 점수·스윙 리듬. `자세 진단`은 점수가 낮은 문제부터 표시하고 다른 문제를 선택 가능.
- 문제점 1개/없음에는 `다른 영상 분석`. 분석 불가는 별도 안내 화면이며 점수·리듬을 표시하지 않음.
- `풀스윙` 탭 진입 시 실제 영상 자동 재생. 8개 이벤트 버튼은 같은 영상의 해당 위치로 이동하고 정지. 영상을 탭하면 그 위치부터 재생하고, 재생 중 탭하면 정지.
- 영상 위 재생 버튼, 영상 내부 휠 스크롤, 풀스윙 하단 자세 진단 버튼 없음. 작은 화면에서는 페이지 전체를 스크롤할 수 있음.
- 권한 거부·읽기 실패는 오류 안내 후 `홈으로 돌아가기`로 복귀.

## 더미 데이터의 범위

실제 자세 분석 API나 모델은 연결하지 않았습니다. 약 6초의 진행률, 자세 점수, 리듬, 진단 문구는 화면 확인용입니다. 기본 예시는 6.8/10, 2.8:1이며 문제점 없음은 9.2/10입니다. 실제 분석 성능이나 건강한 자세 판정의 근거로 사용할 수 없습니다.

내장 10번 영상은 기존 시안의 8개 프레임 `[80, 93, 97, 104, 109, 112, 114, 129]`를 사용합니다. **휴대폰에서 고른 다른 영상에는 길이 비율에 따른 임시 이벤트 위치**를 사용하므로 실제 스윙 이벤트 검출 결과가 아닙니다. 백엔드 연결 시 이 값들과 점수·리듬·진행률 기준을 교체합니다. 영상은 분석 서버로 전송하지 않으며 결과 이력도 저장하지 않습니다.

Expo Go 자체의 시작 화면 다음에 앱 내부 KUGOLF 시작 화면이 표시됩니다. 설치형 앱의 네이티브 시작 화면 및 앱 아이콘 검수는 별도 배포 단계입니다.

## 개발 및 검증

```powershell
npm run web
npm run check
npx expo-doctor
npx expo export --platform web --platform ios --output-dir dist-final
```

`npm run check`는 TypeScript 검사와 ESLint를 실행합니다. 로컬 테스트·캡처·검증 기록은 실행 파일만 공유하는 범위에 맞춰 Git에 포함하지 않습니다.

검증 환경은 Windows / Node 24.12.0입니다. 기존 화면 흐름·영상 접근성 회귀 테스트 7개는 로컬에서 통과했습니다. iPhone의 영상 선택 후 소수점 접근성 값 오류를 수정했으며, 실제 기기에서 선택 → 확인 → 분석과 권한·재생 동작을 다시 확인하는 작업은 남아 있습니다. 웹/iOS 번들 생성은 iPhone 실기기 검증을 대신하지 않습니다.

주요 파일:

| 파일 | 역할 |
| --- | --- |
| `App.tsx` | 화면 연결, 분석 타이머, 중단 확인, 개발 메뉴 |
| `src/state/flow.ts` | 화면 상태와 더미 이벤트 시간 |
| `src/screens/FlowScreens.tsx` | 시작·홈·영상 확인·분석 중·오류 |
| `src/screens/ResultScreen.tsx` | 진단·문제 선택·풀스윙 탭 |
| `src/components/SwingVideo.tsx` | 실제 영상 재생·이벤트 이동·정지 |
| `src/services/pickVideo.ts` | 시스템 영상 선택과 권한 처리 |
| `src/data/demo.ts` | 교체할 더미 결과 및 샘플 에셋 |

## Git에 포함하는 파일

앱 소스(`App.tsx`, `index.ts`, `src/`), Expo·TypeScript·ESLint 설정, `package.json`, `package-lock.json`, 실행 안내와 앱이 직접 참조하는 `assets/`만 포함합니다. `node_modules/`, `.expo/`, 빌드 결과, 테스트·캡처·개인 설정은 로컬에 보관합니다.

로고·장면 이미지는 현재 화면을 구성하는 필수 자산입니다. `assets/media/swing-10.mp4`도 소스가 직접 `require()`하므로 번들 생성과 내장 샘플 재생에 필요해 포함합니다. 이 파일은 GolfDB 10번 영상의 기존 로컬 slice이며, 다른 원본·입력 영상은 포함하지 않습니다. 원본 데이터 출처는 [GolfDB](https://github.com/wmcnally/golfdb)입니다.

디자인은 팀의 수정 B안에 기반합니다. 실제 분석을 제공하는 [golf-posture 백엔드](https://github.com/golf-posture/golf-posture)는 별도 저장소이며, 현재 프론트엔드와 아직 연결되지 않았습니다.
