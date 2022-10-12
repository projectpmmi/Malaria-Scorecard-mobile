import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
} from "react-native";
import i18n from "i18n-js";
import { useController, useForm } from "react-hook-form";
import { checkInternet, displayLoading } from "../_helpers/Connection";
import {
  getDataStore,
  getLasttUrl,
  getOrgunit,
  getUser,
  saveDataStore,
  saveOrgunit,
  saveUser,
} from "../_services/DBService";
import {
  getLevelDHIS,
  getMetadata,
  getOrgunitByLevel,
  getOrgunitList,
} from "../_services/DataScoreCard";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../_store/_feature/user.slice";
import { setDataStore } from "../_store/_feature/dataStore.slice";
import { setListOrgunit, setOrgunit } from "../_store/_feature/orgunit.slice";

const Input = ({
  name,
  control,
  placeholder,
  rules,
  defaultValue,
  secureTextEntry,
}) => {
  const { field } = useController({
    control,
    name,
    defaultValue,
    rules,
  });
  //console.log('field.underlineColorAndroid',field)
  return (
    <TextInput
      style={styles.inputs}
      value={field.value}
      //rules={field.rules}
      placeholder={placeholder}
      underlineColorAndroid="transparent"
      secureTextEntry={secureTextEntry}
      onChangeText={field.onChange}
    />
  );
};

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState();
  const [isOnline, setIsOnline] = useState(false);
  const [lastUrl, setLastUrl] = useState();

  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    checkInternet(setIsOnline);
    getLasttUrl()
      .then((row) => {
        //console.log("======row======" + JSON.stringify(row));
        setLastUrl(row);
      })
      .catch((err) => console.log("====Last URL error ====", err));
  }, []);

  const manageNewData = async (user) => {
    setIsLoading(true);
    //console.log("data" + JSON.stringify(user));

    await getMetadata(user.login, user.pwd, user.url)
      .then(async (response) => {
        //get Metadata from datastore
        //console.log("========response=========", JSON.stringify(response.data));
        await saveDataStore(user.url, response.data);
        //props.addDataStore(response.data);
        dispatch(setDataStore(response.data));

        let orgunitList = new Object();
        let orgunitMapping = response.data.orgUnitLevel[0];
        //console.log("orgunitMapping " + JSON.stringify(orgunitMapping));

        let listLevelDHIS = await getLevelDHIS(user.login, user.pwd, user.url);
        //console.log("==========levelDHIS======== " + JSON.stringify(listLevelDHIS));
        orgunitList.levelDHIS = listLevelDHIS;

        for (const [key, value] of Object.entries(orgunitMapping)) {
          //console.log(`${key}: ${value}`);
          let dhisLevel = listLevelDHIS.filter((elt) => elt.level == value);
          let listOrgunit = await getOrgunitByLevel(
            user.login,
            user.pwd,
            user.url,
            value
          );
          orgunitList[dhisLevel[0].name] = listOrgunit;
        }

        await saveOrgunit(user.url, orgunitList);
        dispatch(setListOrgunit(orgunitList));

        await saveUser(user);
        dispatch(setUser(user));
        //props.addUser(user);
        setMessage("");
        setIsLoading(false);
        props.navigation.navigate("ScorecardParameters");
      })
      .catch((error) => {
        //console.log("========metadata error=========", error);
        setMessage(i18n.t("invalid-auth-message"));
        setIsLoading(false);
      });

    //console.log("========Je suis là a voir=========");
  };

  const onSubmit = async (user) => {
    if (isOnline) {
      await manageNewData(user);
    } else {
      setIsLoading(true);
      // get from database
      await getUser(user)
        .then(async (results) => {
          //console.log("========results user a voir==========", results[0]);
          if (results.length > 0) {
            let user = results[0];
            //props.addUser(user);
            dispatch(setUser(user));

            //get orgunit
            await getOrgunit(user.url)
              .then((results) => {
                //console.log("=======results getOrgunit a voir======",JSON.stringify(results));
                //props.addOrguit(results);
                dispatch(setListOrgunit(results));
              })
              .catch((error) => console.log(error));
            //get Datastore data
            await getDataStore(user.url)
              .then((results) => {
                //console.log("========results getDataStore a voir==========",JSON.stringify(results))
                //props.addDataStore(results);
                dispatch(setDataStore(results));
              })
              .catch((error) => console.log(error));

            setIsLoading(false);
            props.navigation.navigate("ScorecardParameters");
          } else {
            setMessage(i18n.t("missing-user-message"));
            setIsLoading(false);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>{i18n.t("titre-login")}</Text>
      <View style={styles.inputContainer}>
        <Image style={styles.inputIcon} />
        <Input
          name="login"
          control={control}
          rules={{ required: true }}
          secureTextEntry={false}
          defaultValue="JoelsonDSFA"
          placeholder={i18n.t("input-user")}
        />
      </View>
      {errors.login && (
        <Text style={styles.required}>{i18n.t("required-user-message")}</Text>
      )}

      <View style={styles.inputContainer}>
        <Image style={styles.inputIcon} />
        <Input
          name="pwd"
          control={control}
          rules={{ required: true }}
          secureTextEntry={true}
          defaultValue="Joelson!234"
          placeholder={i18n.t("input-pwd")}
        />
      </View>
      {errors.pwd && (
        <Text style={styles.required}>{i18n.t("required-pwd-message")}</Text>
      )}

      <View style={styles.inputContainer}>
        <Image style={styles.inputIcon} />
        <Input
          name="url"
          control={control}
          rules={{ required: true }}
          secureTextEntry={false}
          //value={lastUrl}
          defaultValue="https://ministere-sante.mg"
          placeholder="Url"
        />
      </View>
      {errors.url && (
        <Text style={styles.required}>{i18n.t("required-url-message")}</Text>
      )}

      <TouchableHighlight
        style={[styles.buttonContainer, styles.loginButton]}
        onPress={handleSubmit(onSubmit)}
      >
        <Text style={styles.loginText}>{i18n.t("submit-button")}</Text>
      </TouchableHighlight>

      <Text style={styles.messagetext}>{message}</Text>
      {displayLoading(isLoading)}

      <View style={styles.imageContainer}>
        <Image
          style={styles.imageIcon}
          source={require("../../assets/PMI_logo.png")}
        />
        <Text style={styles.logoText}>
          This application was made possible by the generous support of the
          American people through the United States Agency for International
          Development (USAID) and the U.S. President’s Malaria Initiative (PMI)
          under the terms of the PMI Measure Malaria Associate Award No.
          7200AA19LA00001. PMI Measure Malaria is implemented by the University
          of North Carolina at Chapel Hill, in partnership with ICF Macro, Inc.;
          Tulane University; John Snow, Inc.; and Palladium International, LLC.
          The contents do not necessarily reflect the views of USAID/PMI or the
          United States Government.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: "center",
  },
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: "white",
  },
  messagetext: {
    fontSize: 20,
    fontWeight: "bold",
    color: "red",
  },
  required: {
    fontWeight: "bold",
    color: "red",
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
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0174DF",
    textAlign: "center",
    marginBottom: 30,
  },
  imageContainer: {
    //backgroundColor: "red",
    /*   borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "blue", */
    flexDirection: "column",
    //width: 200,
    height: 200,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  imageIcon: {
    width: 350,
    height: 50,
    margin: 0,
    //margin: 5,
    flex: 1,
    resizeMode: "contain",
  },
  logoText: {
    fontSize: 9,
    //margin: 5,
    margin: 0,
    flex: 1,
    opacity: 0.5,
  },
});

export default Login;
