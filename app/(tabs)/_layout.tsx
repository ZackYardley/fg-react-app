import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks";

export default function TabsLayout() {
  const tabIconDefault = useThemeColor({}, "tabIconDefault");
  const tabIconSelected = useThemeColor({}, "tabIconSelected");
  const tabBackground = useThemeColor({}, "tabBackground");
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="carbon-credit"
        options={{
          tabBarLabel: "",
          tabBarActiveTintColor: tabIconSelected,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: tabBackground,
            paddingTop: 10,
            borderBlockColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cash" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="tree-planting"
        options={{
          tabBarLabel: "",
          tabBarActiveTintColor: tabIconSelected,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: tabBackground,
            paddingTop: 10,
            borderBlockColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="tree" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "",
          tabBarActiveTintColor: tabIconSelected,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: tabBackground,
            paddingTop: 10,
            borderBlockColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          tabBarLabel: "",
          tabBarActiveTintColor: tabIconSelected,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: tabBackground,
            paddingTop: 10,
            borderBlockColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="school" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          tabBarLabel: "",
          tabBarActiveTintColor: tabIconSelected,
          tabBarInactiveTintColor: tabIconDefault,
          tabBarStyle: {
            backgroundColor: tabBackground,
            paddingTop: 10,
            borderBlockColor: backgroundColor,
          },
          tabBarIcon: ({ color, size }) => <MaterialCommunityIcons name="cog" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
