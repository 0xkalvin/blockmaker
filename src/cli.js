import arg from 'arg';  /*  To parse process args */
import inquirer from 'inquirer';  /*  To prompt questions in a colorful way */
import { createProject } from './main';

/*  Parses passed arguments based on a config object  */
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '--language': String,
        '-l': '--language',
        '-g': '--git',
        '-y': '--yes',
        '-i': '--install',
      },
      {
        argv: rawArgs.slice(2),
      }
    );

    /*  Currently using the first arg as the template type.
        E.g.: fabric-backend javascript */
    return {
      skipPrompts:  args['--yes'] || false,
      git:          args['--git'] || false,
      template:     args._[0],
      runInstall:   args['--install'] || false,
      language:     args['--language'] || ''
    };
}

/*  If any essential info to create the project was not passed,
    questions will be prompted  */
async function promptForMissingOptions(options) {
    
    const defaultTemplate = 'Backend';
    const defaultLanguage = 'JavaScript';
    
    /*  CASE 1: -y or -yes passed   */
    if (options.skipPrompts) {
      return {
        ...options,
        template: options.template || defaultTemplate,
      };
    }
   
    const questions = [];
    
    
    /*  CASE 2: template not passed */
    if (!options.template) {
      questions.push({
        type: 'list',
        name: 'template',
        message: 'Please choose which project template to use',
        choices: ['Backend', 'Chaincode'],
        default: defaultTemplate,
      });
    }
   
    
    /*  CASE 3: Language not passed */
    if (!options.language) {
      questions.push({
        type: 'list',
        name: 'language',
        message: 'Please choose which language to use',
        choices: ['JavaScript', 'TypeScript'],
        default: defaultLanguage,
      });
    }
   
    /*  CASE 4: Not informed if it needs to create a git repo */
    if (!options.git) {
      questions.push({
        type: 'confirm',
        name: 'git',
        message: 'Initialize a git repository?',
        default: false,
      });
    }
   
    /* Actually print questions and get the anwsers */
    const answers = await inquirer.prompt(questions);
    
    return {
      ...options,
      template: options.template || answers.template,
      git:      options.git || answers.git,
      language: options.language || answers.language,
    };
   }
   
/*  So that's pretty much it: Get and parse args, prompt missing options and create project  */
export async function cli(args){

  let options = parseArgumentsIntoOptions(args)
  
  options = await promptForMissingOptions(options)
  
  await createProject(options);
}