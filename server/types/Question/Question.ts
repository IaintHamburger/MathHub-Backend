/**
 * @description 定義`Question`物件的種類
 */
export const QuestionType = {
	/**
	 * @description 文字內容
	 */
	text: "TEXT",
	/**
	 * @description LaTex內容
	 */
	latex: "LATEX",
	/**
	 * @description 未定義資料
	 */
	undefined: undefined,
} as const;

/**
 * @description 題目物件
 */
export class Question {
	/**
	 * @description 題目物件種類
	 */
	private _type: (typeof QuestionType)[keyof typeof QuestionType];
	/**
	 * @description 題目內容
	 */
	private _content: string;

	public constructor(type: (typeof QuestionType)[keyof typeof QuestionType], content: string) {
		this._type = type;
		this._content = content;
	}

	public get type(): (typeof QuestionType)[keyof typeof QuestionType] {
		return this._type;
	}
}
