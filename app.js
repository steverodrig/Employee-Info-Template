const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const Employee = require("./lib/Employee");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

const teamMembers = []

function init() {
    return inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "What is the employees name?",
        },
        {
            type: "input",
            name: "id",
            message: "What is the employees id?",
        },
        {
            type: "input",
            name: "email",
            message: "What is the employees email address?",
        },
        {
            type: "list",
            name: "role",
            message: "Select employees role on the team.",
            choices: ["Manager", "Engineer", "Intern"],
        }
    ])
}

function manager() {
    return inquirer.prompt([

        {
            type: "input",
            name: "officenumber",
            message: "What is manager's office number?",
        },

    ])
}

function engineer() {
    return inquirer.prompt([

        {
            type: "input",
            name: "github",
            message: "What is engineer's Github user name?",
        }
    ])
}

function intern() {
    return inquirer.prompt([

        {
            type: "input",
            name: "school",
            message: "What school does the intern attend?",
        }
    ])
}

function run() {
    init()
        .then(function (data) {

            const pos = data.role;
            const emp = new Employee(data.name, data.id, data.email)

            switch (pos) {

                case "Manager":
                    return manager()
                        .then(function (data) {
                            var man = new Manager(emp.name, emp.id, emp.email, data.officenumber);
                            teamMembers.push(man);
                        });

                case "Engineer":
                    return engineer()
                        .then(function (data) {
                            var eng = new Engineer(emp.name, emp.id, emp.email, data.github);
                            teamMembers.push(eng);
                        });

                case "Intern":
                    return intern()
                        .then(function (data) {
                            var int = new Intern(emp.name, emp.id, emp.email, data.school);
                            teamMembers.push(int);
                        });
            }
        })

        .then(function cont() {
            return inquirer.prompt([
                {
                    type: "list",
                    name: "continue",
                    message: "Do you want to add more team members?",
                    choices: ["Yes", "No"],
                }
            ])
        })

        .then(function (data) {
            const cont = data.continue
            switch (cont) {
                case "Yes":
                    return run();

                case "No":
                    break;
            }
        })

        .then(function () {

            const team = render(teamMembers)

            return fs.writeFileSync(outputPath, team)
        })

        .then(function () {
            console.log("Successfully wrote to team.html");
        })
};
run();
