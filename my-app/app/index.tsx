import { Text, View } from "react-native";
import Toolbar from "@/src/components/Toolbar";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Toolbar />
      <Text>This will be our cluster app.</Text>
    </View>
  );
}
