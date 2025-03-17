/**
 * Represents a chat completion response returned by model, based on the provided input.
 * @see https://platform.openai.com/docs/api-reference/chat/object
 */
export interface CompletionResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
