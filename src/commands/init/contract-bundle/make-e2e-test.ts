const makeFullE2ETest = (name: string, contractFile: string) => (
`describe("E2E Testing ${name} contract", () => {
  const getRandomInt = () => Math.round(Math.random() * 1000);

  let contract = null;

  // Contract will be deployed just once
  beforeAll(async () => {
    const storage = getRandomInt();
    
    // If tests were launched on testenet specifying a contract address with the --contracts option,
    // NO DEPLOY WILL BE EXECUTED, but contract will just be accessed instead.
    // For this reason keep in mind that the contract storage state is something you
    // CANNOT PREDICT (unless you just deployed this contract; in that case go on)
    contract = await deployContract('${contractFile}', storage);
  });

  test("it should increment the stored number", async () => {
    const increment = getRandomInt();

    // Grab the content of contract's storage in blockchain
    const initialValue = await contract.storage();

    // We invoke the "Increment" contract endpoint
    const op = await contract.methods.increment(increment).send();
    await op.confirmation();

    // Grab again the content of contract's storage in blockchain
    const finalValue = await contract.storage();
    
    // In Taquito, numbers are returned as Strings, so we have to wrap result in Number()
    expect(Number(finalValue)).toBe(Number(initialValue) + increment);
  });

  test("it should decrement the stored number", async () => {
    const decrement = getRandomInt();

    // Grab the content of contract's storage in blockchain
    const initialValue = await contract.storage();

    // We invoke the "Decrement" contract endpoint
    const op = await contract.methods.decrement(decrement).send();
    await op.confirmation();

    // Grab again the content of contract's storage in blockchain
    const finalValue = await contract.storage();
    
    // In Taquito, numbers are returned as Strings, so we have to wrap result in Number()
    expect(Number(finalValue)).toBe(Number(initialValue) - decrement);
  });
});
`);

const makeEmptyE2ETest = (name: string, contractFile: string) => (
`describe("E2E Testing ${name} contract", () => {
  const getRandomInt = () => Math.round(Math.random() * 1000);

  let contract = null;

  // Contract will be deployed just once
  beforeAll(async () => {
    const storage = getRandomInt();
    
    // If tests were launched on testenet specifying a contract address with the --contracts option,
    // NO DEPLOY WILL BE EXECUTED, but contract will just be accessed instead.
    // For this reason keep in mind that the contract storage state is something you
    // CANNOT PREDICT (unless you just deployed this contract; in that case go on)
    contract = await deployContract('${contractFile}', storage);
  });

  test("it should deploy the contract with correct storage", async () => {
    const storage = {};

    // Grab the content of contract's storage in blockchain
    const contractStorage = await contract.storage();

    expect(Number(contractStorage)).toBe(storage);
  });
});
`);

export const makeE2ETest = (name: string, contractFile: string, hasExamples: boolean) =>
 hasExamples 
 ? makeFullE2ETest(name, contractFile)
 : makeEmptyE2ETest(name, contractFile);