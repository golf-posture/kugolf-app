import React, { PropsWithChildren } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
export const colors = {
  green: "#00703E",
  ink: "#17251E",
  muted: "#68756D",
  line: "#DFE7E1",
  soft: "#EAF3ED",
  card: "#F2F7F4",
};
export function Txt({ style, bold, ...props }: TextProps & { bold?: boolean }) {
  return (
    <Text
      {...props}
      style={[
        {
          color: colors.ink,
          fontSize: 14,
          lineHeight: 23,
          fontFamily: bold ? "NotoBold" : "NotoRegular",
        },
        style,
      ]}
    />
  );
}
export function Button({
  label,
  onPress,
  secondary,
  disabled,
  testID,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  testID?: string;
}) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        secondary && ui.secondaryButton,
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
      ]}
    >
      <Txt
        bold
        style={{ color: secondary ? colors.green : "white", fontSize: 15 }}
      >
        {label}
      </Txt>
    </Pressable>
  );
}
export function Header({
  title,
  onBack,
}: {
  title: string;
  onBack?: () => void;
}) {
  return (
    <View style={ui.header}>
      {onBack && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="뒤로가기"
          onPress={onBack}
          style={ui.back}
        >
          <Txt style={{ fontSize: 27, lineHeight: 34 }}>←</Txt>
        </Pressable>
      )}
      <Txt bold style={{ fontSize: 16 }}>
        {title}
      </Txt>
    </View>
  );
}
export function Screen({
  children,
  title,
  onBack,
  style,
}: PropsWithChildren<{
  title?: string;
  onBack?: () => void;
  style?: ViewStyle;
}>) {
  const inset = useSafeAreaInsets();
  return (
    <View
      style={[
        ui.screen,
        {
          paddingTop: Platform.OS === "web" ? 24 : inset.top,
          paddingBottom: Math.max(inset.bottom, 16),
        },
      ]}
    >
      {title && <Header title={title} onBack={onBack} />}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[ui.content, style]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}
export function Sheet({
  children,
  visible,
  onClose,
  title,
}: PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title: string;
}>) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={ui.scrim}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="팝업 닫기"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View accessibilityViewIsModal style={ui.sheet}>
          <View style={ui.sheetHeader}>
            <Txt bold style={ui.heading}>
              {title}
            </Txt>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="닫기"
              onPress={onClose}
              style={ui.close}
            >
              <Txt style={{ fontSize: 26 }}>×</Txt>
            </Pressable>
          </View>
          {children}
        </View>
      </View>
    </Modal>
  );
}
export const ui = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
  },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 12 },
  header: { height: 56, justifyContent: "center", alignItems: "center" },
  back: {
    position: "absolute",
    left: 14,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  button: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: colors.green,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.line,
  },
  heading: { fontSize: 21, lineHeight: 31 },
  muted: { color: colors.muted, fontSize: 13, lineHeight: 23 },
  footer: { marginTop: "auto", paddingTop: 26, gap: 10 },
  scrim: {
    flex: 1,
    backgroundColor: "#17251E66",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sheet: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 24,
    gap: 14,
    width: "100%",
    maxWidth: 420,
    maxHeight: "90%",
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  close: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
