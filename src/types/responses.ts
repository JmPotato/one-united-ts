// OpenAI Responses API Types
// @see https://platform.openai.com/docs/api-reference/responses

export interface ResponsesInputMessage {
    role: "user" | "assistant" | "system" | "developer";
    content: string | ResponsesContentPart[];
}

export interface ResponsesContentPart {
    type: "input_text" | "input_image" | "input_file";
    text?: string;
    image_url?: string;
    file_id?: string;
}

export interface ResponsesRequest {
    model: string;
    input: string | ResponsesInputMessage[];
    instructions?: string;
    stream?: boolean;
    max_output_tokens?: number;
    temperature?: number;
    top_p?: number;
    background?: boolean;
    previous_response_id?: string;
    conversation?: string | object;
    include?: string[];
    max_tool_calls?: number;
    parallel_tool_calls?: boolean;
    metadata?: Record<string, string>;
    service_tier?: "auto" | "default" | "flex" | "priority";
    tools?: ResponsesTool[];
    tool_choice?: string | object;
    store?: boolean;
    reasoning?: ResponsesReasoningConfig;
    prompt_cache_key?: string;
    prompt_cache_retention?: string;
}

export interface ResponsesTool {
    type: string;
    function?: {
        name: string;
        description?: string;
        parameters?: object;
    };
}

export interface ResponsesReasoningConfig {
    effort?: "low" | "medium" | "high";
    summary?: "auto" | "concise" | "detailed";
}

export interface ResponsesOutputContent {
    type: "output_text" | "refusal";
    text?: string;
    annotations?: ResponsesAnnotation[];
}

export interface ResponsesAnnotation {
    type: string;
    text?: string;
    start_index?: number;
    end_index?: number;
}

export interface ResponsesOutputMessage {
    type: "message";
    id: string;
    status: "completed" | "in_progress" | "failed";
    role: "assistant";
    content: ResponsesOutputContent[];
}

export type ResponsesOutputItem =
    | ResponsesOutputMessage
    | ResponsesToolCallOutput;

export interface ResponsesToolCallOutput {
    type:
        | "function_call"
        | "web_search_call"
        | "file_search_call"
        | "code_interpreter_call";
    id: string;
    status: string;
    name?: string;
    arguments?: string;
    call_id?: string;
}

export interface ResponsesUsage {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    input_tokens_details?: {
        cached_tokens?: number;
    };
    output_tokens_details?: {
        reasoning_tokens?: number;
    };
}

export interface ResponsesResponse {
    id: string;
    object: "response";
    created_at: number;
    status: "completed" | "in_progress" | "failed" | "cancelled";
    completed_at?: number;
    model: string;
    output: ResponsesOutputItem[];
    usage?: ResponsesUsage;
    temperature?: number;
    top_p?: number;
    error?: {
        code: string;
        message: string;
    } | null;
    metadata?: Record<string, string>;
    output_text?: string;
}

export type ResponsesStreamEventType =
    | "response.created"
    | "response.in_progress"
    | "response.completed"
    | "response.failed"
    | "response.output_item.added"
    | "response.output_item.done"
    | "response.content_part.added"
    | "response.content_part.done"
    | "response.output_text.delta"
    | "response.output_text.done"
    | "response.refusal.delta"
    | "response.refusal.done"
    | "response.function_call_arguments.delta"
    | "response.function_call_arguments.done"
    | "error";

export interface ResponsesStreamEvent {
    type: ResponsesStreamEventType;
    response?: Partial<ResponsesResponse>;
    output_index?: number;
    content_index?: number;
    item_id?: string;
    item?: ResponsesOutputItem;
    part?: ResponsesOutputContent;
    delta?: string;
    text?: string;
    error?: {
        code: string;
        message: string;
    };
}
