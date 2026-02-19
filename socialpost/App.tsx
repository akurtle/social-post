import React, { useEffect, useState } from "react";
import { SafeAreaView, View, Text } from "react-native";
import { initDb } from "./src/db/sqlite";
import { getToken } from "./src/state/authStore";
import { LoginScreen } from "./src/screens/LoginScreen";
import { HomeScreen } from "./src/screens/HomeScreen";

export default function App() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      await initDb();
      const t = await getToken();
      setAuthed(!!t);
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {authed ? (
        <HomeScreen onLogout={() => setAuthed(false)} />
      ) : (
        <LoginScreen onAuthed={() => setAuthed(true)} />
      )}
    </SafeAreaView>
  );
}
