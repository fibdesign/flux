migration 'user::create_tokens_table' => {
    up => {
        createTable 'tokens' => {
            id: 'int|primary',
            name: 'string',
            is_default: 'bool|default:true',
            created_at: 'timestamp|default:now'
        },
        createTable 'tokens_translations' => {
            id: 'int',
            name: 'string',
        },
    }
    down => {
        dropTable 'tokens',
    }
}