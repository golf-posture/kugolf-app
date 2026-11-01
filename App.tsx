import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { BackHandler, ScrollView, StyleSheet, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { flow, initialState, type Scenario } from "./src/state/flow";
import { sampleVideo } from "./src/data/demo";
import { Button, Sheet, Txt, ui } from "./src/components/ui";
import {
  ErrorScreen,
  Home,
  Loading,
  Preview,
  Splash,
} from "./src/screens/FlowScreens";
import { ResultScreen } from "./src/screens/ResultScreen";
import { pickVideo } from "./src/services/pickVideo";
export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    NotoRegular: require("@expo-google-fonts/noto-sans-kr/400Regular/NotoSansKR_400Regular.ttf"),
    NotoBold: require("@expo-google-fonts/noto-sans-kr/700Bold/NotoSansKR_700Bold.ttf"),
  });
  const [state, dispatch] = useReducer(flow, initialState);
  const [demoOpen, setDemoOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  const picking = useRef(false);
  const generation = useRef(0);
  const duration = useRef(0);
  const back = useCallback(() => {
    generation.current++;
    dispatch({ type: "back" });
  }, []);
  useEffect(() => {
    if ((!fontsLoaded && !fontError) || state.screen !== "splash") return;
    const timer = setTimeout(() => dispatch({ type: "splashDone" }), 1000);
    return () => clearTimeout(timer);
  }, [fontsLoaded, fontError, state.screen]);
  useEffect(() => {
    if (state.screen !== "analyzing" || state.confirmStop) return;
    const timer = setInterval(
      () =>
        dispatch({
          type: "tick",
          run: state.run,
          progress: state.progress + 0.02,
        }),
      120,
    );
    return () => clearInterval(timer);
  }, [state.screen, state.confirmStop, state.progress, state.run]);
  useEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (state.screen === "home" || state.screen === "splash") return false;
      back();
      return true;
    });
    return () => listener.remove();
  }, [state.screen, back]);
  const choose = async () => {
    if (picking.current) return;
    picking.current = true;
    setBusy(true);
    const attempt = ++generation.current;
    const result = await pickVideo();
    picking.current = false;
    setBusy(false);
    if (attempt !== generation.current || result === null) return;
    if (typeof result === "string") dispatch({ type: "error", kind: result });
    else {
      setReady(false);
      duration.current = result.duration;
      dispatch({ type: "selected", video: result });
    }
  };
  const home = () => {
    generation.current++;
    dispatch({ type: "home" });
  };
  const readError = useCallback(
    () => dispatch({ type: "error", kind: "read" }),
    [],
  );
  const start = () => {
    if (!ready || !state.video) return;
    dispatch({
      type: "selected",
      video: { ...state.video, duration: duration.current },
    });
    dispatch({ type: "start" });
  };
  const sample = () => {
    setDemoOpen(false);
    setReady(false);
    duration.current = sampleVideo.duration;
    dispatch({ type: "selected", video: sampleVideo });
  };
  const video = state.video;
  return (
    <SafeAreaProvider>
      <View style={s.root}>
        <StatusBar style="dark" />
        {state.screen === "splash" && <Splash />}
        {state.screen === "home" && (
          <Home onPick={choose} onDemo={() => setDemoOpen(true)} busy={busy} />
        )}
        {state.screen === "preview" && video && (
          <Preview
            key={state.run}
            video={video}
            onBack={back}
            onPick={choose}
            onStart={start}
            onError={readError}
            ready={ready}
            busy={busy}
            onReady={(length) => {
              duration.current = length;
              setReady(length > 0);
            }}
          />
        )}
        {state.screen === "analyzing" && video && (
          <Loading
            video={video}
            progress={state.progress}
            onBack={back}
            onError={readError}
          />
        )}
        {state.screen === "result" && video && (
          <ResultScreen
            video={video}
            scenario={state.scenario}
            onBack={home}
            onAnother={choose}
            onError={readError}
          />
        )}
        {(state.screen === "permission" ||
          state.screen === "read" ||
          state.screen === "unavailable") && (
          <ErrorScreen
            kind={state.screen}
            onAction={state.screen === "unavailable" ? choose : home}
          />
        )}
        <Sheet
          title="분석을 중단할까요?"
          visible={state.confirmStop}
          onClose={() => dispatch({ type: "continue" })}
        >
          <Txt style={ui.muted}>
            {
              "중단하면 처음부터 다시 분석해야 해요.\n선택한 영상은 그대로 유지돼요."
            }
          </Txt>
          <Button
            label="계속 분석하기"
            onPress={() => dispatch({ type: "continue" })}
          />
          <Button
            secondary
            label="분석 중단"
            onPress={() => dispatch({ type: "stop" })}
          />
        </Sheet>
        {__DEV__ && (
          <Sheet
            title="화면 테스트"
            visible={demoOpen}
            onClose={() => setDemoOpen(false)}
          >
            <ScrollView contentContainerStyle={{ gap: 10 }}>
              <Txt style={ui.muted}>
                분석값은 더미 데이터예요. 실제 진단은 수행하지 않아요. 아래
                상황을 선택하고 10번 영상으로 확인하세요.
              </Txt>
              {(
                [
                  ["multiple", "문제점 3개"],
                  ["single", "문제점 1개"],
                  ["none", "문제점 없음"],
                  ["unavailable", "분석하기 어려워요"],
                ] as [Scenario, string][]
              ).map(([value, label]) => (
                <Button
                  secondary={state.scenario !== value}
                  key={value}
                  label={label}
                  onPress={() => dispatch({ type: "scenario", value })}
                />
              ))}
              <Button label="10번 영상으로 시작" onPress={sample} />
              <Button
                secondary
                label="권한 거부 화면"
                onPress={() => {
                  setDemoOpen(false);
                  dispatch({ type: "error", kind: "permission" });
                }}
              />
              <Button
                secondary
                label="읽기 실패 화면"
                onPress={() => {
                  setDemoOpen(false);
                  dispatch({ type: "error", kind: "read" });
                }}
              />
            </ScrollView>
          </Sheet>
        )}
      </View>
    </SafeAreaProvider>
  );
}
const s = StyleSheet.create({ root: { flex: 1, backgroundColor: "#EEF2EF" } });
