const sm = require('windows-shortcut-maker')
var path = require('path')
var inquirer = require('inquirer');

if(process.platform === "win32"){
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'createShortcut',
                message: 'Do you want to create a desktop shortcut?',
                choices: [
                    'yes',
                    'no',
                    new inquirer.Separator(),
                ]
            }
        ])
        .then(answers => {
            const icoPath = path.join(__dirname, './../client/public/faviconDesktop.ico')
            console.log(icoPath)
           if(answers.createShortcut === 'yes'){
               const options = {
                   'filepath': 'C:\\Windows\\System32\\cmd.exe',
                   lnkName: "LobsterLord",
                   lnkArgs: '/k lobster-lord',
                   lnkIco: icoPath
               }
               try {
                   sm.makeSync(options)
               } catch (error) {
                   console.log(error)
               }
           }
        });
}
