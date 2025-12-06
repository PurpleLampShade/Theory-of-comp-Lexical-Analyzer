// Lexical Analyzer
// Made by: Destiny Morrison and Hope Dysert

const fs = require("fs");

// Token Counters
let keywordCount = 0;
let operatorCount = 0;
let identifierCount = 0;
let numberCount = 0;
let symbolCount = 0;
let errorCount = 0;

// Set of Valid Keywords
const KEYWORDS = new Set(["IF", "ELSE", "WHILE", "PRINT", "INTEGER", "FLOAT", "GET"]);

// List of Token Expressions (Listed and Used for Visibility of Expressions)
const EXPRESSIONS = [
    "(==|!=|<=|>=)",                   // Multi-char Operators
    "[+\\-*/=<>]",                     // Single-char Operators
    "[0-9]+\\.[0-9]+",                 // Floats
    "[0-9]+",                          // Integers
    "[A-Za-z][A-Za-z0-9_]*",           // Identifiers
    "[(){};]",                         // Symbols
    "[0-9]*\\.[0-9]*[A-Za-z0-9]*",     // Illegal Number Formats
    "."                                // Other Characters
];

// Make Listed Expressions Into Regex Format (Used to Flag Tokens in Example Programs for Classification)
const REGEX = new RegExp("\\s*(" + EXPRESSIONS.join("|") + ")", "g");

// Try to Read the Example File and Count Tokens (Catch any Errors) (ChatGPT Used to Format this Section)
try {
    const lines = fs.readFileSync('SCW_Examples/Ex1.txt', "utf-8").split(/\r?\n/);
    let lineNumber = 0;

    for (let line of lines) {
        lineNumber++;
        let match;
        REGEX.lastIndex = 0; // Reset the Regex

        while ((match = REGEX.exec(line)) !== null) {
            let token = match[1].trim();
            if (token === "") continue;

            classifyToken(token, lineNumber);
        }
    }

} catch (err) {
    console.error(err);
}

// Check What Each Token Is in the Example Programs
function classifyToken(token) {

    // See If Keyword Exists in Example Program
    if (KEYWORDS.has(token)) {
        keywordCount++;
        return printToken(token, "Keyword");
    }

    // See If Operator (Single or Multi Char) Exists in Example Program
    if (["==", "!=", "<=", ">="].includes(token) || /[+\-*/=<>]/.test(token)) {
        operatorCount++;
        return printToken(token, "Operator");
    }

    // See If Float Exists in Example Program
    if (/^[0-9]+\.[0-9]+$/.test(token)) {
        numberCount++;
        return printToken(token, "Float");
    }

    // See If Integer Exists in Example Program
    if (/^[0-9]+$/.test(token)) {
        numberCount++;
        return printToken(token, "Integer");
    }

    // Check for Illegal Number Formats
    if (isIllegalNumberFormat(token)) {
        errorCount++;
        return printToken(token, "ERROR: Illegal Number Format");
    }

    // See If Identifier Exists in Example Program
    if (/^[A-Za-z][A-Za-z0-9_]*$/.test(token)) {
        identifierCount++;
        return printToken(token, "Identifier");
    }

    // See If Symbol Exists in Example Program
    if (/^[(){};]$/.test(token)) {
        symbolCount++;
        return printToken(token, "Symbol");
    }

    // Anything Not Specified in the Grammars Is Invalid
    if (isInvalidCharacter(token)) {
        errorCount++;
        return printToken(token, "ERROR: Invalid Character");
    }

    // General Unknown Token Error
    errorCount++;
    return printToken(token, "ERROR: Unknown Token");
}

// Illegal Number Formats
function isIllegalNumberFormat(token) {
    return (
        /^[0-9]*\.[0-9]*\./.test(token) ||    // More Than One Dot
        /^\.[0-9]+$/.test(token) ||           // Dot at Front
        /^[0-9]+\.$/.test(token) ||           // Dot at End
        /^[0-9]+\.[A-Za-z]+$/.test(token) ||  // Character at Back
        /^[0-9]*\.[A-Za-z]+/.test(token) ||   // Character with Dot
        /^[A-Za-z]+\.[0-9]+/.test(token)      // Character at Front
    );
}

// Invalid Character Symbols
function isInvalidCharacter(token) {
    return /[^A-Za-z0-9(){};+\-*/=<> \t]/.test(token);
}

// Print Out Each Token Instance
function printToken(token, type) {
    console.log(`Token: ${token}, Type: ${type}`);
}

// Print Out Totals to the Console (Errors Don't Count to the Actual Token Total)
let total = keywordCount + operatorCount + identifierCount + numberCount + symbolCount;
console.log("Total Tokens:", total);
console.log("Keywords:", keywordCount);
console.log("Operators:", operatorCount);
console.log("Identifiers:", identifierCount);
console.log("Numbers:", numberCount);
console.log("Symbols:", symbolCount);
console.log("Errors:", errorCount);