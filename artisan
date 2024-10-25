const fs = require('fs');
const path = require('path');

// Function to pluralize a string
function pluralize(str) {
    const lastChar = str.slice(-1).toLowerCase();
    const lastTwoChars = str.slice(-2).toLowerCase();

    if (lastChar === 'y' && !['a', 'e', 'i', 'o', 'u'].includes(str.slice(-2, -1).toLowerCase())) {
        return str.slice(0, -1) + 'ies';
    } else if (['s', 'x', 'z', 'ch', 'sh'].includes(lastTwoChars) || ['s', 'x', 'z'].includes(lastChar)) {
        return str + 'es';
    } else if (lastChar !== 's') {
        return str + 's';
    }
    return str;
}

// Function to lowercase and pluralize the last word in a string
function lowercasePluralize(str) {
    const words = str.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(' ');
    words[words.length - 1] = pluralize(words[words.length - 1]);
    return words.join(' ');
}

// Function to create a model from a stub
function createModel(className) {
    const modelStubPath = path.join(__dirname, 'stubs', 'model.stub');
    const modelPath = path.join(__dirname, 'libs', 'Model', `${className}.js`);

    fs.readFile(modelStubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading model stub: ${err.message}`);
            return;
        }

        const lowerCasePluralizedClassName = lowercasePluralize(className);
        const output = data
            .replace(/{{ classname }}/g, className)
            .replace(/{{ lowercasePluralizedClassname }}/g, lowerCasePluralizedClassName);

        fs.writeFile(modelPath, output, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing model file: ${err.message}`);
            } else {
                console.log(`Model ${className} created successfully at libs/Model/${className}.js`);
            }
        });
    });
}

// Function to create a migration from a stub
function makeMigration(tableName) {
    const migrationDir = path.join(__dirname, 'database', 'migrations');
    const stubPath = path.join(__dirname, 'stubs', 'migration.stub');

    // Ensure the migration directory exists
    if (!fs.existsSync(migrationDir)) {
        fs.mkdirSync(migrationDir, { recursive: true });
    }

    const migrationFileName = `create_${tableName}.js`;
    const migrationFilePath = path.join(migrationDir, migrationFileName);

    fs.readFile(stubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading migration stub: ${err.message}`);
            return;
        }

        // Replace the placeholder in the stub with the actual table name
        const migrationContent = data.replace(/{{ tableName }}/g, tableName);

        fs.writeFile(migrationFilePath, migrationContent, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing migration file: ${err.message}`);
            } else {
                console.log(`Migration file created at ${migrationFilePath}`);
            }
        });
    });
}

// Function to create a controller from a stub
function createController(controllerName, specificArea) {
    const controllerStubPath = path.join(__dirname, 'stubs', 'controller.stub');
    const controllerDir = path.join(__dirname, 'app', specificArea, `Controller`);
    const controllerPath = path.join(controllerDir, `${controllerName}Controller.js`);

    // Ensure the specific area directory exists
    if (!fs.existsSync(controllerDir)) {
        fs.mkdirSync(controllerDir, { recursive: true });
    }

    fs.readFile(controllerStubPath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading controller stub: ${err.message}`);
            return;
        }

        const output = data
            .replace(/{{ ControllerName }}/g, controllerName)
            .replace(/{{ SpecificArea }}/g, specificArea);

        fs.writeFile(controllerPath, output, 'utf8', (err) => {
            if (err) {
                console.error(`Error writing controller file: ${err.message}`);
            } else {
                console.log(`Controller ${controllerName} created successfully at ${controllerPath}`);
            }
        });
    });
}

function createConfig(name) {
    const stubPath = path.join(__dirname, 'stubs', 'constant.stub');
    const destinationPath = path.join(__dirname, 'config', `${name}.js`);

    fs.mkdir(path.dirname(destinationPath), { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating directory: ${err.message}`);
            return;
        }

        fs.copyFile(stubPath, destinationPath, (err) => {
            if (err) {
                console.error(`Error creating config file: ${err.message}`);
            } else {
                console.log(`Config file created at config/${name}.js`);
            }
        });
    });
}

function makeView(folder, specific) {
    const viewsBasePath = path.join(__dirname, 'server', 'View', specific, folder);
    const viewPath = path.join(viewsBasePath, 'index.ejs');

    // Create the directory if it doesn't exist
    fs.mkdirSync(viewsBasePath, { recursive: true });

    // Read the stub file
    const stubFilePath = path.join(__dirname, 'stubs', 'view.stub');
    fs.readFile(stubFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the stub file:', err);
            return;
        }

        // Write the content to the new view file
        fs.writeFile(viewPath, data, (err) => {
            if (err) {
                console.error('Error creating the view file:', err);
            } else {
                console.log(`View file created at ${viewPath}`);
            }
        });
    });
}

const args = process.argv.slice(2);
if (args.length < 3) {
    console.error("Please provide a command (make model, make migration, or make controller) and a name.");
    process.exit(1);
}

const command = args[0];
const subCommand = args[1];
const name = args[2];
const specificArea = args[3];

if (command === 'make' && subCommand === 'model') {
    createModel(name);
} else if (command === 'make' && subCommand === 'migration') {
    makeMigration(name);
} else if (command === 'make' && subCommand === 'controller' && specificArea) {
    createController(name, specificArea);
} else if (command === 'make' && subCommand === 'config') {
    createConfig(name);
} else if (command === 'make' && subCommand === 'view') {
    makeView(name, specificArea);
} else {
    console.error("Invalid command. Use 'make model <ClassName>', 'make migration <tableName>', or 'make controller <ControllerName> <SpecificArea>'.");
    process.exit(1);
}
