export interface ToolResponse {
    [key: string]: unknown;
    content: Array<{
        type: 'text';
        text: string;
    }>;
    structuredContent?: Record<string, unknown>;
    isError?: boolean;
}
export declare function success(data: Record<string, unknown>, markdown?: string): ToolResponse;
export declare function error(message: string, suggestion?: string): ToolResponse;
export declare function handleSupabaseError(err: unknown, context: string): ToolResponse;
export declare function formatPlayerMarkdown(p: Record<string, unknown>): string;
export declare function formatDrillMarkdown(d: Record<string, unknown>): string;
export declare function formatPaginationMarkdown(total: number, count: number, offset: number, hasMore: boolean): string;
//# sourceMappingURL=responses.d.ts.map