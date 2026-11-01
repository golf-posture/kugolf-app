import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import type { Video } from "../state/flow";
export async function pickVideo(): Promise<
  Video | "permission" | "read" | null
> {
  try {
    if (Platform.OS !== "web") {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted && permission.accessPrivileges !== "limited")
        return "permission";
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["videos"],
      allowsEditing: false,
      allowsMultipleSelection: false,
      videoExportPreset: ImagePicker.VideoExportPreset.Passthrough,
    });
    if (result.canceled) return null;
    const asset = result.assets[0];
    if (
      !asset?.uri ||
      (asset.duration != null && asset.duration <= 0) ||
      asset.fileSize === 0
    )
      return "read";
    return {
      source: asset.uri,
      sample: false,
      // SDK 54's web picker returns seconds; native pickers return milliseconds.
      duration: (asset.duration ?? 0) / (Platform.OS === "web" ? 1 : 1000),
    };
  } catch {
    return "read";
  }
}
