"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = exports.AnswerType = exports.QuestionVariable = exports.QuestionVariableType = exports.Question = exports.QuestionType = void 0;
/**
 * @description 定義`Question`物件的種類
 */
var QuestionType;
(function (QuestionType) {
    /** @description 文字內容 */
    QuestionType["TEXT"] = "TEXT";
    /** @description LaTex內容 */
    QuestionType["LATEX"] = "LATEX";
    /** @description 未定義資料 */
    QuestionType["UNDEFINED"] = "UNDEF";
})(QuestionType || (exports.QuestionType = QuestionType = {}));
/**
 * @description 題目物件
 */
class Question {
    /** @description 題目物件種類 */
    type;
    /** @description 題目內容 */
    content;
    constructor(type, content) {
        if (Object.values(QuestionType).includes(type)) {
            this.type = type;
        }
        else {
            this.type = QuestionType.UNDEFINED;
        }
        this.content = content;
    }
}
exports.Question = Question;
var QuestionVariableType;
(function (QuestionVariableType) {
    /** @description 文字內容 */
    QuestionVariableType["TEXT"] = "TEXT";
    /** @description 函式 */
    QuestionVariableType["FUNCTION"] = "FUNC";
    /** @description 未定義資料 */
    QuestionVariableType["UNDEFINED"] = "UNDEF";
})(QuestionVariableType || (exports.QuestionVariableType = QuestionVariableType = {}));
/**
 * @description 題目變數物件
 */
class QuestionVariable {
    /** @description 題目變數物件種類 */
    type;
    /** @description 替換題目內容的符號 */
    sign;
    /** @description 替換的值 */
    content;
    constructor(type, sign, content) {
        if (Object.values(QuestionVariableType).includes(type)) {
            this.type = type;
        }
        else {
            this.type = QuestionVariableType.UNDEFINED;
        }
        this.sign = sign;
        this.content = content;
    }
}
exports.QuestionVariable = QuestionVariable;
/**
 * @description 定義`Answer`物件的種類
 */
var AnswerType;
(function (AnswerType) {
    /** @description 文字內容 */
    AnswerType["TEXT"] = "TEXT";
    /** @description LaTex內容 */
    AnswerType["LATEX"] = "LATEX";
    /** @description 函式 */
    AnswerType["FUNCTION"] = "FUNC";
    /** @description 未定義資料 */
    AnswerType["UNDEFINED"] = "UNDEF";
})(AnswerType || (exports.AnswerType = AnswerType = {}));
/**
 * @description 解答物件
 * @param { AnswerType } 解答物件種類
 * @param { string } 解答物件內容
 */
class Answer {
    type;
    content;
    constructor(type, content) {
        if (Object.values(AnswerType).includes(type)) {
            this.type = type;
        }
        else {
            this.type = AnswerType.UNDEFINED;
        }
        this.content = content;
    }
}
exports.Answer = Answer;
