#!/usr/bin/env node
//#region src/my-tool/index.ts
async function hello() {
	console.log("Waiting...");
	return new Promise((resolve) => {
		setTimeout(() => {
			const [nodePath, scriptPath, ...args] = process.argv;
			const input = args[0];
			console.log(input);
			resolve(input);
		}, 3e3);
	});
}
console.log("CALLING...");
await hello();
console.log("DONE!");
//#endregion
export { hello };
