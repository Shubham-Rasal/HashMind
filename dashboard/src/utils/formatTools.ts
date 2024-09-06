export function formatTools(tools: string[]) {
    return tools.map(tool => ({
        type: 'function',
        function: {
            name: tool.toLowerCase().replace(/\s+/g, '_'),
            description: `Performs ${tool.toLowerCase()}`,
            parameters: {
                type: 'object',
                properties: {
                    input: {
                        type: 'string',
                        description: `${tool} input`
                    }
                },
                required: ['input']
            }
        }
    }));
}