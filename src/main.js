import chalk from 'chalk';  /*  To colorized output */
import fs from 'fs';
import ncp from 'ncp';  /*  To copy files   */
import execa from 'execa';  /*  To execute external commands like git   */
import Listr from 'listr';
import path from 'path';
import { promisify } from 'util';
import { projectInstall } from 'pkg-install'; 

const access = promisify(fs.access);
const copy = promisify(ncp);

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

/*  Where the magic happens */
export async function createProject(options) {

    options = {
        ...options,
        targetDirectory: options.targetDirectory || process.cwd(),
    };

    /* Build the template project path based on user input  */
    const templateDir = path.resolve(
        __dirname,
        '../templates',
        options.template.toLowerCase(),
        options.language.toLowerCase()
    );
    
    options.templateDirectory = templateDir;
    
    /*  Tries to access template folder in read-only mode and
        checks if directory really exists. User can input a strange template name   */
    try {
        await access(templateDir, fs.constants.R_OK);
    } catch (err) {
        console.error('%s Invalid template name', chalk.red.bold('ERROR'));
        process.exit(1);
    }

    /*  To do list.  */
    const tasks = new Listr([
        {
            title: "Create files",
            task: () => copyTemplateFiles(options)
        },
        {
            title: "Initialize git",
            task: () => initGit(options),
            enabled: () => options.git
        },
        {
            title: "Install dependencies",
            task: () => projectInstall({
                cwd: options.targetDirectory
            }),
            enabled: () => options.runInstall
        }
    ])

    // console.log('Creating project ...');
    await tasks.run();

    console.log('%s Project ready', chalk.green.bold('DONE'));
    return true;
}