import React from "react";
import { Text, View, StyleSheet } from "react-native";
import TreeView from "react-native-final-tree-view";
import { useSelector } from "react-redux";

const OrgUnitTree = ({ setOrgUnit }) => {
  //const [data,SetData]=useState()
  const data = useSelector((state) => state.orgunit.listOrgunit);
  //console.log("========props orgunits===========" + JSON.stringify(data));
  const getIndicator = (isExpanded, hasChildrenNodes) => {
    if (!hasChildrenNodes) {
      return "-";
    } else if (isExpanded) {
      return "*";
    } else {
      return ">";
    }
  };
  return (
    <View style={styles.container}>
      <TreeView
        data={data} // defined above
        renderNode={({ node, level, isExpanded, hasChildrenNodes }) => {
          return (
            <View>
              <Text
                style={{
                  marginLeft: 25 * level,
                }}
              >
                {getIndicator(isExpanded, hasChildrenNodes)} {node.displayName}
              </Text>
            </View>
          );
        }}
        onNodePress={(node, level) =>
          setOrgUnit(
            node.node.id + "-" + node.node.level + "-" + node.node.displayName
          )
        }
      />
    </View>
  );
};

export default OrgUnitTree;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    //alignItems: 'center',
    backgroundColor: "#E0F2F7",
  },
});
