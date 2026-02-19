import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextField } from "../components/TextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { register } from "../api/auth";
import { setToken } from "../state/authStore";

export function RegisterScreen({ onAuthed, onBack }: { onAuthed: () => void; onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 24, fontWeight: "700" }}>Register</Text>
      {error ? <Text style={{ color: "crimson" }}>{error}</Text> : null}

      <TextField value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <TextField value={password} onChangeText={setPassword} placeholder="Password (min 6)" secureTextEntry />

      <PrimaryButton
        title="Create account"
        onPress={async () => {
          try {
            setError(null);
            const r = await register(email.trim(), password);
            await setToken(r.token);
            onAuthed();
          } catch (e: any) {
            setError(e.message);
          }
        }}
      />

      <PrimaryButton title="Back" onPress={onBack} />
    </View>
  );
}
