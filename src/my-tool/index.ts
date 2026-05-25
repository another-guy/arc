export async function hello() {
  console.log('Waiting...');
  return new Promise((resolve) => {
    setTimeout(
      () => {
        const [
          nodePath,
          scriptPath,
          ...args
        ] = process.argv;

        const input = args[0];
        console.log(input);
        resolve(input);
      },
      3000,
    );
  });
}

console.log('CALLING...');
await hello();
console.log('DONE!');
