import React from "react";
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

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Image
            source={require("../../assets/images/search.png")}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by MR Number"
            placeholderTextColor="#777"
          />
        </View>

        {/* Children List */}
        {[
          { name: "CHILD 1", goals: 3 },
          { name: "CHILD 2", goals: 2 },
          { name: "CHILD 3", goals: 3 },
          { name: "CHILD 4", goals: 3 },
        ].map((child, index) => (
          <View key={index} style={styles.childCard}>
            <Text style={styles.childName}>{child.name}</Text>
            <Text style={styles.childInfo}>MR Number: 000000000</Text>
            <Text style={styles.childInfo}>Active Goals: {child.goals}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Child Button */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        onPress={() => navigation.navigate("AddChild")}
      >
        <Text style={styles.addIcon}>＋</Text>
        <Text style={styles.addText}>Add Child</Text>
      </TouchableOpacity>

      {/* Bottom Navigation Bar */}
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
          onPress={() => navigation.navigate("GoalTracking")}
        >
          <Image
            source={require("../../assets/images/target.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Goal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Sessions")}
        >
          <Image
            source={require("../../assets/images/presentation.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Sessions</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Report")}
        >
          <Image
            source={require("../../assets/images/report.png")}
            style={styles.navIcon}
          />
          <Text style={styles.navText}>Report</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D9E7F7",
  },
  scrollContent: {
    paddingBottom: responsiveHeight(22),
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
  childName: {
    fontSize: responsiveFontSize(2),
    fontWeight: "bold",
    marginBottom: responsiveHeight(0.5),
    color: "#000",
  },
  childInfo: {
    fontSize: responsiveFontSize(1.7),
    color: "#333",
  },
  floatingAddButton: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: responsiveHeight(22),
    right: responsiveWidth(8),
    backgroundColor: "#3C6E71",
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(10),
    height: responsiveHeight(7),
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    marginBottom: responsiveHeight(0.3),
    resizeMode: "contain",
  },
  navText: {
    color: "black",
    fontSize: responsiveFontSize(1.8),
    fontWeight: "600",
  },
});
