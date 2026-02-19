import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { PrimaryButton } from "../components/PrimaryButton";
import { listLocalPosts, markPublishedByServerId, markSynced, type LocalPost } from "../db/postsRepo";
import { publishDue, syncPosts } from "../api/posts";

export function QueueScreen() {
  const [posts, setPosts] = useState<LocalPost[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  async function refresh() {
    const p = await listLocalPosts();
    setPosts(p);
  }

  useEffect(() => {
    refresh();
  }, []);

  async function syncNow() {
    setStatus("Syncing…");
    try {
      const toSync = posts
        .filter((p) => p.status === "queued" && !p.serverId)
        .map((p) => ({ localId: p.id, content: p.content, platform: p.platform, scheduledAt: p.scheduledAt }));

      if (toSync.length) {
        const res = await syncPosts(toSync);
        for (const m of res.created) await markSynced(m.localId, m.serverId);
      }

      const pub = await publishDue();
      for (const serverId of pub.published) await markPublishedByServerId(serverId);

      setStatus("Synced ✅");
      await refresh();
    } catch (e: any) {
      setStatus(`Sync failed: ${e.message}`);
    }
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "700" }}>Queue</Text>
      {status ? <Text style={{ marginVertical: 8 }}>{status}</Text> : null}

      <PrimaryButton title="Refresh" onPress={refresh} />
      <PrimaryButton title="Sync now (upload + publish due)" onPress={syncNow} />

      <ScrollView style={{ marginTop: 12 }}>
        {posts.map((p) => (
          <View key={p.id} style={{ borderWidth: 1, borderColor: "#ddd", padding: 12, borderRadius: 12, marginBottom: 10 }}>
            <Text style={{ fontWeight: "700" }}>{p.platform} • {p.status}</Text>
            <Text>Scheduled: {p.scheduledAt}</Text>
            <Text numberOfLines={4} style={{ marginTop: 6 }}>{p.content}</Text>
            {p.serverId ? <Text style={{ marginTop: 6 }}>Server ID: {p.serverId}</Text> : null}
          </View>
        ))}
        {!posts.length ? <Text style={{ marginTop: 20 }}>No local posts yet.</Text> : null}
      </ScrollView>
    </View>
  );
}
