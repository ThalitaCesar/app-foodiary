import { View } from "react-native";
import { CreateMealBottomBar } from '../../components/CreateMealBottomBar';
import { HomeHeader } from '../../components/HomeHeader';
import { MealsList } from '../../components/MealsList';

export default function Page() {
  return (
    <View className="flex-1 bg-white">
      <HomeHeader />
      <MealsList />
      <CreateMealBottomBar />
    </View>
  );
}
