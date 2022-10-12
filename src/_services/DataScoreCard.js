import axios from "axios";

const getData = async (endpoint, login, pwd) => {
  var response = await axios
    .get(endpoint, {
      auth: { username: login, password: pwd },
    })
    .then((response) => response)
    .catch((error) => {
      console.error("=======axios error====", error);
      return [];
    });

  return response;
};

export const getMetadata = async (login, pwd, baseUrl) => {
  var endpoint = baseUrl + "/api/dataStore/malariaSoreCard/indicator";
  //console.log("===========endpoint==========" + endpoint);

  var response = await getData(endpoint, login, pwd);
  /* console.log(
    "==========dataStore test==========" + JSON.stringify(response.data)
  ); */
  return response;
};

export const getLevelDHIS = async (login, pwd, baseUrl) => {
  try {
    let endpoint =
      baseUrl +
      "/api/organisationUnitLevels.json?paging=false&fields=name,level";
    //console.log("====endpoint=========", JSON.stringify(endpoint));
    const response = await getData(endpoint, login, pwd);
    //console.log("====response=========",JSON.stringify(response.data.organisationUnitLevels));
    if (response.status === "ERROR") {
      console.error(response.message);
      return [];
    }
    return response.data.organisationUnitLevels;
  } catch (error) {
    console.error("level error ", error);
    return [];
  }
};

export const getOrgunitByLevel = async (login, pwd, baseUrl, level) => {
  var endpoint =
    baseUrl +
    "/api/organisationUnits.json?paging=false&fields=id,name,level,parent[id,name,parent[id,name]]&filter=level:eq:" +
    level;
  //console.log("==========je suis là 1=========", endpoint);
  var response = await getData(endpoint, login, pwd);
  if (response.status === "ERROR") {
    console.error(response.message);
    return;
  }
  //await console.info("=====organisation======",JSON.stringify(response.data.organisationUnits[0]))
  return response.data.organisationUnits;
};

export const getIndicatorsID = async (DatastoreData, group) => {
  //console.log("===========DatastoreData=========="+JSON.stringify(DatastoreData))
  var elements = DatastoreData.indicators;

  var listUID = "";
  elements.map((item) => {
    if (!listUID?.includes(item.uid) && item.groupCode == group) {
      listUID = listUID === "" ? item.dhisID : listUID + ";" + item.dhisID;
    }
  });
  //console.log("===========listUID==========" + listUID);
  return listUID;
};

export const tableDataByPeriod = async (
  listUID,
  uidOU,
  login,
  pwd,
  baseUrl
) => {
  var uidOU = uidOU.split("-");
  var uid = uidOU[0];
  var lev = parseFloat(uidOU[1]);
  //console.log("===========uid graph==========" + uid);
  //console.log("===========lev graph==========" + lev);

  var endpoint =
    baseUrl +
    "/api/analytics.json?dimension=pe:LAST_12_MONTHS&dimension=dx:" +
    listUID +
    "&rows=dx&columns=pe&displayProperty=NAME&showHierarchy=true&hideEmptyColumns=false&&filter=ou:" +
    uid +
    "&hideEmptyRows=true&ignoreLimit=true&tableLayout=true";
  //console.log("===========endpoint==========" + endpoint);
  var response = await getData(endpoint, login, pwd);
  //await console.log('==========response=========='+JSON.stringify(response))
  return response.data;
};

export const transforme = async (data, dataStore) => {
  //console.log("=======Data====", JSON.stringify(data));
  let headers = ["Indicators"];
  let lignes = [];
  let periods = data.metaData.dimensions.pe;

  await periods.map((elt) => {
    let pe = data.metaData.items[elt];
    headers.push(pe.name);
  });
  //console.log('headers', JSON.stringify(headers));

  await data.rows.map((elt) => {
    let list = dataStore.indicators.filter(
      (ind) => ind.dhisName.trim() == elt[1].trim()
    );
    //console.log("list", JSON.stringify(list));
    let ligne = [list[0].name.trim()];
    //console.log("ligne", JSON.stringify(ligne));
    for (var i = 4, c = elt.length; i < c; i++) {
      ligne.push(elt[i]);
    }
    lignes.push(ligne);
  });

  //console.log('lignes', JSON.stringify(lignes));

  let tableData = new Object();
  tableData.headers = headers;
  tableData.lignes = lignes;
  //console.log('tableData', JSON.stringify(tableData));

  return tableData;
};

export const tableDataByOrgunit = async (
  listUID,
  uidOU,
  login,
  pwd,
  baseUrl
) => {
  var uidOU = uidOU.split("-");
  var uid = uidOU[0];
  var lev = parseFloat(uidOU[1]);
  //console.log("===========uid graph==========" + uid);
  //console.log("===========lev graph==========" + lev);
  let listLevel = await getLevelDHIS(login, pwd, baseUrl);

  let stringLevel = lev < listLevel.length ? ";LEVEL-" + (lev + 1) : "";

  var endpoint =
    baseUrl +
    "/api/analytics.json?dimension=ou:" +
    uid +
    stringLevel +
    "&dimension=dx:" +
    listUID +
    "&rows=dx&columns=ou&displayProperty=NAME&showHierarchy=true&hideEmptyColumns=true&filter=pe:LAST_12_MONTHS&hideEmptyRows=true&ignoreLimit=true&tableLayout=true";
  //console.log("===========endpoint Orgunit==========" + endpoint);
  let response = await getData(endpoint, login, pwd);
  //console.log("==========response orgunit==========" + JSON.stringify(response));

  try {
    if (response.status === "ERROR") {
      console.error("=====error status=====" + response.message);
      return [];
    }
    return response?.data;
  } catch (error) {
    console.error("=======Orgunit data erro=========== ", error);
    return [];
  }
};

export const transformeDataOrgunit = async (data, dataStore) => {
  //console.log("==========Data============", JSON.stringify(data));
  //console.log("==========dataStore============", JSON.stringify(dataStore));
  let headers = ["Indicators"];
  let lignes = [];
  let orgunits = data?.metaData?.dimensions?.ou;
  let nbre_column = data?.headerWidth - 2;

  await orgunits?.map((elt, index) => {
    //console.log("========index===============", JSON.stringify(index));

    if (index < nbre_column) {
      let ou = data.metaData.items[elt];
      headers.push(ou.name);
    }
  });
  //console.log("========headers===============", JSON.stringify(headers));

  await data?.rows.map((elt) => {
    let list = dataStore?.indicators.filter(
      (ind) => ind.dhisName.trim() == elt[1].trim()
    );
    //console.log("list", JSON.stringify(list));
    let ligne = [list[0].name.trim()];
    //console.log("ligne", JSON.stringify(ligne));
    for (var i = 2, c = elt.length; i < c; i++) {
      ligne.push(elt[i]);
    }
    lignes.push(ligne);
  });

  //console.log('lignes', JSON.stringify(lignes));

  let tableData = new Object();
  tableData.headers = headers;
  tableData.lignes = lignes;
  //console.log('tableData', JSON.stringify(tableData));

  return tableData;
};
