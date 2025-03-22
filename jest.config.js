module.exports ={
    displayName:'mi-sitio-web',
    maxWorkers: 3,
    bail: true,
    preset: 'jest-preset-angular',
    roots: ['<rootDir>/src/'],
    testMatch:['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv:['<rootDir>/src/test.ts'],
    collectCoverage:true,
    cacheDirectory: '<rootDir>/jestCache',
    coverageReporters:['text-summary', 'lcov'],
    coverageDirectory: 'coverage/mi-sitio-web',
    globals:{
        'ts-jtest':{
            tsconfig: '<rootDir>/tsconfig.spec.json',
        }
    }

}