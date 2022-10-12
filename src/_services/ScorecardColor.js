const getColor = (value, target, achieved, notInTrack) => {
  const red = "red";
  const green = "green";
  const yellow = "yellow";
  const gray = "gray";
  //console.log("value " + parseFloat(value));
  value = isNaN(parseFloat(value)) ? value : parseFloat(value);
  target = isNaN(parseFloat(target)) ? 0 : parseFloat(target);
  //console.log("value " + value);
  /* console.log("target " + typeof target);
  console.log("achieved " + typeof achieved);
  console.log("notInTrack " + typeof notInTrack); */

  if (isNaN(parseFloat(value))) {
    return gray;
  } else {
    if (target === 0) {
      if (value < achieved) {
        return green;
      } else if (value < notInTrack && value >= achieved) {
        return yellow;
      } else {
        return red;
      }
    } else {
      if (value >= achieved) {
        return green;
      } else if (value > notInTrack && value < achieved) {
        return yellow;
      } else {
        return red;
      }
    }
  }
};

export const scorecardColor = (name, value, dataStore) => {
  //await console.log("dataStore ", JSON.stringify(dataStore));
  //await console.log("name ", JSON.stringify(name));
  //await console.log("value ", JSON.stringify(isNaN(value)));

  let list = dataStore.indicators.filter(
    (ind) => ind.name.trim() == name.trim()
  );

  let indicator = list.length > 0 ? list[0] : null;
  //await console.log("indicator ", JSON.stringify(indicator));
  let color = new Object();
  color.backgroundColor = "transparent";
  if (indicator) {
    color.backgroundColor = getColor(
      value,
      indicator.target,
      indicator.achieved,
      indicator.notInTrack
    );
    //console.log("Color ", JSON.stringify(color));
  }

  //if (value == 2.83) console.log("Color ici ", JSON.stringify(color));
  //console.log("Color ", JSON.stringify(color));
  return color;
};
