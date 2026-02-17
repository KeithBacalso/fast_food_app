import { Category } from "@/type";
import cn from "clsx";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Platform,
  Text,
  TouchableOpacity,
} from "react-native";

const Filter = ({ categories }: { categories: Category[] }) => {
  const searchParams = useLocalSearchParams();
  const [active, setActive] = useState(searchParams.category || "");

  const handlePress = (id: string) => {
    setActive(id);

    if (id === "all") router.setParams({ category: undefined });
    else router.setParams({ category: id });
  };

  //! Array of (Category OR other object) that is why the type set is inside a parenthesis.
  //! The dollar sign $id has a dollar sign since it is for Appwrite.
  //! It is also a good practice when using union (OR) types to keep shared fields (like $id) consistent so common properties can be accessed safely.
  //
  //! Example: if the OR custom object used { id: string } instead of { $id: string }, then item.$id in FlatList keyExtractor would cause a TypeScript error
  //! because not all union members would contain the $id field.
  const filterData: (Category | { $id: string; name: string })[] =
    categories
      ? [{ $id: "all", name: "All" }, ...categories]
      : [{ $id: "all", name: "All" }];

  return (
    <FlatList
      data={filterData}
      keyExtractor={(item) => item.$id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-x-2 pb-3"
      renderItem={({ item }) => (
        <TouchableOpacity
          key={item.$id}
          className={cn(
            "filter",
            active === item.$id ? "bg-amber-500" : "bg-white",
          )}
          style={
            Platform.OS === "android"
              ? { elevation: 5, shadowColor: "#878787" }
              : {}
          }
          onPress={() => handlePress(item.$id)}
        >
          <Text
            className={cn(
              "body-medium",
              active === item.$id ? "text-white" : "text-gray-200",
            )}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  );
};

export default Filter;
