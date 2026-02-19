import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextField } from "../components/TextField";
import { PrimaryButton } from "../components/PrimaryButton";
import { addLocalPost, type Platform } from "../db/postsRepo";

function uuid() {
  return Math.random().toString(16).slice(2) + "_" + Date.now().toString(16);
}

export function ComposeScreen() {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform>("twitter");
  const [minutesFromNow, setMinutesFromNow] = useState("1");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <View style={{ padding: 16, gap: 8 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Compose</Text>
      {msg ? <Text>{msg}</Text> : null}

      <TextField value={content} onChangeText={setContent} placeholder="Write your post…" multiline style={{ height: 120 }} />

      <TextField value={platform} onChangeText={(v: any) => setPlatform(v)} placeholder="platform: twitter/instagram/tiktok/linkedin/other" />

      <TextField value={minutesFromNow} onChangeText={setMinutesFromNow} placeholder="Schedule in minutes (e.g. 5)" keyboardType="numeric" />

      <PrimaryButton
        title="Save to local queue"
        disabled={!content.trim()}
        onPress={async () => {
          const mins = Math.max(0, Number(minutesFromNow || "0"));
          const scheduledAt = new Date(Date.now() + mins * 60_000).toISOString();
          await addLocalPost({
            id: uuid(),
            content: content.trim(),
            platform,
            scheduledAt,
            status: "queued",
            serverId: null
          });
          setContent("");
          setMsg("Queued locally ✅ (works offline)");
          setTimeout(() => setMsg(null), 2000);
        }}
      />
    </View>
  );
}
