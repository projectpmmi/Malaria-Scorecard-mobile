import React from "react";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, View, ActivityIndicator } from "react-native";

export const checkInternet = async (setIsOnline) => {
  NetInfo.addEventListener((networkState) => {
    //console.log("Connection type - ", networkState.isInternetReachable);
    //console.log("Is connected? - ", networkState.isConnected);
    const online = networkState.isConnected && networkState.isInternetReachable;
    setIsOnline(online);
    if (online) {
      Toast.show({
        type: "success",
        position: "bottom",
        text1: "Vous êtes connecté",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    } else {
      Toast.show({
        type: "error",
        position: "bottom",
        text1: "Vous êtes déconnecté",
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 30,
        bottomOffset: 40,
      });
    }
  });
};

export const displayLoading = (isLoading) => {
  if (isLoading) {
    return (
      <View style={styles.loading_container}>
        <ActivityIndicator size="large" color="#145A32" />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  loading_container: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
