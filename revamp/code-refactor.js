/**
 * @typedef {object} Item
 * @property {number} id
 * @property {string} name
 * @property {number} unitPrice
 * @property {string} unit
 */

/**
 * Converts weight to kg if necessary
 * @param value - The value to convert
 * @param unit - The unit of the value
 * @returns The value in kg
 */
const normalizeWeight = (value, unit) => {
  return unit === "g" ? value / 1000 : value;
};

/**
 * Converts price to g if necessary
 * @param price - The price to convert
 * @param unit - The unit of the price
 * @returns The price in g
 */
const normalizePrice = (price, unit) => {
  return unit === "g" ? price * 1000 : price;
};

/**
 * Rounds a given value to the nearest cent using specific rounding logic.
 *
 * The function multiplies the value by 100 to convert it to cents and
 * applies custom rounding rules based on the last digit of the cents.
 * - If the last digit is between 1 and 2, it rounds down to the nearest 10 cents.
 * - If the last digit is between 3 and 4 or between 6 and 7, it rounds to the nearest 5 cents.
 * - If the last digit is between 8 and 9, it rounds up to the next 10 cents.
 * - If the last digit is 0 or 5, it does not round further.
 *
 * @param value - The input value to round
 * @returns The value rounded to the nearest cent
 */
const preciseRound = (value) => {
  const cents = Math.round(value * 100);
  const lastDigit = cents % 10;

  // rounding logic for last digit
  if (lastDigit >= 1 && lastDigit <= 2) {
    return Math.floor(cents / 10) / 10;
  }
  if (lastDigit >= 3 && lastDigit <= 4) {
    return (Math.floor(cents / 10) + 0.5) / 10;
  }
  if (lastDigit >= 6 && lastDigit <= 7) {
    return (Math.floor(cents / 10) + 0.5) / 10;
  }
  if (lastDigit >= 8 && lastDigit <= 9) {
    return (Math.floor(cents / 10) + 1) / 10;
  }

  return cents / 100;
};

/**
 * Creates a sample database of items.
 *
 * Each item has an ID, name, unit price, and unit. The items are stored in an
 * object with the item ID as the key and the item object as the value.
 *
 * @returns The sample database
 */
const createDatabase = () => {
  const items = [
    { id: 1, name: "item1", unitPrice: 1.45, unit: "kg" },
    { id: 2, name: "item2", unitPrice: 1.23, unit: "kg" },
    { id: 3, name: "item3", unitPrice: 2.35, unit: "g" },
    { id: 4, name: "item4", unitPrice: 4.56, unit: "kg" },
    { id: 5, name: "item5", unitPrice: 1.34, unit: "kg" },
    { id: 6, name: "item6", unitPrice: 5.67, unit: "kg" },
    { id: 7, name: "item7", unitPrice: 2.34, unit: "g" },
    { id: 8, name: "item8", unitPrice: 3.45, unit: "kg" },
    { id: 9, name: "item9", unitPrice: 9.1, unit: "kg" },
    { id: 10, name: "item10", unitPrice: 1, unit: "g" },
    { id: 11, name: "item11", unitPrice: 2.13, unit: "g" },
    { id: 12, name: "item12", unitPrice: 2.64, unit: "kg" },
    { id: 13, name: "item13", unitPrice: 2.85, unit: "kg" },
    { id: 14, name: "item14", unitPrice: 2.71, unit: "kg" },
    { id: 15, name: "item15", unitPrice: 1.49, unit: "kg" },
    { id: 16, name: "item16", unitPrice: 1.78, unit: "g" },
    { id: 17, name: "item17", unitPrice: 1.59, unit: "kg" },
    { id: 18, name: "item18", unitPrice: 3.55, unit: "g" },
    { id: 19, name: "item19", unitPrice: 4.05, unit: "kg" },
  ];

  return {
    items: Object.fromEntries(items.map((item) => [item.id, item])),
  };
};

const database = createDatabase();

/**
 * Calculates the total price for given items.
 *
 * The function splits the input string into items and then splits each item into id, quantity, and unit.
 * It then converts the quantity and unit price of each item to kg and g respectively and calculates the total price.
 * The total price is rounded using the UnitConverter.preciseRound function.
 *
 * @param datasString - The string containing the items in the format "id,quantity,unit;id,quantity,unit"
 * @returns The total price rounded to the nearest cent
 */
const handleCalculate = (datasString) => {
  const items = datasString.split(";").map((item) => item.split(","));

  const totalPrice = items.reduce((sum, [id, quantity, unit]) => {
    const item = database.items[id];
    const normalizedQuantity = normalizeWeight(Number(quantity), unit);
    const normalizedPrice = normalizePrice(item.unitPrice, item.unit);

    return sum + normalizedPrice * normalizedQuantity;
  }, 0);

  return preciseRound(totalPrice);
};

/**
 * Queries item prices from the database.
 *
 * This function takes a string of item IDs separated by commas,
 * retrieves their corresponding items from the database, and
 * returns an array of objects containing each item's ID and
 * its price normalized to kg.
 *
 * @param datasString - A string containing item IDs separated by commas
 * @returns An array of objects, each containing the item ID and its price normalized to kg
 */
const handleQuery = (datasString) => {
  const ids = datasString.split(",");
  return ids.map((id) => {
    const item = database.items[id];
    return {
      itemId: Number(id),
      kgPrice: normalizePrice(item.unitPrice, item.unit),
    };
  });
};

/**
 * Process a large data object.
 *
 * The large data object should contain two properties: `action` and `datas`.
 * The `action` property should be either 'calculate' or 'query'. The `datas`
 * property contains the data to be processed. The format of the `datas`
 * property depends on the value of the `action` property. If the `action` is
 * 'calculate', `datas` should be a string of item IDs, quantities, and units
 * separated by semicolons. For example: "1,2,kg;2,1,kg;3,0.1,kg". If the
 * `action` is 'query', `datas` should be a string of item IDs separated by
 * commas. For example: "1,2,3,4".
 *
 * @param largeData - The large data object to process
 * @returns The result of the action. If the action is 'calculate', the result
 * is the total price of the items as a number. If the action is 'query', the
 * result is an array of objects, each containing the item ID and its price
 * normalized to kg.
 */
const summaryApi = (largeData) => {
  switch (largeData.action) {
    case "calculate":
      return handleCalculate(largeData.datas);
    case "query":
      return handleQuery(largeData.datas);
    default:
      return undefined;
  }
};

const testDatas = [
  {
    testNo: 1,
    input: {
      action: "calculate",
      datas: "1,1,kg;2,2,kg;3,0.15,kg;4,4,kg",
    },
    expectedOutput: 374.65,
  },
  {
    testNo: 2,
    input: {
      action: "calculate",
      datas: "9,10,kg;12,1,kg;16,400,g",
    },
    expectedOutput: 805.65,
  },
  {
    testNo: 3,
    input: {
      action: "query",
      datas: "1",
    },
    expectedOutput: [{ itemId: 1, kgPrice: 1.45 }],
  },
  {
    testNo: 4,
    input: {
      action: "query",
      datas: "1,2,3,4",
    },
    expectedOutput: [
      { itemId: 1, kgPrice: 1.45 },
      { itemId: 2, kgPrice: 1.23 },
      { itemId: 3, kgPrice: 2350 },
      { itemId: 4, kgPrice: 4.56 },
    ],
  },
];

function testFunction() {
  testDatas.forEach(({ testNo, input, expectedOutput }) => {
    const receivedOutput = summaryApi(input);

    if (typeof receivedOutput === "object") {
      if (JSON.stringify(receivedOutput) !== JSON.stringify(expectedOutput)) {
        console.error(
          `Failed test #${testNo}, Expected: `,
          expectedOutput,
          "Received: ",
          receivedOutput
        );
      } else {
        console.info(`Passed test #${testNo}`);
      }
    } else {
      if (receivedOutput !== expectedOutput) {
        console.error(
          `Failed test #${testNo}, Expected: `,
          expectedOutput,
          "Received: ",
          receivedOutput
        );
      } else {
        console.info(`Passed test #${testNo}`);
      }
    }
  });
}

testFunction();
