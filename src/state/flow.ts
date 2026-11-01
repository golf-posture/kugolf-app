export type Scenario = "multiple" | "single" | "none" | "unavailable";
export type Screen =
  | "splash"
  | "home"
  | "preview"
  | "analyzing"
  | "result"
  | "permission"
  | "read"
  | "unavailable";
export type Video = {
  source: number | string;
  sample: boolean;
  duration: number;
};
export type State = {
  screen: Screen;
  video: Video | null;
  scenario: Scenario;
  progress: number;
  confirmStop: boolean;
  run: number;
};
export const initialState: State = {
  screen: "splash",
  video: null,
  scenario: "multiple",
  progress: 0,
  confirmStop: false,
  run: 0,
};
export type Action =
  | { type: "home" | "splashDone" | "start" | "back" | "continue" | "stop" }
  | { type: "selected"; video: Video }
  | { type: "scenario"; value: Scenario }
  | { type: "error"; kind: "permission" | "read" }
  | { type: "tick"; run: number; progress: number };
export function flow(state: State, action: Action): State {
  switch (action.type) {
    case "home":
      return {
        ...initialState,
        scenario: state.scenario,
        screen: "home",
        run: state.run + 1,
      };
    case "splashDone":
      return state.screen === "splash" ? { ...state, screen: "home" } : state;
    case "selected":
      return {
        ...state,
        video: action.video,
        screen: "preview",
        progress: 0,
        confirmStop: false,
        run: state.run + 1,
      };
    case "scenario":
      return { ...state, scenario: action.value };
    case "error":
      return {
        ...state,
        screen: action.kind,
        confirmStop: false,
        run: state.run + 1,
      };
    case "start":
      return state.video && state.screen === "preview"
        ? { ...state, screen: "analyzing", progress: 0, run: state.run + 1 }
        : state;
    case "back":
      return state.screen === "analyzing"
        ? { ...state, confirmStop: true }
        : { ...state, screen: "home", run: state.run + 1 };
    case "continue":
      return { ...state, confirmStop: false };
    case "stop":
      return state.screen === "analyzing"
        ? {
            ...state,
            screen: "preview",
            progress: 0,
            confirmStop: false,
            run: state.run + 1,
          }
        : state;
    case "tick":
      if (
        state.screen !== "analyzing" ||
        state.confirmStop ||
        state.run !== action.run
      )
        return state;
      return {
        ...state,
        progress: Math.min(1, action.progress),
        screen:
          action.progress >= 1
            ? state.scenario === "unavailable"
              ? "unavailable"
              : "result"
            : "analyzing",
      };
  }
}
export const eventLabels = [
  "어드레스",
  "토업",
  "백스윙",
  "탑",
  "다운스윙",
  "임팩트",
  "팔로스루",
  "피니시",
];
export const eventFrames = [80, 93, 97, 104, 109, 112, 114, 129];
// Known sample labels; uploaded videos use proportional dummy positions until API integration.
export function eventTime(index: number, duration: number): number {
  return ((eventFrames[index] + 0.5) / 170) * Math.max(0, duration);
}
