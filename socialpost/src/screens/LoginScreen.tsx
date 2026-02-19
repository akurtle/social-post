import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextField } from "../components/TextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { login } from "../api/auth";
import { setToken } from "../state/authStore";
import { RegisterScreen } from "./RegisterScreen";

export function LoginScreen({ onAuthed }: { onAuthed: () => void }) {
  const [email, setEmail] = useState("a@test.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) return <RegisterScreen onAuthed={onAuthed} onBack={() => setShowRegister(false)} />;

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Login</Text>
      {error ? <Text style={{ color: "crimson" }}>{error}</Text> : null}

      <TextField value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <TextField value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />

      <PrimaryButton
        title="Login"
        onPress={async () => {
          try {
            setError(null);
            const r = await login(email.trim(), password);
            await setToken(r.token);
            onAuthed();
          } catch (e: any) {
            setError(e.message);
          }
        }}
      />

      <PrimaryButton title="Create account" onPress={() => setShowRegister(true)} />
    </View>
  );
}
