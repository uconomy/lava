const makeFullTest = (name: string, contractFile: string) => (
`describe("Testing ${name} contract", () => {
  const getRandomInt = () => Math.round(Math.random() * 1000);

  let storage = 0;
  let contract = null;

  // Contract will be deployed before every single test, to make sure we
  // do a proper unit test in a stateless testing process
  beforeEach(async () => {
    storage = getRandomInt();
    contract = await deployContract('${contractFile}', storage);
  });

  test("it should deploy the contract with correct storage", async () => {
    // Grab the content of contract's storage in blockchain
    const contractStorage = await contract.storage();
    
    // In Taquito, numbers are returned as Strings, so we have to wrap result in Number()
    expect(Number(contractStorage)).toBe(storage);
  });

  test("it should increment the stored number", async () => {
    const increment = getRandomInt();

    // We invoke the "Increment" contract endpoint
    const op = await contract.methods.increment(increment).send();
    await op.confirmation();

    // Grab the content of contract's storage in blockchain
    const contractStorage = await contract.storage();
    
    // In Taquito, numbers are returned as Strings, so we have to wrap result in Number()
    expect(Number(contractStorage)).toBe(storage + increment);
  });

  test("it should decrement the stored number", async () => {
    const decrement = getRandomInt();

    // We invoke the "Decrement" contract endpoint
    const op = await contract.methods.decrement(decrement).send();
    await op.confirmation();

    // Grab the content of contract's storage in blockchain
    const contractStorage = await contract.storage();
    
    // In Taquito, numbers are returned as Strings, so we have to wrap result in Number()
    expect(Number(contractStorage)).toBe(storage - decrement);
  });
});
`);

const makeEmptyTest = (name: string, contractFile: string) => (
`describe("Testing ${name} contract", () => {
  test("it should deploy the contract with correct storage", async () => {
    const storage = {};
    const contract = await deployContract('${contractFile}', storage);

    // Grab the content of contract's storage in blockchain
    const contractStorage = await contract.storage();

    expect(Number(contractStorage)).toBe(storage);
  });
})
`);

export const makeTest = (name: string, contractFile: string, hasExamples: boolean) =>
 hasExamples 
 ? makeFullTest(name, contractFile)
 : makeEmptyTest(name, contractFile);