import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import { PrimaryButton } from "../src/components/PrimaryButton";
import { setToken } from "../src/state/authStore";
import { ComposeScreen } from "../src/screens/ComposeScreen";
import { QueueScreen } from "../src/screens/QueueScreen";
import { SettingsScreen } from "../src/screens/SettingsScreen";

type Tab = "compose" | "queue" | "settings";

export default function Home() {
  const router = useRouter();
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
              router.replace("/");
            }}
          />
        ) : null}
      </View>
    </View>
  );
}
