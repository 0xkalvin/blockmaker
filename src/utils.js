import arg from 'arg';  /*  To parse process args */
import inquirer from 'inquirer';  /*  To prompt questions in a colorful way */
import execa from 'execa';  /*  To execute external commands like git   */
import ncp from 'ncp';  /*  To copy files   */
import { promisify } from 'util';

const copy = promisify(ncp);



/*  Console help menu */
function help() {

  const menu =  `
 blockmaker [template] <options>
  
  template              Which kind of project you want to build. [chaincode, backend]
  -l, --language        Which language to use in your project. Currently supporting only Javascript. 
  -h, --help            Print this help text and exit.
  -g, --git             Initializes a git repository.
  -y, --yes             Skip options, goes with default settings.
  -i, --install         Install project dependencies.
  `
  console.log(menu);

  process.exit(1);

}


/*  Parses passed arguments based on a config object  */
function parseArgumentsIntoOptions(rawArgs) {
    const args = arg(
      {
        '--git': Boolean,
        '--yes': Boolean,
        '--install': Boolean,
        '--language': String,
        '--help': Boolean,
        '-h': '--help',
        '-l': '--language',
        '-g': '--git',
        '-y': '--yes',
        '-i': '--install',
      },
      {
        argv: rawArgs.slice(2),
      }
    );
    
    if(args["--help"])  return help()

    /*  Currently using the first arg as the template type.
        E.g.: fabric-backend javascript */
    return {
      skipPrompts:  args['--yes'] || false,
      git:          args['--git'] || false,
      template:     args._[0],
      runInstall:   args['--install'] || false,
      language:     args['--language'] || '',
      help:         args['--help'] || false
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


/*  Copies recursively the template project to a target directory   */
async function copyTemplateFiles(options) {
    
  /*  Does not overwrite files if they already exist  */
  return copy(options.templateDirectory, options.targetDirectory, {
      clobber: false,
  });
}


/* Initializes git repo */
async function initGit(options){

  const result = await execa('git', ['init'], {
      cwd: options.targetDirectory
  });

  if(result.failed){
      return Promise.reject(new Error('Unable to initialize git'));
  }

  return;
}



export {
    parseArgumentsIntoOptions,
    promptForMissingOptions,
    copyTemplateFiles,
    initGit
}