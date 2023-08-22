import * as vscode from 'vscode';
import * as path from 'path';

function buildVitestArgs(text: string, filePath: string, run: boolean) {
    return ['vitest', 'related', filePath, '-t', text, run ? '--run' : undefined];
}

function buildCdArgs(path: string) {
    return ['cd', path];
}

export function runInTerminal(text: string, filename: string) {
    executeInTerminal(text, filename, true);
}

export function watchInTerminal(text: string, filename: string) {
    executeInTerminal(text, filename, false);
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

function executeInTerminal(text: string, filename: string, run: boolean) {
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
    const vitestArgs = buildVitestArgs(caseNameStr, correctFilePath, run);
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
        runtimeArgs: buildVitestArgs(text, filePath, true),
        cwd,
        runtimeExecutable: 'npx',
        skipFiles: ['<node_internals>/**'],
        type: 'pwa-node',
        console: 'integratedTerminal',
        internalConsoleOptions: 'neverOpen'
    };
}


