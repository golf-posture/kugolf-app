import React from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { cover, logo } from "../data/demo";
import { Button, colors, Screen, Txt, ui } from "../components/ui";
import { SwingVideo } from "../components/SwingVideo";
import type { Video } from "../state/flow";
export function Splash() {
  return (
    <Screen style={{ justifyContent: "center", alignItems: "center" }}>
      <Image
        accessibilityLabel="KUGOLF"
        source={logo}
        style={{ width: 270, height: 92 }}
        resizeMode="contain"
      />
    </Screen>
  );
}
export function Home({
  onPick,
  onDemo,
  busy,
}: {
  onPick: () => void;
  onDemo: () => void;
  busy: boolean;
}) {
  return (
    <Screen>
      <View style={s.brandRow}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="KUGOLF 로고. 길게 눌러 화면 테스트"
          onLongPress={__DEV__ ? onDemo : undefined}
          delayLongPress={600}
        >
          <Image
            source={logo}
            style={{ width: 150, height: 51 }}
            resizeMode="contain"
          />
        </Pressable>
      </View>
      <Txt bold style={{ fontSize: 26, lineHeight: 38, color: colors.green }}>
        YOUR SWING.
      </Txt>
      <Txt bold style={{ fontSize: 27, lineHeight: 38, marginTop: 3 }}>
        {"다음 스윙을 위한\n한 번의 확인."}
      </Txt>
      <View style={s.homePhoto}>
        <Image
          source={cover}
          accessibilityLabel="정면에서 촬영한 골프 스윙"
          style={{ width: "100%", height: "100%", borderRadius: 14 }}
        />
      </View>
      <Txt bold style={{ fontSize: 17, marginTop: 22 }}>
        스윙의 주요 순간을 확인하세요.
      </Txt>
      <Txt style={[ui.muted, { marginTop: 8 }]}>
        {"정면에서 전신이 보이는\n드라이버 영상을 선택해주세요."}
      </Txt>
      <View style={ui.footer}>
        <Button
          label={busy ? "영상 선택 중…" : "영상 불러오기"}
          onPress={onPick}
          disabled={busy}
        />
      </View>
    </Screen>
  );
}
export function Preview({
  video,
  onBack,
  onPick,
  onStart,
  onError,
  onReady,
  ready,
  busy,
}: {
  video: Video;
  onBack: () => void;
  onPick: () => void;
  onStart: () => void;
  onError: () => void;
  onReady: (duration: number) => void;
  ready: boolean;
  busy: boolean;
}) {
  return (
    <Screen title="영상 확인" onBack={onBack}>
      <Txt bold style={[ui.heading, { marginTop: 12 }]}>
        이 영상으로 분석할까요?
      </Txt>
      <Txt style={[ui.muted, { fontSize: 12, marginTop: 8, marginBottom: 22 }]}>
        스윙이 화면 안에 잘 보이는지 확인해주세요.
      </Txt>
      <SwingVideo
        video={video}
        mode="preview"
        onError={onError}
        onReady={onReady}
      />
      <Txt style={[ui.muted, { marginTop: 20, fontSize: 12 }]}>
        전신이 보이고 스윙이 끝까지 담겼다면 준비 완료.
      </Txt>
      <View style={ui.footer}>
        <Button label="분석하기" onPress={onStart} disabled={!ready || busy} />
        <Pressable
          accessibilityRole="button"
          onPress={onPick}
          disabled={busy}
          style={{ alignItems: "center", padding: 10 }}
        >
          <Txt style={ui.muted}>다른 영상 선택</Txt>
        </Pressable>
      </View>
    </Screen>
  );
}
export function Loading({
  video,
  progress,
  onBack,
  onError,
}: {
  video: Video;
  progress: number;
  onBack: () => void;
  onError: () => void;
}) {
  return (
    <Screen title="스윙 분석 중" onBack={onBack}>
      <Txt bold style={[s.reading, { color: colors.green, marginTop: 22 }]}>
        READING
      </Txt>
      <Txt bold style={s.reading}>
        YOUR SWING.
      </Txt>
      <View style={{ marginTop: 28 }}>
        {video.sample ? (
          <View style={{ width: "100%", aspectRatio: 342 / 271 }}>
            <Image
              source={cover}
              style={{ width: "100%", height: "100%", borderRadius: 14 }}
            />
          </View>
        ) : (
          <SwingVideo video={video} mode="still" event={3} onError={onError} />
        )}
        <View
          accessibilityRole="progressbar"
          accessibilityLabel="스윙 분석 진행률"
          accessibilityValue={{
            min: 0,
            max: 100,
            now: Math.round(progress * 100),
          }}
          style={s.analysisTrack}
        >
          <View style={[s.analysisFill, { width: `${progress * 100}%` }]}>
            <View style={s.analysisDot} />
          </View>
        </View>
      </View>
      <Txt bold style={[ui.heading, { marginTop: 34 }]}>
        스윙을 분석 중이에요.
      </Txt>
      <Txt style={[ui.muted, { marginTop: 12 }]}>
        {"영상에서 주요 동작을 찾고\n각 장면의 자세를 살펴보고 있어요."}
      </Txt>
      <View style={[ui.footer, { paddingBottom: 30 }]}>
        <View style={s.note}>
          <Txt style={{ fontSize: 13 }}>• 분석이 완료되면 결과가 나타나요.</Txt>
          <Txt
            style={[ui.muted, { marginTop: 4, paddingLeft: 14, fontSize: 12 }]}
          >
            잠시만 기다려주세요.
          </Txt>
        </View>
      </View>
    </Screen>
  );
}
export function ErrorScreen({
  kind,
  onAction,
}: {
  kind: "permission" | "read" | "unavailable";
  onAction: () => void;
}) {
  const content = {
    permission: {
      title: "영상 접근 권한이 필요해요",
      body: "휴대폰 설정에서 사진 접근 권한을\n허용한 뒤 다시 시도해주세요.",
      note: "선택한 영상을 불러오지 못했어요.",
      icon: "⌑",
    },
    read: {
      title: "영상을 읽을 수 없어요",
      body: "영상 파일을 불러오는 중 문제가 생겼어요.\n휴대폰에서 영상이 재생되는지 확인해주세요.",
      note: "홈에서 다른 영상을 선택할 수 있어요.",
      icon: "!",
    },
    unavailable: {
      title: "분석하기 어려워요",
      body: "스윙의 자세를 충분히 확인하지 못했거나\n분석 중 문제가 발생했어요.",
      note: "정면에서 전신과 스윙이 끝까지 보이는\n영상을 선택해주세요.",
      icon: "?",
    },
  }[kind];
  return (
    <Screen title={kind === "unavailable" ? "분석 안내" : "영상 불러오기"}>
      <View style={s.errorBody}>
        <View style={s.errorIcon}>
          <Txt style={{ fontSize: 32, lineHeight: 44, color: colors.green }}>
            {content.icon}
          </Txt>
        </View>
        <Txt bold style={[ui.heading, { textAlign: "center", marginTop: 30 }]}>
          {content.title}
        </Txt>
        <Txt style={[ui.muted, { textAlign: "center", marginTop: 22 }]}>
          {content.body}
        </Txt>
        <View style={kind === "unavailable" ? s.note : { marginTop: 46 }}>
          <Txt style={[ui.muted, { textAlign: "center", fontSize: 12 }]}>
            {content.note}
          </Txt>
        </View>
      </View>
      <View style={ui.footer}>
        <Button
          label={kind === "unavailable" ? "다른 영상 분석" : "홈으로 돌아가기"}
          onPress={onAction}
        />
      </View>
    </Screen>
  );
}
const s = StyleSheet.create({
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    minHeight: 56,
  },
  homePhoto: {
    width: "100%",
    aspectRatio: 342 / 340,
    borderRadius: 14,
    marginTop: 26,
  },
  reading: { fontSize: 36, lineHeight: 46, letterSpacing: -1 },
  analysisTrack: {
    position: "absolute",
    top: "50%",
    height: 2,
    left: 18,
    right: 18,
    backgroundColor: "#FFFFFF8C",
    borderRadius: 1,
  },
  analysisFill: { height: 2, backgroundColor: "#74D99F" },
  analysisDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#fff",
    backgroundColor: "#74D99F",
    position: "absolute",
    top: -3,
    right: -4,
  },
  note: {
    padding: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    marginTop: 28,
  },
  errorBody: { paddingTop: 110, alignItems: "center" },
  errorIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
});
