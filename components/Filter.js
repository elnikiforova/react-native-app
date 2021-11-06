import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Slider from "@react-native-community/slider";

export default ({ name, value, step, minimum, maximum, onChange }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name}</Text>
      <Slider
        style={styles.slider}
        value={value}
        step={step}
        minimumValue={minimum}
        maximumValue={maximum}
        onValueChange={onChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
    paddingLeft: 20,
  },
  text: { textAlign: "center" },
  slider: { width: 150 },
});
