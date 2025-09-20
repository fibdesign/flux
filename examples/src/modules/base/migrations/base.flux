migration 'user::create_users_table' => {
    dependencies => {
        'user::create_tokens_table'
    }
    up => {
        createTable 'users' => {
            id: 'int',
            name: 'string',
        },
    }
    down => {
        dropTable 'users',
    }
}