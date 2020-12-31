function S4() :string {
  // eslint-disable-next-line no-bitwise
  return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

function guid():string {
  return (`${S4()}-${S4()}-${S4()}-${S4()}${S4()}`);
}

export default guid;
