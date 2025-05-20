/**
 * @description 題目變數種類
 */
export const QuestionVariableType = {
	/**
	 * @description 文字內容
	 */
	text: "TEXT",
	/**
	 * @description 函式
	 */
	function: "FUNCTION",
	/**
	 * @description 未定義資料
	 */
	undefined: undefined,
} as const;

/**
 * @description 題目變數物件
 */
export class QuestionVariable {
	/**
	 * @description 題目變數物件種類
	 */
	private _type: (typeof QuestionVariableType)[keyof typeof QuestionVariableType];
	/**
	 * @description 替換題目內容的符號
	 */
	private _sign: string;
	/**
	 * @description 替換的值
	 */
	private _content: string;

	public constructor(
		type: (typeof QuestionVariableType)[keyof typeof QuestionVariableType],
		sign: string,
		content: string,
	) {
		this._type = type;
		this._sign = sign;
		this._content = content;
	}

	public get type(): (typeof QuestionVariableType)[keyof typeof QuestionVariableType] {
		return this._type;
	}
}
