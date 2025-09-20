migration 'user::create_tokens_table' => {
    up => {
        createTable 'tokens' => {
            id: 'int',
            name: 'string',
        },
    }
    down => {
        dropTable 'tokens',
    }
}