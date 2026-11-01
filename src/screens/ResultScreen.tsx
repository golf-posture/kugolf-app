import React, { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { issues } from "../data/demo";
import { Scenario, Video } from "../state/flow";
import { Button, colors, Screen, Sheet, Txt, ui } from "../components/ui";
import { SwingVideo } from "../components/SwingVideo";
export function ResultScreen({
  video,
  scenario,
  onBack,
  onAnother,
  onError,
}: {
  video: Video;
  scenario: Scenario;
  onBack: () => void;
  onAnother: () => void;
  onError: () => void;
}) {
  const [tab, setTab] = useState<"diagnosis" | "full">("diagnosis");
  const [selected, setSelected] = useState(0);
  const [showIssues, setShowIssues] = useState(false);
  const visibleIssues =
    scenario === "none"
      ? []
      : scenario === "single"
        ? issues.slice(0, 1)
        : issues;
  const issue = visibleIssues[selected];
  return (
    <Screen title="분석 결과" onBack={onBack}>
      <View style={s.metrics}>
        <View style={s.metric}>
          <Txt style={ui.muted}>자세 점수</Txt>
          <View style={s.baseline}>
            <Txt bold style={s.score}>
              {scenario === "none" ? "9.2" : "6.8"}
            </Txt>
            <Txt style={ui.muted}> / 10</Txt>
          </View>
        </View>
        <View style={[s.metric, s.metricRight]}>
          <Txt style={ui.muted}>스윙 리듬</Txt>
          <View style={s.baseline}>
            <Txt bold style={[s.score, { color: colors.ink, fontSize: 35 }]}>
              2.8
            </Txt>
            <Txt style={{ fontSize: 24, color: colors.muted }}> : 1</Txt>
          </View>
          <Txt style={{ fontSize: 10, lineHeight: 16, color: colors.muted }}>
            백스윙 : 다운스윙
          </Txt>
        </View>
      </View>
      <View style={s.tabs}>
        {(["diagnosis", "full"] as const).map((key, i) => (
          <Pressable
            key={key}
            accessibilityRole="tab"
            accessibilityLabel={i ? "풀스윙" : "자세 진단"}
            accessibilityState={{ selected: tab === key }}
            onPress={() => setTab(key)}
            style={[s.tab, tab === key && s.activeTab]}
          >
            <Txt
              bold={tab === key}
              style={{
                color: tab === key ? colors.green : colors.muted,
                fontSize: 16,
              }}
            >
              {i ? "풀스윙" : "자세 진단"}
            </Txt>
          </Pressable>
        ))}
      </View>
      {tab === "full" ? (
        <SwingVideo video={video} mode="full" onError={onError} />
      ) : !issue ? (
        <>
          <View style={s.empty}>
            <View style={s.check}>
              <Txt
                style={{ fontSize: 30, lineHeight: 40, color: colors.green }}
              >
                ✓
              </Txt>
            </View>
            <Txt bold style={[ui.heading, { textAlign: "center" }]}>
              발견된 교정 항목이 없어요
            </Txt>
            <Txt style={[ui.muted, { textAlign: "center" }]}>
              {"이번 분석에서 주요 자세 문제점이\n발견되지 않았어요."}
            </Txt>
            <Txt
              style={[
                ui.muted,
                { textAlign: "center", marginTop: 20, fontSize: 12 },
              ]}
            >
              풀스윙 탭에서 전체 동작을 확인해보세요.
            </Txt>
          </View>
          <View style={ui.footer}>
            <Button label="다른 영상 분석" onPress={onAnother} />
          </View>
        </>
      ) : (
        <>
          <View style={s.row}>
            <Txt style={[ui.muted, { fontSize: 12 }]}>
              {selected === 0 ? "우선 확인할 자세" : "선택한 자세"}
            </Txt>
            {visibleIssues.length > 1 && (
              <Txt style={ui.muted}>
                {selected + 1} / {visibleIssues.length}
              </Txt>
            )}
          </View>
          <View style={[s.issue, { backgroundColor: issue.soft }]}>
            <Txt bold style={{ fontSize: 19, lineHeight: 29 }}>
              {issue.title}
            </Txt>
            <View style={s.row}>
              <Txt bold style={{ color: issue.color, fontSize: 12 }}>
                {issue.status}
              </Txt>
              <Txt bold style={{ color: issue.color }}>
                {issue.score} / 100
              </Txt>
            </View>
            <View style={s.track}>
              <View
                style={{
                  height: 5,
                  width: `${issue.score}%`,
                  backgroundColor: issue.color,
                  borderRadius: 3,
                }}
              />
            </View>
          </View>
          <View style={{ marginTop: 16 }}>
            {video.sample ? (
              <View style={s.photo}>
                <Image
                  accessibilityLabel={`${issue.phase} 자세`}
                  source={issue.image}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                />
              </View>
            ) : (
              <SwingVideo
                key={issue.id}
                video={video}
                mode="still"
                event={issue.event}
                onError={onError}
              />
            )}
            <View style={s.phase}>
              <Txt bold style={{ color: colors.green, fontSize: 11 }}>
                {issue.phase}
              </Txt>
            </View>
          </View>
          <Txt style={[ui.muted, { fontSize: 12, marginTop: 14 }]}>
            {issue.body}
          </Txt>
          <View style={ui.footer}>
            <Button
              label={
                visibleIssues.length === 1
                  ? "다른 영상 분석"
                  : `다른 문제점 보기 · ${visibleIssues.length}개`
              }
              onPress={
                visibleIssues.length === 1
                  ? onAnother
                  : () => setShowIssues(true)
              }
            />
          </View>
        </>
      )}
      <Sheet
        title="어떤 자세를 볼까요?"
        visible={showIssues}
        onClose={() => setShowIssues(false)}
      >
        <Txt style={ui.muted}>먼저 확인하면 좋은 순서로 정리했어요.</Txt>
        <ScrollView contentContainerStyle={{ gap: 12 }}>
          {visibleIssues.map((item, i) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={`${item.title} 보기`}
              onPress={() => {
                setSelected(i);
                setShowIssues(false);
              }}
              style={[
                s.issueOption,
                selected === i && {
                  borderColor: colors.green,
                  backgroundColor: colors.card,
                },
              ]}
            >
              <View style={s.row}>
                <Txt bold style={{ fontSize: 15 }}>
                  {item.title}
                </Txt>
                <Txt style={{ color: colors.green }}>
                  {selected === i ? "●" : "○"}
                </Txt>
              </View>
              <View style={s.row}>
                <Txt style={{ color: item.color, fontSize: 12 }}>
                  {item.status}
                </Txt>
                <Txt style={{ color: item.color, fontSize: 12 }}>
                  {item.score} / 100
                </Txt>
              </View>
              <View style={[s.track, { backgroundColor: colors.line }]}>
                <View
                  style={{
                    height: 5,
                    width: `${item.score}%`,
                    backgroundColor: item.color,
                  }}
                />
              </View>
              <Txt style={[ui.muted, { fontSize: 11 }]}>
                {item.phase} 장면 보기 →
              </Txt>
            </Pressable>
          ))}
        </ScrollView>
      </Sheet>
    </Screen>
  );
}
const s = StyleSheet.create({
  metrics: {
    flexDirection: "row",
    paddingVertical: 17,
    paddingHorizontal: 18,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginTop: 8,
  },
  metric: { flex: 1 },
  metricRight: {
    borderLeftWidth: 1,
    borderLeftColor: colors.line,
    paddingLeft: 22,
  },
  baseline: { flexDirection: "row", alignItems: "baseline" },
  score: { fontSize: 39, lineHeight: 53, color: colors.green },
  tabs: { flexDirection: "row", marginTop: 14, marginBottom: 16 },
  tab: {
    flex: 1,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderColor: colors.line,
  },
  activeTab: { borderColor: colors.green },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  issue: { borderRadius: 12, padding: 16, gap: 4, marginTop: 8 },
  track: {
    height: 5,
    backgroundColor: "#fff",
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 6,
  },
  photo: { width: "100%", aspectRatio: 768 / 540, borderRadius: 12 },
  phase: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 3,
  },
  empty: {
    padding: 26,
    paddingVertical: 38,
    alignItems: "center",
    gap: 16,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginTop: 24,
  },
  check: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#E0EEE5",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  issueOption: {
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
});
