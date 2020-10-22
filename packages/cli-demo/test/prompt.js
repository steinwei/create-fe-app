const inquirer = require('inquirer')

const options = ['generator-ivweb']

inquirer.prompt([{
    type: 'list',
    name: 'desc',
    message: '您想要创建哪种类型的工程?',
    choices: options
}]).then((answer) => {
    console.log(answer)
});