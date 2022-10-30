/**
 * @file Utilities for analyzing the source API's decorators
 */
import { Decorator } from 'ts-morph';
/**
 * Expect a decorator to have a single, string literal argument
 * @param dec The decorator
 * @returns Nothing if the decorator has no argument, a { lit: string } if the decorator has a string literal, an Error else
 */
export declare function expectSingleStrLitDecorator(dec: Decorator): string | null | Error;
