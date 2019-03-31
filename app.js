console.log("JS locked and loaded");

// Global DOM Variables
console.log("selecting boards");
const game = document.getElementById("game");

// Global Variables

const playerShips = [];
let computerShipPoints = [];
let shotsFired = [];
let emptyFields = [];
let hitFields = [];

// util Functions
const getRandomInt = maxNumber => Math.floor(Math.random() * maxNumber);

// Generate grid for placement of ships (Id identifiers per field)
const makeGameGrid = type => {
  console.log("making grid for type", type);
  console.log("Love you");
  const board = document.createElement("div");
  board.className = `${type} board`;
  board.id = `${type}Board`;
  game.appendChild(board);
  for (i = 0; i < 100; i++) {
    const gridItem = document.createElement("div");
    gridItem.className = `grid ${type}`;
    gridItem.id = `${type}${i}`;
    board.appendChild(gridItem);
  }
};

// Need one player board and one computer board
makeGameGrid("player");
makeGameGrid("computer");

// Logic for computer placement of ships

const shipLengths = [1, 5, 3, 2];

const placeShip = shipLength => {
  console.log("ship", shipLength);
  const placementPoints = getFields(shipLength);
  console.log("placementPoints", placementPoints);
  placementPoints.forEach(field => {
    const gridField = document.getElementById(`computer${field}`);
    gridField.className = gridField.className + " ship hidden";
  });
  computerShipPoints = [...computerShipPoints, ...placementPoints];
};

const getFields = shipLength => {
  const startingPoint = getRandomInt(100);
  const horizontal = Math.random() >= 0.5;
  let shipFields = [startingPoint];
  for (i = 0; i < shipLength; i++) {
    if (i !== 0)
      shipFields = horizontal
        ? [...shipFields, startingPoint + i]
        : [...shipFields, startingPoint + i * 10];
  }
  return checkFieldsLegal(shipFields) ? shipFields : getFields(shipLength);
};

const checkFieldsLegal = shipFields => {
  // check you won't leave the board
  if (shipFields.some(field => field > 100)) {
    console.log("fields generated are invalid horizontally");
    return false;
  }
  if (
    shipFields.some(
      field =>
        field
          .toString()
          .split()
          .includes(9) &&
        shipFields.some(field =>
          field
            .toString()
            .split()
            .includes(9)
        )
    )
  ) {
    console.log("fields generated are invalid vertically");
    return false;
  }
  // check no other ship already lives there
  if (
    shipFields.some(field =>
      document.getElementById(`computer${field}`).className.includes("ship")
    )
  ) {
    console.log("A ship is already anchored here");
    return false;
  }
  return true;
};

shipLengths.map(placeShip);
console.log("computerShips after placement", computerShipPoints);

// Logic for player placement of ships

// Logic for computer shot choices

const shootAtPlayer = () => {
  console.log("shooting");
  handleShot(false, chooseShot());
};

const chooseShot = () => {
  const preferredShots = [
    ...new Set(
      hitFields
        .map(fieldId => [fieldId + 1, fieldId - 1, fieldId + 10, fieldId - 10])
        .reduce((acc, arr) => {
          acc = [...acc, ...arr];
          return acc;
        }, [])
        .filter(
          fieldId =>
            !shotsFired.includes(fieldId) && fieldId < 101 && fieldId > -1
        )
    )
  ];
  if (preferredShots.length > 0)
    return preferredShots[Math.floor(Math.random(preferredShots.length))];

  let randomShot = getRandomInt(100);
  if (shotsFired.includes(randomShot)) randomShot = getRandomInt(100);
  return randomShot;
};

handleShot = (player, idToTest) => {
  const fieldToTest = document.getElementById(
    `${player ? "player" : "computer"}${idToTest}`
  );
  const classes = fieldToTest.className;
  const hit = classes.includes("ship");
  if (!player) shotsFired = [...shotsFired, idToTest];
  if (hit) {
    fieldToTest.className = classes + " hit";
    hitFields = [...hitFields, idToTest];
    checkForWin(player);
  }
  if (!hit) {
    fieldToTest.className = classes + " miss";
    emptyFields = [...emptyFields, idToTest];
  }
};

const checkForWin = player => {
  const actor = player ? "player" : "computer";
  const fieldsToCheck = Array.from(
    document.getElementsByClassName(`grid ${actor}`)
  ).filter(field => field.className.includes("ship"));
  console.log("checking fields: ", fieldsToCheck);
  if (fieldsToCheck.every(field => field.className.includes("hit")))
    return window.alert(`${actor} has won!`);
};

setInterval(shootAtPlayer, 1000);

// Logic to test for hit/shot

// Change class on hit and track score
