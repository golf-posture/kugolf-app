# KUGOLF

React Native·Expo 기반 골프 영상 앱입니다. 현재 분석 결과는 더미 데이터입니다.

## 준비 사항

- Git, Node.js 24, npm
- iPhone의 Expo Go 앱 (Expo SDK 54 호환 버전)
- PC와 iPhone을 같은 Wi-Fi에 연결

## 설치 및 실행

PowerShell에서 실행합니다.

```powershell
git clone https://github.com/golf-posture/kugolf-app.git
Set-Location kugolf-app
npm ci
npm start
```

1. iPhone 카메라로 터미널에 표시된 QR 코드를 읽고 Expo Go에서 엽니다.
2. 앱의 **영상 불러오기**를 누르고 사진 보관함 접근을 허용합니다.
3. 영상을 선택한 뒤 **분석하기**를 누릅니다.

다시 실행할 때는 프로젝트 폴더에서 `npm start`만 실행합니다. 종료는 터미널에서 `Ctrl+C`를 누릅니다.

웹 브라우저에서 확인하려면 `npm run web`을 실행합니다.

## 연결이 안 될 때

같은 Wi-Fi에 연결됐는지와 iPhone의 Expo Go 로컬 네트워크 권한을 확인합니다. 실행 중인 서버를 `Ctrl+C`로 종료한 뒤 상황에 맞는 명령을 사용합니다.

```powershell
# 캐시를 초기화하고 재시작
npx expo start --clear

# 같은 네트워크에서 기기 연결이 막힐 때
npx expo start --tunnel
```

터널을 처음 사용하면 추가 패키지 설치 안내가 나올 수 있습니다.
