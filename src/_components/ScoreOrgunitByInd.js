import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  SafeAreaView,
} from "react-native";
import {
  Table,
  Row,
  Rows,
  Cell,
  TableWrapper,
} from "react-native-table-component";
import { useSelector } from "react-redux";
import { scorecardColor } from "../_services/ScorecardColor";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Sharing from "expo-sharing";
import ViewShot from "react-native-view-shot";
import i18n from "i18n-js";
import SearchableDropdown from "react-native-searchable-dropdown";
import { ExpandableListView } from "react-native-expandable-listview";

const ScoreOrgunitByInd = () => {
  const dataStore = useSelector((state) => state.dataStore.dataStore);
  const orgunitData = useSelector((state) => state.chart.orgunitData);
  let data = orgunitData.data;
  let group = orgunitData.group;

  const [listIndicators, setListIndicators] = useState([]);
  const [listDefault, setListDefault] = useState([]);
  const [selectedItem, setSelectedItem] = useState();
  const [expandableItem, setExpandableItem] = useState([]);

  const indGroup = dataStore.indicatorGroup.filter((elt) => elt.code == group);

  const onSelectedItem = (item) => {
    //console.log("=======item========", item);
    setSelectedItem(item);
    let expand = [buildListExpandableByItem(item)];
    setExpandableItem(expand);
  };

  const buildListExpandableByItem = (item) => {
    let header = data.headers;
    let checkItem = data.lignes.filter(
      (elt) => elt[0].trim() == item.name.trim()
    );
    let indicator = new Object();
    indicator.item = item;
    indicator.values = [];

    //console.log("=======checkItem[0].length========", checkItem.length);
    for (var i = 1, c = header.length; i < c; i++) {
      indicator.values.push({
        orgunit: header[i],
        value: checkItem.length > 0 ? checkItem[0][i] : null,
      });
    }

    //console.log("=======indicator========", JSON.stringify(indicator));

    let expand = {
      id: indicator.item.id,
      categoryName: indicator.item.name,
      subCategory: [
        {
          customInnerItem: (
            <View style={{ margin: 10 }}>
              <Table borderStyle={styles.table}>
                <TableWrapper style={styles.row}>
                  <Cell
                    style={{ width: 220, backgroundColor: "#fff" }}
                    data={"Orgunit"}
                    textStyle={styles.tableHeading}
                  />
                  <Cell
                    style={{ width: 100, backgroundColor: "#fff" }}
                    data={"Valeur"}
                    textStyle={styles.tableHeading}
                  />
                </TableWrapper>

                {indicator.values?.map((elt, index) => {
                  let backgroundColor = scorecardColor(
                    item.name,
                    elt.value,
                    dataStore
                  );
                  //console.log("cellData ", JSON.stringify(cellData));
                  return (
                    <TableWrapper key={index} style={styles.rowHeader}>
                      <Cell
                        key={index + 1}
                        style={[{ width: 220 }, backgroundColor]}
                        data={elt.orgunit}
                        textStyle={styles.text}
                      />
                      <Cell
                        key={index + 2}
                        style={[{ width: 100 }, backgroundColor]}
                        data={elt.value + "%"}
                        textStyle={styles.text}
                      />
                    </TableWrapper>
                  );
                })}
              </Table>
            </View>
          ),
        },
      ],
    };

    return expand;

    //console.log("=======expand========", JSON.stringify(expand));
  };

  const buildListExpandable = async (listInd) => {
    //console.log("========listInd========", JSON.stringify(listInd));
    let listExpand = [];
    listInd.map((item) => {
      let expand = buildListExpandableByItem(item);
      listExpand.push(expand);
    });
    return listExpand;
  };

  const buildListIndicator = async () => {
    //console.log("==========group===========", JSON.stringify(group));
    let listInd = [];
    await dataStore.indicators.map((ind, index) => {
      if (ind.groupCode == group)
        listInd.push({ id: ind.dhisID, name: ind.name });
      return listInd;
    });
    //console.log("==========listInd===========", JSON.stringify(listInd));
    setListIndicators(listInd);
    setListDefault(listInd);
    let listExpand = await buildListExpandable(listInd);
    setExpandableItem(listExpand);
    //console.log("==========listExpand===========", JSON.stringify(listExpand));
  };

  useEffect(() => {
    (async () => {
      await buildListIndicator();
    })();
  }, [dataStore]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headSection}>
        <Text style={styles.titleHeading}>
          {i18n.t("titre-table-ou")} du {indGroup[0].titre}{" "}
          {" des 12 derniers mois"}
        </Text>
      </View>
      {/* console.log("==========render======", JSON.stringify(data)) */}
      <SearchableDropdown
        selectedItems={selectedItem}
        onItemSelect={(item) => {
          onSelectedItem(item);
        }}
        containerStyle={{ padding: 5 }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          backgroundColor: "#ddd",
          borderColor: "#bbb",
          borderWidth: 1,
          borderRadius: 5,
        }}
        itemTextStyle={{ color: "#222" }}
        itemsContainerStyle={{ maxHeight: 300 }}
        items={listIndicators}
        defaultIndex={2}
        resetValue={false}
        textInputProps={{
          placeholder: "Choisir le text",
          underlineColorAndroid: "transparent",
          style: {
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
          },
          onTextChange: (text) => {
            //console.log("========text=======", text.trim() == "");
            //console.log("========listIndicators=======", listIndicators);
            if (text.trim() == "") {
              setListIndicators(listDefault);
            } else {
              let list = listIndicators.filter((ind) =>
                ind.name.trim().includes(text.trim())
              );
              setListIndicators(list);
            }
          },
        }}
        listProps={{
          nestedScrollEnabled: true,
        }}
      />
      <View style={styles.chartContainer}>
        <ExpandableListView
          data={expandableItem} // required
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  headSection: {
    paddingBottom: 15,
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
  rowHeader: { flexDirection: "row", height: 60 },
  chartContainer: {
    flex: 1,
  },
  posit: {
    alignItems: "center",
  },
});

export default ScoreOrgunitByInd;
