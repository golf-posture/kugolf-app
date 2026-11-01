import React, { useEffect, useRef, useState } from "react";
import { AppState, Pressable, StyleSheet, View } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer, VideoView } from "expo-video";
import { eventLabels, eventTime, type Video } from "../state/flow";
import { colors, Txt, ui } from "./ui";
type Props = {
  video: Video;
  mode: "preview" | "full" | "still";
  event?: number;
  onError: () => void;
  onReady?: (duration: number) => void;
};
const stamp = (time: number) =>
  `${Math.floor(time / 60)
    .toString()
    .padStart(2, "0")}:${(time % 60).toFixed(2).padStart(5, "0")}`;
export function SwingVideo({ video, mode, event, onError, onReady }: Props) {
  const player = useVideoPlayer(video.source, (p) => {
    p.muted = true;
    p.loop = false;
    p.timeUpdateEventInterval = 0.1;
  });
  const { status } = useEvent(player, "statusChange", {
    status: player.status,
  });
  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });
  const { currentTime } = useEvent(player, "timeUpdate", {
    currentTime: 0,
    currentLiveTimestamp: null,
    currentOffsetFromLive: null,
    bufferedPosition: 0,
  });
  const [selected, setSelected] = useState<number | null>(event ?? null);
  const [duration, setDuration] = useState(video.duration);
  const initialized = useRef(false);
  const pendingEvent = useRef<number | null>(event ?? null);
  const callbacks = useRef({ onError, onReady });
  callbacks.current = { onError, onReady };
  useEffect(() => {
    if (status === "error") {
      callbacks.current.onError();
      return;
    }
    if (status !== "readyToPlay" || initialized.current) return;
    initialized.current = true;
    const length = player.duration || video.duration;
    setDuration(length);
    callbacks.current.onReady?.(length);
    if (pendingEvent.current !== null) {
      player.pause();
      player.currentTime = eventTime(pendingEvent.current, length);
    } else if (mode === "full") player.play();
  }, [status, player, mode, video.duration]);
  useEffect(() => {
    const sub = AppState.addEventListener("change", (s) => {
      if (s !== "active") player.pause();
    });
    return () => sub.remove();
  }, [player]);
  const selectEvent = (index: number) => {
    pendingEvent.current = index;
    setSelected(index);
    player.pause();
    if (initialized.current) player.currentTime = eventTime(index, duration);
  };
  const toggle = () => {
    if (mode === "still" || !initialized.current) return;
    if (player.playing) player.pause();
    else {
      if (player.currentTime >= duration - 0.03) player.currentTime = 0;
      pendingEvent.current = null;
      setSelected(null);
      player.play();
    }
  };
  const shownTime =
    selected !== null && !isPlaying
      ? eventTime(selected, duration)
      : currentTime;
  return (
    <View style={{ gap: 12 }}>
      {mode === "full" && (
        <View style={styles.row}>
          <Txt bold style={{ fontSize: 18 }}>
            {selected === null ? "스윙 전체" : eventLabels[selected]}
          </Txt>
          <Txt style={ui.muted}>
            {selected === null
              ? "FULL SWING"
              : `${String(selected + 1).padStart(2, "0")} / 08`}
          </Txt>
        </View>
      )}
      <Pressable
        testID="swing-video"
        accessibilityRole={mode === "still" ? "image" : "button"}
        accessibilityLabel={
          mode === "still"
            ? "선택한 자세 영상"
            : isPlaying
              ? "영상 일시 정지"
              : "영상 이어 재생"
        }
        onPress={toggle}
        disabled={mode === "still"}
        style={[styles.video, mode === "preview" && { aspectRatio: 342 / 365 }]}
      >
        <View pointerEvents="none" style={StyleSheet.absoluteFill}>
          <VideoView
            testID="video-player"
            style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
            player={player}
            nativeControls={false}
            contentFit="contain"
            playsInline
            allowsPictureInPicture={false}
            fullscreenOptions={{ enable: false }}
          />
        </View>
      </Pressable>
      {mode !== "still" && (
        <>
          <View
            accessibilityRole="progressbar"
            accessibilityLabel="영상 재생 위치"
            accessibilityValue={{
              min: 0,
              max: 100,
              // Fabric requires integer values; keep the player's time in seconds.
              now:
                duration > 0
                  ? Math.round(Math.min(1, Math.max(0, shownTime / duration)) * 100)
                  : 0,
            }}
            style={styles.track}
          >
            <View
              style={[
                styles.fill,
                {
                  width: `${Math.min(100, duration ? (shownTime / duration) * 100 : 0)}%`,
                },
              ]}
            >
              <View style={styles.dot} />
            </View>
          </View>
          <View style={styles.row}>
            <Txt style={styles.time}>{stamp(shownTime)}</Txt>
            <Txt style={styles.time}>{stamp(duration)}</Txt>
          </View>
          <Txt style={[ui.muted, { fontSize: 11 }]}>
            {status === "loading" || status === "idle"
              ? "영상을 불러오고 있어요."
              : isPlaying
                ? "영상을 누르면 일시 정지해요."
                : "영상을 누르면 이 위치부터 재생해요."}
          </Txt>
        </>
      )}
      {mode === "full" && (
        <View style={styles.events}>
          {eventLabels.map((label, index) => (
            <Pressable
              key={label}
              accessibilityRole="button"
              accessibilityLabel={`${label} 프레임`}
              accessibilityState={{
                selected: selected === index && !isPlaying,
              }}
              onPress={() => selectEvent(index)}
              style={[
                styles.event,
                selected === index && !isPlaying && styles.active,
              ]}
            >
              <Txt
                bold={selected === index && !isPlaying}
                style={{
                  fontSize: 12,
                  color:
                    selected === index && !isPlaying
                      ? colors.green
                      : colors.ink,
                }}
              >
                {label}
              </Txt>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  video: {
    width: "100%",
    aspectRatio: 1024 / 720,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#10251B",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  track: {
    height: 3,
    backgroundColor: colors.line,
    borderRadius: 2,
    marginTop: 6,
  },
  fill: { height: 3, backgroundColor: colors.green, borderRadius: 2 },
  dot: {
    position: "absolute",
    right: -3,
    top: -2,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.green,
  },
  time: { fontSize: 10, lineHeight: 15, color: colors.muted },
  events: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 4 },
  event: {
    flexBasis: "23%",
    flexGrow: 1,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.line,
  },
  active: { backgroundColor: colors.soft, borderColor: colors.green },
});
