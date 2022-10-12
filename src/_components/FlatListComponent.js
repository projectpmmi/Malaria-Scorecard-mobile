import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
} from "react-native";

const Item = ({ item, onPress, backgroundColor, textColor }) => {
  //console.log("=========item=======" + JSON.stringify(item?.parent?.parent));
  let name;
  name = item.name;
  if (item?.parent?.parent) {
    name =
      item.parent.parent.name + " - " + item.parent.name + " - " + item.name;
  } else if (item?.parent) {
    name = item.parent.name + " - " + item.name;
  } else {
    name = item.name;
  }
  return (
    <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
      <Text style={[styles.title, textColor]}>{name}</Text>
    </TouchableOpacity>
  );
};

const FlatListComponent = ({ data, setOrgUnit }) => {
  //console.log("orgunits " + JSON.stringify(data));
  const [selectedId, setSelectedId] = useState(null);
  const choiceOU = (ou) => {
    setSelectedId(ou);
    setOrgUnit(ou);
  };
  const renderItem = ({ item }) => {
    //console.log("=========item=======" + JSON.stringify(item));
    let ou = item.id + "-" + item.level + "-" + item.name;
    const backgroundColor = ou === selectedId ? "#2980B9" : "#D4E6F1";
    const color = ou === selectedId ? "white" : "black";
    return (
      <Item
        item={item}
        onPress={() => choiceOU(item.id + "-" + item.level + "-" + item.name)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
        //horizontal={true}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    padding: 5,
    marginVertical: 1,
    marginHorizontal: 5,
    borderRadius: 10,
  },
  title: {
    //fontSize: 15,
  },
});

export default FlatListComponent;
