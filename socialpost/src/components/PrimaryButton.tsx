import React from "react";
import { Pressable, Text } from "react-native";

export function PrimaryButton({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        padding: 12,
        borderRadius: 10,
        marginVertical: 6,
        backgroundColor: disabled ? "#aaa" : "#111"
      }}
    >
      <Text style={{ color: "white", textAlign: "center", fontWeight: "600" }}>{title}</Text>
    </Pressable>
  );
}
