import Generator from "yeoman-generator";
import yosay from "yosay";
import chalk from "chalk";
import * as shift from "change-case";
import shell from "shelljs";
import path from "path";

/*
 * My Yeoman generator.
 * Influenced from: https://github.com/alexfedoseev/generator-react-sandbox-server
 */
export default class MyGenerator extends Generator {
    constructor(...args) {
        super(...args);

        // Various output statements.
        this.say = {
            arr: "----> ",
            tab: "    ",
            info(msg) {
                console.log("\n\n" + chalk.yellow(this.arr + msg) + "\n");
            },
            status(item, status) {
                console.log(`${this.tab}${chalk.green(status)} ${item}`);
            },
            cmd(cmd) {
                console.log("\n" + chalk.green("$ " + cmd));
            },
            done(status, msg) {
                console.log(`\n\n${this.tab}${chalk.green(status)} $ ${msg}\n`);
            }
        };

        // Copy from template src to destination.
        this.copy = (src, dest, show) => {
            this.fs.copy(this.templatePath(src), this.destinationPath(dest));
            this.say.status(show || dest, "✓ ");
        };

        // Render a template file to a real file.
        this.render = (src, dest, params = {}) => {
            this.fs.copyTpl(
                this.templatePath(src),
                this.destinationPath(dest),
                params
            );
            this.say.status(dest, "✓ ");
        };

        // Execute a shell command.
        this.shellExec = cmd => {
            this.say.cmd(cmd);
            shell.exec(cmd);
            this.say.info("Completed");
        };

        // Operation complete.
        this.allDone = () => {
            this.say.done("All done!", `cd ${this.appName}/`);
        };
    }

    // Called when prompting the user.
    prompting() {
        this.log(yosay(`Welcome to ${chalk.white(this.rootGeneratorName + " generator")}`));
        const prompts = [
            {
                type: "input",
                name: "appName",
                message: "Enter appName:",
                default: "myFuncApp"
            },
            {
                type: "input",
                name: "appDesc",
                message: "Enter description:",
                default: ""
            }
        ];

        /*
         *  Ask Yeoman to prompt the user.
         *  Return a promise so the run loop waits until
         *  we've finished.
         */
        return this.prompt(prompts).then(props => {
            // Props are the return prompt values.
            this.appName = shift.paramCase(props.appName);
            this.namespace = shift.camelCase(props.appName);
            this.appDesc = props.appDesc;
        });
    }

    writing() {
        this.say.info("Setting up project...");
        shell.mkdir(this.appName);
        this.destinationRoot(this.appName);
        this.sourceRoot(path.join(__dirname, "/templates/func"));
        this.render("_docker-compose.yaml", "docker-compose.yaml", { appName: this.appName });
		this.render("_gulpfile.babel.js", "gulpfile.babel.js", { appName: this.appName });
        this.render("_package.json", "package.json", {
            appName: this.appName,
            appDesc: this.appDesc
        });
        this.copy(".babelrc", ".babelrc", false);
        this.copy(".gitignore", ".gitignore", false);
        this.copy("Dockerfile.dev", "Dockerfile.dev", false);
        this.copy("Dockerfile.prod", "Dockerfile.prod", false);
        this.copy("host.json", "host.json", false);
        this.copy("local.settings.json", "local.settings.json.sample", false);
        this.copy("local.settings.json", "local.settings.json", false);
        this.copy("Main.csproj", "Main.csproj", false);
        this.copy(".vscode/", ".vscode/", false);
        shell.mkdir(this.appName + "/Functions");
        this.render("Functions/_Echo.cs", "Functions/Echo.cs", { namespace: this.namespace });
        this.say.info("Done :)");
    }

    install() {
        // Install NPM packages.
        this.npmInstall();
    }

    end() {
        this.allDone();
    }
}
