import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Image,
} from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
import { useChild } from "../context/ChildContext";

export default function HomeScreen({ navigation }) {
  const { childrenList, setSelectedChild } = useChild();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChildren, setFilteredChildren] = useState(childrenList);

  useEffect(() => {
    setFilteredChildren(childrenList);
  }, [childrenList]);

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.trim() === "") {
      setFilteredChildren(childrenList);
    } else {
      const filtered = childrenList.filter(
        (child) =>
          child.childName.toLowerCase().includes(text.toLowerCase()) ||
          child.mrNumber.includes(text)
      );
      setFilteredChildren(filtered);
    }
  };

  const handleChildPress = (child) => {
    setSelectedChild(child);
    navigation.navigate("ChildReport", { childId: child.id });
  };

  const getActiveGoalsCount = (child) => {
    let activeGoals = 0;
    Object.values(child.goalsProgress || {}).forEach((category) => {
      Object.values(category).forEach((goal) => {
        if (!goal.sessions || goal.sessions.length < 3) {
          activeGoals++;
        }
      });
    });
    return activeGoals;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🔍 Search Bar */}
        <View style={styles.searchContainer}>
          <Image
            source={require("../../assets/images/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by Child Name or MR Number"
            placeholderTextColor="#777"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        {/* 👦 Children List */}
        {filteredChildren.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No children found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery
                ? "Try a different search term"
                : "Add your first child to get started"}
            </Text>
          </View>
        ) : (
          filteredChildren.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={styles.childCard}
              onPress={() => handleChildPress(child)}
            >
              <View style={styles.childHeader}>
                <Text style={styles.childName}>{child.childName}</Text>
                <Text style={styles.mrNumber}>MR: {child.mrNumber}</Text>
              </View>
              <Text style={styles.childInfo}>
                Age: {child.dob || "Not specified"}
              </Text>
              <Text style={styles.childInfo}>
                Gender: {child.gender || "Not specified"}
              </Text>
              <Text style={styles.childInfo}>
                Active Goals: {getActiveGoalsCount(child)}
              </Text>
              <Text style={styles.childInfo}>
                Total Sessions: {child.sessions ? child.sessions.length : 0}
              </Text>
              <Text style={styles.viewReportText}>
                Tap to view full report →
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* ➕ Floating Add Child Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => navigation.navigate("AddChild")}
      >
        <Text style={styles.addIcon}>＋ </Text>
        <Text style={styles.addText}>Add Child</Text>
      </TouchableOpacity>

      {/* 📄 View All Records Button */}
      <TouchableOpacity
        style={styles.recordsButton}
        onPress={() => navigation.navigate("ChildrenList")}
      >
        <Text style={styles.recordsButtonText}>View All Records</Text>
      </TouchableOpacity>

      {/* ⬇️ Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Image
            source={require("../../assets/images/home.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("CategoryList")}
        >
          <Image
            source={require("../../assets/images/target.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("ChildrenList")}
        >
          <Image
            source={require("../../assets/images/report.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Reports</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BUTTON_COLOR = "#293D55";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E7F7",
  },
  scrollContent: {
    paddingBottom: responsiveHeight(25),
    alignItems: "center",
  },
  searchContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: responsiveWidth(3),
    marginTop: responsiveHeight(7),
    marginBottom: responsiveHeight(3),
  },
  searchIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    tintColor: "#555",
    marginRight: responsiveWidth(2),
    resizeMode: "contain",
  },
  searchInput: {
    flex: 1,
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(1.9),
    color: "#000",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: responsiveHeight(5),
  },
  emptyStateText: {
    fontSize: responsiveFontSize(2.2),
    fontWeight: "bold",
    color: "#666",
    marginBottom: responsiveHeight(1),
  },
  emptyStateSubtext: {
    fontSize: responsiveFontSize(1.8),
    color: "#888",
    textAlign: "center",
  },
  childCard: {
    backgroundColor: "#fff",
    width: "90%",
    marginBottom: responsiveHeight(2),
    borderRadius: 12,
    padding: responsiveWidth(4),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  childHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveHeight(1),
  },
  childName: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    color: "#000",
  },
  mrNumber: {
    fontSize: responsiveFontSize(1.6),
    color: "#666",
    fontWeight: "600",
  },
  childInfo: {
    fontSize: responsiveFontSize(1.7),
    color: "#333",
    marginBottom: responsiveHeight(0.3),
  },
  viewReportText: {
    fontSize: responsiveFontSize(1.6),
    color: "#3C6E71",
    fontWeight: "600",
    marginTop: responsiveHeight(1),
    textAlign: "right",
  },
  floatingAddButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: responsiveHeight(22),
    right: responsiveWidth(8),
    backgroundColor: BUTTON_COLOR,
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(10),
    height: responsiveHeight(7),
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  recordsButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: responsiveHeight(22),
    left: responsiveWidth(8),
    backgroundColor: BUTTON_COLOR,
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(10),
    height: responsiveHeight(7),
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  recordsButtonText: {
    color: "#fff",
    fontSize: responsiveFontSize(1.8),
    fontWeight: "bold",
  },
  addIcon: {
    color: "#fff",
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    marginRight: responsiveWidth(1.5),
  },
  addText: {
    color: "#fff",
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    paddingVertical: responsiveHeight(1.5),
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: responsiveHeight(10.5),
    position: "absolute",
    bottom: responsiveHeight(1.5),
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  navItem: {
    alignItems: "center",
  },
  navIcon: {
    width: responsiveWidth(6.5), // ✅ equal size for all icons
    height: responsiveWidth(6.5),
    marginBottom: responsiveHeight(0.5),
    resizeMode: "contain",
  },
  navText: {
    color: "black",
    fontSize: responsiveFontSize(1.8),
    fontWeight: "600",
  },
});
