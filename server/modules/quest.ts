/**
 * @description 定義`Question`物件的種類
 */
export enum QuestionType {
    /** @description 文字內容 */
    TEXT = 'TEXT',
    /** @description LaTex內容 */
    LATEX = 'LATEX',
    /** @description 未定義資料 */
    UNDEFINED = 'UNDEF'
}

/**
 * @description 題目物件
 */
export class Question {
    /** @description 題目物件種類 */
    type: QuestionType
    /** @description 題目內容 */
    content: string

    constructor(type: QuestionType | string, content: string) {
        if (Object.values(QuestionType).includes(type as QuestionType)) {
            this.type = type as QuestionType
        }
        else {
            this.type = QuestionType.UNDEFINED
        }
        this.content = content
    }
}

export enum QuestionVariableType {
    /** @description 文字內容 */
    TEXT = 'TEXT',
    /** @description 函式 */
    FUNCTION = 'FUNC',
    /** @description 未定義資料 */
    UNDEFINED = 'UNDEF'
}

/**
 * @description 題目變數物件
 */
export class QuestionVariable {
    /** @description 題目變數物件種類 */
    type: QuestionVariableType
    /** @description 替換題目內容的符號 */
    sign: string
    /** @description 替換的值 */
    content: string

    constructor(type: QuestionVariableType | string, sign: string, content: string) {
        if (Object.values(QuestionVariableType).includes(type as QuestionVariableType)) {
            this.type = type as QuestionVariableType
        }
        else {
            this.type = QuestionVariableType.UNDEFINED
        }
        this.sign = sign
        this.content = content
    }
}

/**
 * @description 定義`Answer`物件的種類
 */
export enum AnswerType {
    /** @description 文字內容 */
    TEXT = 'TEXT',
    /** @description LaTex內容 */
    LATEX = 'LATEX',
    /** @description 函式 */
    FUNCTION = 'FUNC',
    /** @description 未定義資料 */
    UNDEFINED = 'UNDEF'
}

/**
 * @description 解答物件
 * @param { AnswerType } 解答物件種類
 * @param { string } 解答物件內容
 */
export class Answer {
    type: AnswerType
    content: string

    constructor(type: AnswerType | string, content: string) {
        if (Object.values(AnswerType).includes(type as AnswerType)) {
            this.type = type as AnswerType
        }
        else {
            this.type = AnswerType.UNDEFINED
        }
        this.content = content
    }
}