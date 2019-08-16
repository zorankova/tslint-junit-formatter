"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
/*
 * TSLint formatter that adheres to the JUnit XML specification.
 * https://github.com/windyroad/JUnit-Schema/blob/master/JUnit.xsd
 */
var Formatter = /** @class */ (function (_super) {
    __extends(Formatter, _super);
    function Formatter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Transform characters that cause trouble in attribute values
     */
    Formatter.prototype.escape = function (input) {
        if (!input) {
            return "";
        }
        return input.replace(/"/g, "'").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };
    /**
     * Generate a java-style package name for a rule
     */
    Formatter.prototype.generateName = function (ruleName) {
        if (!ruleName) {
            return "";
        }
        return "org.tslint." + ruleName.replace(/\s/g, "");
    };
    /**
     * Generate an error <testcase> element
     */
    Formatter.prototype.testcaseXML = function (ruleFailure) {
        var ruleName = this.generateName(ruleFailure.getRuleName());
        var message = this.escape(ruleFailure.getFailure());
        var startPosition = ruleFailure.getStartPosition();
        var _a = startPosition.getLineAndCharacter(), line = _a.line, character = _a.character;
        var fileName = ruleFailure.getFileName();
        return "<testcase time=\"0\" name=\"" + ruleName + "\"><error message=\"" + message + " (" + ruleName + ")\"><![CDATA[" + line + ":" + character + ":" + fileName + "]]></error></testcase>";
    };
    /**
     * Generate a <testsuite> element without a closing tag
     */
    Formatter.prototype.testsuiteStartXML = function (failures) {
        return "<testsuite time=\"0\" tests=\"" + failures.length + "\" skipped=\"0\" errors=\"" + failures.length + "\" failures=\"0\" package=\"org.tslint\" name=\"tslint.xml\">";
    };
    /**
     * Generate a <testsuite> element that represents no failures
     */
    Formatter.prototype.successTestSuiteXML = function () {
        return "<testsuite time=\"0\" tests=\"1\" skipped=\"0\" errors=\"0\" failures=\"0\" package=\"org.tslint\" name=\"tslint.xml\">\n<testcase time=\"0\" name=\"success\"/>\n</testsuite>";
    };
    /**
     * Transform lint failure to JUnit XML format
     */
    Formatter.prototype.format = function (failures) {
        var _this = this;
        var xml = [];
        xml.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        xml.push("<testsuites>");
        if (failures.length > 0) {
            xml.push(this.testsuiteStartXML(failures));
            xml = xml.concat(failures.map(function (failure) { return _this.testcaseXML(failure); }));
            xml.push("</testsuite>");
        }
        else {
            xml.push(this.successTestSuiteXML());
        }
        xml.push("</testsuites>");
        return xml.join('\n');
    };
    return Formatter;
}(Lint.Formatters.AbstractFormatter));
exports.Formatter = Formatter;
