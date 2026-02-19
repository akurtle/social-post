import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";

import { initDb } from "../src/db/sqlite";
import { getToken, setToken } from "../src/state/authStore";
import { TextField } from "../src/components/TextField";
import { PrimaryButton } from "../src/components/PrimaryButton";
import { login, register } from "../src/api/auth";

export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      await initDb();
      const t = await getToken();
      if (t) router.replace({ pathname: "/home" as any });
      setReady(true);
    })();
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Loading…</Text>
      </View>
    );
  }

  async function submit() {
    try {
      setError(null);
      const r =
        mode === "login"
          ? await login(email.trim(), password)
          : await register(email.trim(), password);

      await setToken(r.token);
      router.replace({ pathname: "/home" as any });

    } catch (e: any) {
      setError(e.message);
    }
  }

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>
        {mode === "login" ? "Login" : "Register"}
      </Text>

      {error ? <Text style={{ color: "crimson" }}>{error}</Text> : null}

      <TextField value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <TextField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

      <PrimaryButton title={mode === "login" ? "Login" : "Create account"} onPress={submit} />

      <PrimaryButton
        title={mode === "login" ? "Switch to Register" : "Switch to Login"}
        onPress={() => setMode(mode === "login" ? "register" : "login")}
      />
    </View>
  );
}
