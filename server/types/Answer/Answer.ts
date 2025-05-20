/**
 * @description 定義`Answer`物件的種類
 */
export const AnswerType = {
	/**
	 * @description 文字內容
	 */
	text: "TEXT",
	/**
	 * @description LaTex內容
	 */
	latex: "LATEX",
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
 * @description 解答物件
 */
export class Answer {
	/**
	 * @description 解答物件種類
	 */
	private _type: (typeof AnswerType)[keyof typeof AnswerType];
	/**
	 * @description 解答內容
	 */
	private _content: string;

	public constructor(type: (typeof AnswerType)[keyof typeof AnswerType], content: string) {
		this._type = type;
		this._content = content;
	}

	public get type(): (typeof AnswerType)[keyof typeof AnswerType] {
		return this._type;
	}

	public get content(): string {
		return this._content;
	}
}
