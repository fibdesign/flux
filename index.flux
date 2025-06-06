string name = 'bluebird' as const;
int age = 24;
bool isActive = false;
string title = `my age is {{age}} and my name is {{name}}`;


emit 'debug test';
emit name;
emit age;
emit title;