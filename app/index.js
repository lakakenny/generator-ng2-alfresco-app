const Generator = require('yeoman-generator');
const utils = require('./utils');
const alflogo = require('alfresco-logo');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }

  async initializing() {
    this.blueprints = await utils.getBluprints();
  }

  prompting() {
    this.log(alflogo(
      'ADF Angular app generator for Alfresco\n Version ' + this.rootGeneratorVersion() + '\n',
      {'left-pad': '     '}));

    return this.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Your project name',
        default: this.appname // Default to current folder name
      },
      {
        type: 'list',
        name: 'blueprint',
        message: 'Application blueprint',
        choices: this.blueprints.map(bp => {
          return bp.displayName
        })
      }])
      .then((answers) => {
        if (answers.name !== this.appname) {
          this.destinationRoot(this.destinationPath(answers.name));
        }

        this.targetBlueprint = this.blueprints.find((currentBlueprint)=>{
          if(currentBlueprint.displayName == answers.blueprint ){
            return true;
          }
        });

      });
  }

  writing() {
    this.fs.copy(
    this.targetBlueprint.path + '/**/*',
      this.destinationPath(),
      { globOptions: { dot: true } }
    );
  }

  install() {
    if (this.options.install) {
      this.npmInstall();
    }
  }
};
