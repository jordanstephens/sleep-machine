/// <reference types="node" />

declare module 'vose-alias-method' {
  export class VoseAliasMethod {
    constructor(probabilities: number[])
    next(): number
  }
}
