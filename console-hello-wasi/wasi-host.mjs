import { readFile } from 'node:fs/promises';
import { WASI } from 'node:wasi';
import { argv, env } from 'node:process';

const wasi = new WASI({
    version: 'preview1',
    args: argv,
    env,
    preopens: {
        '/': './'
    },
});

const importObject = { wasi_snapshot_preview1: wasi.wasiImport };

const wasm = await WebAssembly.compile(
    await readFile(new URL('./bin/Debug/net7.0/HelloWASI-o.wasm', import.meta.url)),
);
const instance = await WebAssembly.instantiate(wasm, importObject);

wasi.start(instance);