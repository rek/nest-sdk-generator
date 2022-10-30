"use strict";
/**
 * @file Utilities for analyzing the source API's decorators
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.expectSingleStrLitDecorator = void 0;
const ts_morph_1 = require("ts-morph");
const logging_1 = require("../logging");
/**
 * Expect a decorator to have a single, string literal argument
 * @param dec The decorator
 * @returns Nothing if the decorator has no argument, a { lit: string } if the decorator has a string literal, an Error else
 */
function expectSingleStrLitDecorator(dec) {
    const args = dec.getArguments();
    if (args.length > 1) {
        return new Error(`Multiple (${args.length}) arguments were provided to the decorator`);
    }
    else if (args.length === 0) {
        return null;
    }
    const [arg] = args;
    if (!ts_morph_1.Node.isStringLiteral(arg)) {
        return new Error((0, logging_1.format)('The argument provided to the decorator is not a string literal:\n>>> {cyan}', arg.getText()));
    }
    return arg.getLiteralText();
}
exports.expectSingleStrLitDecorator = expectSingleStrLitDecorator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVjb3JhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2FuYWx5emVyL2RlY29yYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7OztBQUVILHVDQUEwQztBQUMxQyx3Q0FBbUM7QUFFbkM7Ozs7R0FJRztBQUNILFNBQWdCLDJCQUEyQixDQUFDLEdBQWM7SUFDeEQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFBO0lBRS9CLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDbkIsT0FBTyxJQUFJLEtBQUssQ0FBQyxhQUFhLElBQUksQ0FBQyxNQUFNLDRDQUE0QyxDQUFDLENBQUE7S0FDdkY7U0FBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzVCLE9BQU8sSUFBSSxDQUFBO0tBQ1o7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFBO0lBRWxCLElBQUksQ0FBQyxlQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBQSxnQkFBTSxFQUFDLDZFQUE2RSxFQUFFLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUE7S0FDdkg7SUFFRCxPQUFPLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQTtBQUM3QixDQUFDO0FBaEJELGtFQWdCQyJ9