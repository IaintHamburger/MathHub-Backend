/**
 * @description 定義`Question`物件的種類
 */
export declare enum QuestionType {
    /** @description 文字內容 */
    TEXT = "TEXT",
    /** @description LaTex內容 */
    LATEX = "LATEX",
    /** @description 未定義資料 */
    UNDEFINED = "UNDEF"
}
/**
 * @description 題目物件
 */
export declare class Question {
    /** @description 題目物件種類 */
    type: QuestionType;
    /** @description 題目內容 */
    content: string;
    constructor(type: QuestionType | string, content: string);
}
export declare enum QuestionVariableType {
    /** @description 文字內容 */
    TEXT = "TEXT",
    /** @description 函式 */
    FUNCTION = "FUNC",
    /** @description 未定義資料 */
    UNDEFINED = "UNDEF"
}
/**
 * @description 題目變數物件
 */
export declare class QuestionVariable {
    /** @description 題目變數物件種類 */
    type: QuestionVariableType;
    /** @description 替換題目內容的符號 */
    sign: string;
    /** @description 替換的值 */
    content: string;
    constructor(type: QuestionVariableType | string, sign: string, content: string);
}
/**
 * @description 定義`Answer`物件的種類
 */
export declare enum AnswerType {
    /** @description 文字內容 */
    TEXT = "TEXT",
    /** @description LaTex內容 */
    LATEX = "LATEX",
    /** @description 函式 */
    FUNCTION = "FUNC",
    /** @description 未定義資料 */
    UNDEFINED = "UNDEF"
}
/**
 * @description 解答物件
 * @param { AnswerType } 解答物件種類
 * @param { string } 解答物件內容
 */
export declare class Answer {
    type: AnswerType;
    content: string;
    constructor(type: AnswerType | string, content: string);
}
