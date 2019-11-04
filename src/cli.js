import { createProject } from './main';
import { parseArgumentsIntoOptions, promptForMissingOptions } from './utils';


/*  Get and parse args, prompt missing options and create project  */
export async function cli(args){

  let options = parseArgumentsIntoOptions(args)
  
  options = await promptForMissingOptions(options)
  
  await createProject(options);
}