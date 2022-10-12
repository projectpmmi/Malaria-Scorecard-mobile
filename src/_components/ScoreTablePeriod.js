import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { Table, Row, Cell, TableWrapper } from "react-native-table-component";
import { useSelector } from "react-redux";
import { scorecardColor } from "../_services/ScorecardColor";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import i18n from "i18n-js";

const ScoreTablePeriod = () => {
  const dataStore = useSelector((state) => state.dataStore.dataStore);
  const periodData = useSelector((state) => state.chart.periodData);
  let data = periodData.data;
  let group = periodData.group;

  const viewShot = useRef();
  const indGroup = dataStore.indicatorGroup.filter((elt) => elt.code == group);
  const onShare = async () => {
    await viewShot.current.capture().then((uri) => {
      console.log("do something with ", uri);
      //setLien(uri)
      Sharing.shareAsync(uri);
      //onShare(uri)
    });
  };
  return (
    <View style={styles.container}>
      <View style={styles.posit}>
        <Button
          icon={<Icon name="share-alt-square" size={20} color="white" />}
          title={i18n.t("share-button")}
          onPress={onShare}
        />
      </View>
      {/* <View style={styles.headSection}>
        <Text style={styles.titleHeading}>
          {i18n.t("titre-table-period")} du {indGroup[0].titre}
        </Text>
      </View> */}

      <ScrollView horizontal>
        <ViewShot ref={viewShot} style={styles.chartContainer}>
          <Table borderStyle={styles.table}>
            <Row
              data={[
                i18n.t("titre-table-period") +
                  " du " +
                  indGroup[0].titre +
                  " de " +
                  periodData.orgunitname,
              ]}
              style={styles.headSection}
              textStyle={styles.titleHeading}
            />
            <TableWrapper style={styles.row}>
              {data?.headers.map((cellData, cellIndex) => {
                if (cellIndex == 0) {
                  //console.log("=========cellIndex========" + cellData);
                  return (
                    <Cell
                      key={cellIndex}
                      data={cellData}
                      style={{ width: 120 }}
                      textStyle={styles.tableHeading}
                    />
                  );
                }
                return (
                  <Cell
                    key={cellIndex}
                    style={{ width: 120 }}
                    data={cellData}
                    textStyle={styles.tableHeading}
                  />
                );
              })}
            </TableWrapper>

            {data?.lignes.map((rowData, index) => {
              const name = rowData[0];

              return (
                <TableWrapper key={index} style={styles.row}>
                  {rowData.map((cellData, cellIndex) => {
                    if (cellIndex == 0) {
                      return (
                        <Cell
                          key={cellIndex}
                          style={{ width: 120 }}
                          data={cellData}
                          textStyle={styles.textLabel}
                        />
                      );
                    }
                    let backgroundColor = scorecardColor(
                      name,
                      cellData,
                      dataStore
                    );
                    //console.log("cellData ", JSON.stringify(cellData));
                    return (
                      <Cell
                        key={cellIndex}
                        style={[{ width: 120 }, backgroundColor]}
                        data={cellData}
                        textStyle={styles.text}
                      />
                    );
                  })}
                </TableWrapper>
              );
            })}
          </Table>
        </ViewShot>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  headSection: {
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  titleHeading: {
    //marginTop: 20,
    fontWeight: "bold",
    fontSize: 20,
    marginHorizontal: 50,
  },
  table: {
    margin: 5,
    borderWidth: 1,
    borderColor: "#CCD1D1",
  },
  tableHeading: {
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
    marginLeft: 5,
  },
  header: { height: 50, backgroundColor: "#537791" },
  textLabel: { margin: 5 },
  text: { textAlign: "center", fontWeight: "100" },
  row: { flexDirection: "row", height: 40 },
  chartContainer: {
    flex: 1,
  },
  posit: {
    alignItems: "center",
    marginBottom: 5,
  },
});

export default ScoreTablePeriod;
