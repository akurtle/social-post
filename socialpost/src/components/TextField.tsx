import React from "react";
import { TextInput } from "react-native";

export function TextField(props: any) {
  return (
    <TextInput{...props}
      style={[
        {
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 12,
          borderRadius: 10,
          marginVertical: 6
        },
        props.style
      ]}
    />
  );
}
