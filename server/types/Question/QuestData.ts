import type { QuestionType } from "./Question.js";
import type { QuestionVariableType } from "./QuestionVariable.js";

export type QuestData = {
	code: string;
	title: string;
	question: {
		type: (typeof QuestionType)[keyof typeof QuestionType];
		content: string;
	}[];
	question_var: {
		type: (typeof QuestionVariableType)[keyof typeof QuestionVariableType];
		sign: string;
		content: string;
	}[];
};
