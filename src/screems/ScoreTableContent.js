import React, { Component, useEffect, useState } from "react";
import { checkInternet, displayLoading } from "../_helpers/Connection";
import ScoreTablePeriod from "../_components/ScoreTablePeriod";
import ScoreTableOrgunit from "../_components/ScoreTableOrgunit";
import ScoreTableByInd from "../_components/ScoreTableByInd";
import ScoreOrgunitByInd from "../_components/ScoreOrgunitByInd";

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

import { connect, useSelector } from "react-redux";

import i18n from "i18n-js";

const FirstRoute = () => (
  <ScrollView style={styles.scrollView}>
    <ScoreTablePeriod />
  </ScrollView>
);

const SecondRoute = () => (
  <ScrollView style={styles.scrollView}>
    <ScoreTableOrgunit />
  </ScrollView>
);

const ThirdRoute = () => <ScoreTableByInd />;
const FourRoute = () => <ScoreOrgunitByInd />;

const ScoreTableContent = () => {
  const periodData = useSelector((state) => state.chart.periodData);
  let data = periodData.data;

  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState();
  const [index, setIndex] = useState();
  const [routes, setRoutes] = useState([
    { key: "first", title: i18n.t("tab-period") },
    { key: "second", title: i18n.t("tab-ou") },
    { key: "third", title: i18n.t("tab-period-ind") },
    { key: "four", title: i18n.t("tab-orgunit-ind") },
  ]);

  useEffect(() => {
    checkInternet(setIsOnline);
  }, []);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
    third: ThirdRoute,
    four: FourRoute,
  });

  const handleIndexChange = (index) => this.setState({ index });

  if (data.length <= 0) {
    return (
      <View style={styles.view}>
        <Text style={styles.messagetext}>{i18n.t("no-data")}</Text>
      </View>
    );
  }

  return (
    <>
      <TabView
        navigationState={setIndex}
        renderScene={renderScene}
        onIndexChange={handleIndexChange}
        initialLayout={{ width: Dimensions.get("window").width }}
      />
      {displayLoading(isLoading)}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  scrollView: {
    backgroundColor: "#fff",
    //marginHorizontal: 20,
    flex: 1,
  },
  view: {
    //backgroundColor: '#fff',
    //marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messagetext: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
    alignContent: "center",
  },
});

export default ScoreTableContent;
