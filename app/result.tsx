import { View, Text, Image, ScrollView, Pressable } from "react-native";
import { useAtomValue } from "jotai";
import { analysisAtom } from "@/atoms/analysis";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  exportAnalysisAsJSON,
  exportAnalysisAsPDF,
} from "@/lib/exportAnalysis";

const CollapsibleSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const rotation = useSharedValue("0deg");

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    rotation.value = withTiming(isCollapsed ? "0deg" : "180deg", {
      duration: 300,
    });
  };

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: rotation.value }],
  }));

  return (
    <View className="bg-white mt-4 rounded-xl mx-4 shadow-md overflow-hidden">
      <Pressable
        onPress={toggleCollapse}
        className="flex-row items-center justify-between p-4"
      >
        <Text className="text-xl font-semibold text-black">{title}</Text>
        <Animated.View style={iconStyle}>
          <Ionicons name="chevron-up" size={24} color="#666" />
        </Animated.View>
      </Pressable>
      {!isCollapsed && <View className="px-4 pb-4">{children}</View>}
    </View>
  );
};

const NutritionItem = ({ label, value }: { label: string; value: string }) => (
  <View className="w-1/2 p-2">
    <Text className="text-sm text-gray-500 mb-1">{label}</Text>
    <Text className="text-base font-medium text-black">{value}</Text>
  </View>
);

const Page = () => {
  const analysis = useAtomValue(analysisAtom);
  if (!analysis) return null;

  return (
    <ScrollView
      className="flex-1 bg-gray-100"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <View className="h-[300px] w-full">
        <Image
          source={{ uri: analysis.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <View className="px-4 pt-5 bg-white">
        <Text className="text-xl font-bold text-black leading-8">
          {analysis.identifiedFood}
        </Text>
      </View>

      <CollapsibleSection title="Portion Information">
        <View className="gap-2">
          <View className="flex-row justify-between">
            <Text className="text-base text-gray-500">Portion Size:</Text>
            <Text className="text-base font-medium text-black">
              {analysis.portionSize}g
            </Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-base text-gray-500">Serving Size:</Text>
            <Text className="text-base font-medium text-black">
              {analysis.recognizedServingSize}g
            </Text>
          </View>
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Nutrition Facts (per portion)">
        <View className="flex-row flex-wrap -mx-2">
          <NutritionItem
            label="Calories"
            value={analysis.nutritionFactsPerPortion.calories}
          />
          <NutritionItem
            label="Protein"
            value={`${analysis.nutritionFactsPerPortion.protein}g`}
          />
          <NutritionItem
            label="Carbs"
            value={`${analysis.nutritionFactsPerPortion.carbs}g`}
          />
          <NutritionItem
            label="Fat"
            value={`${analysis.nutritionFactsPerPortion.fat}g`}
          />
          <NutritionItem
            label="Fiber"
            value={`${analysis.nutritionFactsPerPortion.fiber}g`}
          />
          <NutritionItem
            label="Sugar"
            value={`${analysis.nutritionFactsPerPortion.sugar}g`}
          />
          <NutritionItem
            label="Sodium"
            value={`${analysis.nutritionFactsPerPortion.sodium}mg`}
          />
          <NutritionItem
            label="Cholesterol"
            value={`${analysis.nutritionFactsPerPortion.cholesterol}mg`}
          />
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Additional Notes">
        <View className="gap-2">
          {analysis.additionalNotes.map((note, index) => (
            <Text key={index} className="text-base text-gray-700 leading-6">
              • {note}
            </Text>
          ))}
        </View>
      </CollapsibleSection>

      <View className="mt-6 px-4 gap-3">
        <Pressable
          onPress={() => exportAnalysisAsJSON(analysis)}
          className="bg-blue-500 py-3 rounded-lg items-center shadow-md"
        >
          <Text className="text-white text-base font-semibold">
            📤 Export as JSON
          </Text>
        </Pressable>

        <Pressable
          onPress={() => exportAnalysisAsPDF(analysis)}
          className="bg-orange-500 py-3 rounded-lg items-center shadow-md"
        >
          <Text className="text-white text-base font-semibold">
            🧾 Export as PDF
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Page;
