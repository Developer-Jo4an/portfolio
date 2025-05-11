
export let setImportPromise;
const waitPromise = new Promise(resolve => {
  setImportPromise = resolve;
});