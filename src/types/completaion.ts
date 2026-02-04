// OpenAI Chat Completions API Types
// @see https://platform.openai.com/docs/api-reference/chat

export interface CompletionMessage {
    role: "system" | "user" | "assistant" | "developer" | "tool" | "function";
    content: string | CompletionContentPart[] | null;
    name?: string;
    tool_calls?: CompletionToolCall[];
    tool_call_id?: string;
    refusal?: string | null;
    annotations?: CompletionAnnotation[];
    audio?: CompletionAudioOutput;
}

export interface CompletionContentPart {
    type: "text" | "image_url" | "input_audio";
    text?: string;
    image_url?: {
        url: string;
        detail?: "auto" | "low" | "high";
    };
    input_audio?: {
        data: string;
        format: "wav" | "mp3";
    };
}

export interface CompletionToolCall {
    id: string;
    type: "function";
    function: {
        name: string;
        arguments: string;
    };
}

export interface CompletionAnnotation {
    type: string;
    text?: string;
    start_index?: number;
    end_index?: number;
    url_citation?: {
        url: string;
        title?: string;
    };
}

export interface CompletionAudioOutput {
    id: string;
    expires_at: number;
    data: string;
    transcript: string;
}

export interface CompletionTool {
    type: "function" | "web_search";
    function?: {
        name: string;
        description?: string;
        parameters?: object;
        strict?: boolean;
    };
}

export interface CompletionResponseFormat {
    type: "text" | "json_object" | "json_schema";
    json_schema?: {
        name: string;
        description?: string;
        schema?: object;
        strict?: boolean;
    };
}

export interface CompletionStreamOptions {
    include_usage?: boolean;
}

export interface CompletionAudioParams {
    voice: "alloy" | "ash" | "ballad" | "coral" | "echo" | "sage" | "shimmer" | "verse";
    format?: "wav" | "mp3" | "flac" | "opus" | "pcm16";
}

export interface CompletionWebSearchOptions {
    search_context_size?: "low" | "medium" | "high";
    user_location?: {
        type: "approximate";
        approximate?: {
            city?: string;
            country?: string;
            region?: string;
            timezone?: string;
        };
    };
}

export interface CompletionReasoningConfig {
    effort?: "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
    summary?: "auto" | "concise" | "detailed";
}

export interface CompletionRequest {
    model: string;
    messages: CompletionMessage[];
    stream?: boolean;
    stream_options?: CompletionStreamOptions;
    max_completion_tokens?: number;
    /** @deprecated Use max_completion_tokens instead */
    max_tokens?: number;
    temperature?: number;
    top_p?: number;
    n?: number;
    stop?: string | string[] | null;
    presence_penalty?: number;
    frequency_penalty?: number;
    logit_bias?: Record<string, number>;
    logprobs?: boolean;
    top_logprobs?: number;
    tools?: CompletionTool[];
    tool_choice?: "none" | "auto" | "required" | { type: "function"; function: { name: string } };
    parallel_tool_calls?: boolean;
    response_format?: CompletionResponseFormat;
    modalities?: ("text" | "audio")[];
    audio?: CompletionAudioParams;
    metadata?: Record<string, string>;
    store?: boolean;
    reasoning_effort?: "none" | "minimal" | "low" | "medium" | "high" | "xhigh";
    service_tier?: "auto" | "default" | "flex" | "priority";
    prompt_cache_key?: string;
    prompt_cache_retention?: string;
    safety_identifier?: string;
    verbosity?: "low" | "medium" | "high";
    web_search_options?: CompletionWebSearchOptions;
    prediction?: {
        type: "content";
        content: string | CompletionContentPart[];
    };
    /** @deprecated Use safety_identifier and prompt_cache_key instead */
    user?: string;
    /** @deprecated Use tool_choice instead */
    function_call?: "none" | "auto" | { name: string };
    /** @deprecated Use tools instead */
    functions?: Array<{
        name: string;
        description?: string;
        parameters?: object;
    }>;
    /** @deprecated */
    seed?: number;
}

export interface CompletionChoice {
    index: number;
    message: CompletionMessage;
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | "function_call" | null;
    logprobs?: {
        content?: Array<{
            token: string;
            logprob: number;
            bytes?: number[];
            top_logprobs?: Array<{
                token: string;
                logprob: number;
                bytes?: number[];
            }>;
        }>;
        refusal?: Array<{
            token: string;
            logprob: number;
            bytes?: number[];
        }>;
    } | null;
}

export interface CompletionUsage {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
    prompt_tokens_details?: {
        cached_tokens?: number;
        audio_tokens?: number;
    };
    completion_tokens_details?: {
        reasoning_tokens?: number;
        audio_tokens?: number;
        accepted_prediction_tokens?: number;
        rejected_prediction_tokens?: number;
    };
}

export interface CompletionResponse {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    choices: CompletionChoice[];
    usage?: CompletionUsage;
    service_tier?: "default" | "flex" | "priority";
    /** @deprecated */
    system_fingerprint?: string;
}

export interface CompletionChunkDelta {
    role?: "assistant";
    content?: string | null;
    refusal?: string | null;
    tool_calls?: Array<{
        index: number;
        id?: string;
        type?: "function";
        function?: {
            name?: string;
            arguments?: string;
        };
    }>;
    /** @deprecated */
    function_call?: {
        name?: string;
        arguments?: string;
    };
}

export interface CompletionChunkChoice {
    index: number;
    delta: CompletionChunkDelta;
    finish_reason: "stop" | "length" | "tool_calls" | "content_filter" | "function_call" | null;
    logprobs?: {
        content?: Array<{
            token: string;
            logprob: number;
            bytes?: number[];
            top_logprobs?: Array<{
                token: string;
                logprob: number;
                bytes?: number[];
            }>;
        }>;
    } | null;
}

export interface CompletionChunk {
    id: string;
    object: "chat.completion.chunk";
    created: number;
    model: string;
    choices: CompletionChunkChoice[];
    usage?: CompletionUsage;
    service_tier?: "default" | "flex" | "priority";
    /** @deprecated */
    system_fingerprint?: string;
}
