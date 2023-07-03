import * as vscode from 'vscode';
import * as path from 'path';

function buildVitestArgs(text: string, filePath: string) {
    return ['vitest', 'related', filePath, '-t', text, '--run'];
}

function buildCdArgs(path: string) {
    return ['cd', path];
}

export function runInTerminal(text: string, filename: string) {
    const casePath = path.dirname(filename);
    const terminal = vscode.window.createTerminal(`vitest - ${text}`);

    const casePathStr = JSON.stringify(casePath);
    const caseNameStr = JSON.stringify(text);
    const filePath = path.resolve(casePathStr, filename)
    const paths = filePath.split('\\tests\\')
    const rootDir = paths[0]
    const cdArgs = buildCdArgs(rootDir);
    terminal.sendText(cdArgs.join(' '), true);


    const correctFilePath = '.\\tests\\' + paths[1]
    const vitestArgs = buildVitestArgs(caseNameStr, correctFilePath);
    const npxArgs = ['npx', ...vitestArgs];
    terminal.sendText(npxArgs.join(' '), true);
    terminal.show();
}

function buildDebugConfig(
    cwd: string,
    text: string,
    filePath: string
): vscode.DebugConfiguration {
    return {
        name: 'Debug vitest case',
        request: 'launch',
        runtimeArgs: buildVitestArgs(text, filePath),
        cwd,
        runtimeExecutable: 'npx',
        skipFiles: ['<node_internals>/**'],
        type: 'pwa-node',
        console: 'integratedTerminal',
        internalConsoleOptions: 'neverOpen'
    };
}

export function debugInTermial(text: string, filename: string) {
    const casePath = path.dirname(filename);

    const casePathStr = JSON.stringify(casePath);
    const filePath = path.resolve(casePathStr, filename)
    const paths = filePath.split('\\tests\\')
    const rootDir = paths[0]
    const correctFilePath = '.\\tests\\' + paths[1]
    const config = buildDebugConfig(rootDir, text, correctFilePath);
    vscode.debug.startDebugging(undefined, config);
}
