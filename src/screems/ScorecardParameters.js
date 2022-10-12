import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableHighlight,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import FlatListComponent from "../_components/FlatListComponent";

import RadioForm from "react-native-simple-radio-button";

import { saveGraphData, getGraphData } from "../_services/DBService";
import {
  getIndicatorsID,
  tableDataByPeriod,
  transforme,
  tableDataByOrgunit,
  transformeDataOrgunit,
} from "../_services/DataScoreCard";
import { checkInternet, displayLoading } from "../_helpers/Connection";
import i18n from "i18n-js";

import {
  deleteOrgunitData,
  deletePeriodData,
  setOrgunitData,
  setPeriodData,
} from "../_store/_feature/chart.slice";
import { useDispatch, useSelector } from "react-redux";

const ScorecardParameters = (props) => {
  const dispatch = useDispatch();
  const dataStore = useSelector((state) => state.dataStore.dataStore);
  const user = useSelector((state) => state.user.user);
  const listOrgunit = useSelector((state) => state.orgunit.listOrgunit);

  const [orgunitLevel, setOrgunitLevel] = useState();
  const [dataFlat, setDataFlat] = useState(listOrgunit.National);
  const [group, setGroup] = useState("G1");
  const [ou, setOu] = useState("");
  const [ouName, setOuName] = useState();
  const [message, setMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState();
  const [groupRadio, setGroupRadio] = useState(
    dataStore.indicatorGroup.map((gpe) => {
      return { label: gpe.name, value: gpe.code };
    })
  );
  const [groupLevelList, setGroupLevelList] = useState(
    listOrgunit.levelDHIS.map((gpe, index) => {
      return { label: gpe.name, value: gpe.level };
    })
  );

  useEffect(() => {
    checkInternet(setIsOnline);
  }, []);

  const setLevel = (value) => {
    //console.log("value " + value);

    setOrgunitLevel(value);
    let nameLevel = groupLevelList.find((x) => x.value === value);
    //console.log("nameLevel " + JSON.stringify(nameLevel));
    setDataFlat(listOrgunit[nameLevel.label]);
    setOuName("");
  };

  const setOrgUnit = (orgunit) => {
    orgunit = orgunit.split("-");
    let uid = orgunit[0];
    let lev = parseFloat(orgunit[1]);
    let nameOu = orgunit[2]; /* + " is selected" */
    let ouVal = uid + "-" + lev;
    //console.log("ouVal", ouVal);
    setOu(ouVal);
    setOuName(nameOu);
  };

  const groupeIndicator = async () => {
    let dataChart = new Object();
    dataChart.url = user?.url;
    dataChart.uidOu = ou;
    dataChart.group_ind = group;
    let valueData = new Object();

    let listElements = await dataStore;
    let listUID = await getIndicatorsID(listElements, group);

    //console.log("==========listUID========", listUID);

    if (listUID != "") {
      let tableByPeriode = await tableDataByPeriod(
        listUID,
        ou,
        user?.login,
        user?.pwd,
        user?.url
      );

      /* await console.log(
          "===========tableByPeriode==========",
          JSON.stringify(tableByPeriode)
        ); */

      let tableDataPeriod = await transforme(tableByPeriode, listElements);

      /* await console.log(
        "===========tableData==========",
        JSON.stringify(tableData)
      ); */
      let periodData = new Object();
      periodData.group = group;
      periodData.orgunitname = ouName;
      periodData.data = tableDataPeriod;

      valueData.dataPeriod = periodData;

      let tableByOrgunit = await tableDataByOrgunit(
        listUID,
        ou,
        user?.login,
        user?.pwd,
        user?.url
      );

      //console.log("===========tableByOrgunit==========",JSON.stringify(tableByOrgunit));

      let tableDataOrgunits = await transformeDataOrgunit(
        tableByOrgunit,
        listElements
      );

      /*  await console.log(
        "===========tableDataOrgunits==========",
        JSON.stringify(tableDataOrgunits)
      ); */
      let orgunitData = new Object();
      orgunitData.group = group;
      orgunitData.data = tableDataOrgunits;

      valueData.dataOrgunit = orgunitData;
      dataChart.value = valueData;

      //console.log("===========dataChart==========", JSON.stringify(dataChart));

      await saveGraphData(dataChart);
      dispatch(setPeriodData(periodData));
      dispatch(setOrgunitData(orgunitData));

      setIsLoading(false);
      props.navigation.navigate("ScoreTableContent");
    } else {
      setMessage(i18n.t("missing-indicator-message"));
      setIsLoading(false);
    }
  };

  const makeData = async () => {
    dispatch(deletePeriodData());
    dispatch(deleteOrgunitData());

    await NetInfo.fetch().then(async (state) => {
      //console.log("Connection type", state.type);
      //console.log("Is connected? parameters", state.isConnected);
      let online = state.isConnected && state.isInternetReachable;
      setIsOnline(online);

      if (online) {
        await groupeIndicator();
      } else {
        let dataChart = new Object();
        dataChart.url = user?.url;
        dataChart.uidOu = ou;
        dataChart.group_ind = group;

        //console.log("=====Verif là=======");

        await getGraphData(dataChart)
          .then((results) => {
            /* console.log(
              "========results getGraphData a voir==========",
              JSON.stringify(results)
            ); */

            dispatch(setPeriodData(results.dataPeriod));
            dispatch(setOrgunitData(results.dataOrgunit));
          })
          .catch((error) => console.log(error));

        setIsLoading(false);
        props.navigation.navigate("ScoreTableContent");
      }
    });
  };

  const onSubmit = async () => {
    setIsLoading(true);
    if (ou != "") {
      setMessage("");
      await makeData();
    } else {
      setMessage(i18n.t("missing-ou-message"));
      setIsLoading(false);
    }
  };

  const searchTextInputChanged = async (text) => {
    //console.log("=====listOrgunit====", JSON.stringify(orgunitLevel));
    //console.log("=====groupLevelList====", JSON.stringify(groupLevelList));
    let orgunitNameTab = groupLevelList.filter(
      (row) => row.value == orgunitLevel
    );
    let orgunitName = orgunitNameTab[0];
    //console.log("=====orgunitName====", JSON.stringify(orgunitNameTab));
    let orgList = listOrgunit[orgunitName.label];
    let newList = orgList.filter((row) => row.name.includes(text));
    //console.log("newList " + text);
    if (newList.length > 0) {
      setDataFlat(newList);
    } else {
      //console.log("lists " + JSON.stringify(this.props.orgunits));

      setDataFlat(orgList);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.posit}>
        <View style={styles.posit2}>
          <Text style={styles.titleText}>{i18n.t("level")}</Text>
          <RadioForm
            radio_props={groupLevelList}
            initial={4}
            formHorizontal={false}
            labelHorizontal={true}
            buttonColor={"#2196f3"}
            animation={true}
            onPress={(value) => {
              setLevel(value);
            }}
          />
        </View>
        <View style={styles.posit2}>
          <Text style={styles.titleText}>{i18n.t("lib-group")}</Text>
          <RadioForm
            radio_props={groupRadio}
            formHorizontal={false}
            labelHorizontal={true}
            buttonColor={"#2196f3"}
            /*  labelStyle={{
                flex: 1,
                //fontSize:10,
                marginRight: 10,
              }} */
            animation={true}
            onPress={(value) => {
              setGroup(value);
            }}
          />
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.posit3}>
          <Text style={styles.titleText}>{i18n.t("lib-orgunit")}</Text>

          <TextInput
            style={styles.titleText2}
            placeholder="Nom de l'orgunit"
            defaultValue={ouName}
            onChangeText={(text) => searchTextInputChanged(text)}
            //onSubmitEditing={() => this._loadFilms()}
          />

          <FlatListComponent data={dataFlat} setOrgUnit={setOrgUnit} />
        </View>

        <View style={styles.posit1}>
          <Text style={styles.messagetext}>{message}</Text>
        </View>

        {displayLoading(isLoading)}

        <View style={styles.submitStyle}>
          <TouchableHighlight
            style={[styles.buttonContainer, styles.loginButton]}
            onPress={() => onSubmit()}
          >
            <Text style={styles.loginText}>{i18n.t("submit-button")}</Text>
          </TouchableHighlight>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerKey: {
    flex: 1,
  },
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: "#DCDCDC",
    marginTop: 10,
  },
  posit: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  posit1: {
    flex: 1,
    marginTop: 10,
    marginLeft: 5,
    alignItems: "center",
  },
  posit3: {
    flex: 3,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  submitStyle: {
    alignItems: "center",
    position: "absolute",
    bottom: 15,
    right: 10,
    left: 10,
  },
  posit2: {
    flex: 1,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: "#E0F2F7",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#0174DF",
    textAlign: "center",
    color: "#EFFBFB",
    marginBottom: 5,
  },
  titleText2: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#17202A",
    backgroundColor: "#FAE5D3",
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  title: {
    textAlign: "center",
    marginVertical: 8,
  },
  messagetext: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: "white",
  },
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

export default ScorecardParameters;
