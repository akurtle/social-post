import React from "react";
import { View, Text } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";

export function SettingsScreen({ onLogout }: { onLogout: () => void }) {
  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Settings</Text>
      <Text>Demo app: stores queued posts offline in SQLite, syncs to API when online.</Text>
      <PrimaryButton title="Logout" onPress={onLogout} />
    </View>
  );
}
