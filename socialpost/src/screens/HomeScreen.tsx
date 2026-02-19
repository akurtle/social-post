import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { setToken } from "../state/authStore";
import { ComposeScreen } from "./ComposeScreen";
import { QueueScreen } from "./QueueScreen";
import { SettingsScreen } from "./SettingsScreen";

type Tab = "compose" | "queue" | "settings";

export function HomeScreen({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("compose");

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 12, flexDirection: "row", gap: 8, justifyContent: "space-between" }}>
        <PrimaryButton title="Compose" onPress={() => setTab("compose")} />
        <PrimaryButton title="Queue" onPress={() => setTab("queue")} />
        <PrimaryButton title="Settings" onPress={() => setTab("settings")} />
      </View>

      <View style={{ flex: 1 }}>
        {tab === "compose" ? <ComposeScreen /> : null}
        {tab === "queue" ? <QueueScreen /> : null}
        {tab === "settings" ? (
          <SettingsScreen
            onLogout={async () => {
              await setToken(null);
              onLogout();
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
