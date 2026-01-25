self.onmessage = async (event) => {
  const { type, data } = event.data;
  if (type === 'generate-password') {
    const password = generatePassword(data.length, data.dictionary);
    self.postMessage({ type: 'password-generated', password });
  }
};

function generatePassword(length, dictionary) {
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  let password = '';
  for (let i = 0; i < length; i++) {
    const pos = array[i] % dictionary.length;
    password += dictionary[pos];
  }
  return password;
}