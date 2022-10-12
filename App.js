import { StyleSheet, View, Image } from "react-native";
import * as Localization from "expo-localization";
import { Header } from "react-native-elements";
import Toast from "react-native-toast-message";
import i18n from "i18n-js";
import fr from "./src/i18n/fr.json";
import en from "./src/i18n/en.json";
import { Provider } from "react-redux";
import Store from "./src/_store/_app/store";
import Navigation from "./src/_navigation/Navigation";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

i18n.translations = {
  fr: fr,
  en: en,
};

i18n.locale = Localization.locale;

//console.log("Localization.locale " + Localization.locale);
i18n.fallbacks = true;

export default function App() {
  return (
    <Provider store={Store}>
      <View>
        <Header
          leftComponent={
            <Image style={styles.image} source={require("./assets/logo.png")} />
          }
          centerComponent={{
            text: "Malaria ScoreCard Madagascar",
            style: { color: "#fff" },
          }}
          //rightComponent={{ icon: 'home', color: '#fff' }}
          rightComponent={
            <Image
              style={styles.image}
              source={require("./assets/flag-madagascar.png")}
            />
          }
        />
      </View>
      <Navigation />
      <Toast />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    width: 50,
    height: 40,
  },
});
