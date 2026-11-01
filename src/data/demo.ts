import type { Video } from "../state/flow";
export const sampleVideo: Video = {
  source: require("../../assets/media/swing-10.mp4"),
  sample: true,
  duration: 170 / 29.97,
};
export const cover = require("../../assets/media/swing-cover.jpg");
export const logo = require("../../assets/kugolf-wordmark.png");
export const issues = [
  {
    id: "impact",
    event: 5,
    phase: "임팩트",
    title: "임팩트 상체 들림",
    score: 42,
    status: "먼저 확인해요",
    color: "#BD5144",
    soft: "#FCEFEB",
    image: require("../../assets/media/impact.jpg"),
    body: "공을 맞히는 순간 상체가 들리는지 살펴보세요.\n어드레스 때의 상체 기울기와 비교해보세요.",
  },
  {
    id: "top",
    event: 3,
    phase: "탑",
    title: "탑 하체 흔들림",
    score: 61,
    status: "조금 더 안정적으로",
    color: "#A17124",
    soft: "#FBF4E7",
    image: require("../../assets/media/top.jpg"),
    body: "백스윙 탑에서 무릎과 골반의 위치를 살펴보세요.\n하체가 한쪽으로 크게 움직이는지 확인해보세요.",
  },
  {
    id: "address",
    event: 0,
    phase: "어드레스",
    title: "어드레스 상체 기울기",
    score: 74,
    status: "한 번 더 확인해요",
    color: "#A17124",
    soft: "#FBF4E7",
    image: require("../../assets/media/address.jpg"),
    body: "스윙을 시작하기 전 상체의 기울기를 살펴보세요.\n무릎을 가볍게 굽히고 균형을 확인해보세요.",
  },
] as const;
