'use strict';
const path = require('path');
const execa = require('execa');

module.exports = function (plop) {
	// starting prompt can be customized to display what you want
	plop.setWelcomeMessage('[CUSTOM]'.yellow + ' Welcome to The Guardian Module Generator.');

	// helpers are passed through handlebars syntax and made
	// available for use in the generator templates

	// adds 4 dashes around some text (yes es6/es2015 is supported)
	// plop.addHelper('dashAround', (text) => '---- ' + text + ' ----');

	// formats an array of options like you would write
	// it, if you were speaking (one, two, and three)
	plop.addHelper('wordJoin', function (words) {
		return words.join(', ').replace(/(:?.*),/, '$1, and');
	});

	plop.addHelper('absPath', function (p) {
		return path.resolve(plop.getPlopfilePath(), p);
    });
    
    plop.addHelper('cwd', (p) => process.cwd());

	// greet the user using a partial
	// plop.addPartial('salutation', '{{ greeting }}, my name is {{ properCase name }} and I am {{ age }}.');

	// load some additional helpers from a module installed using npm
	// plop.load('plop-pack-fancy-comments', {
	// 	prefix: '',
	// 	upperCaseHeaders: true,
	// 	commentStart: '',
	// 	commentEnd: ''
	// });

	// setGenerator creates a generator that can be run with "plop generatorName"
	plop.setGenerator('GuardianModuleGen', {
		description: 'The Guardian Module Generator',
		prompts: [
			{
				type: 'input',
				name: 'moduleName',
				message: 'Module Name (We\'ll add organisation prefix)',
				validate: function (value) {
					if ((/.+/).test(value)) { return true; }
					return 'Module name is required';
				}
			},
			{
				name: 'moduleDescription',
				message: 'What is your module description?',
				default: `My Guardian module`
			},
			{
				type: 'confirm',
				name: 'srcFoundations',
				message: 'Do you need Source Foundations?',
				default: 'N'
			}
		],
		actions: [
            'Thank you, I am now going to generate your module for you. Have a nice day.',

            function customAction(answers) {
                const fs = require('fs');
                const dir = plop.renderString('./{{dashCase moduleName}}', answers);

                if (!fs.existsSync(dir)){
                    fs.mkdirSync(dir);
                }
                                
				// move the current working directory to the plop file path
				// this allows this action to work even when the generator is
				// executed from inside a subdirectory
				console.info(`Just popping over to ${dir}, cheers.`)
                process.chdir(dir);
				
			},{
                type: 'add',
                path: '{{cwd}}/package.json',
                templateFile: 'templates/package.hbs'
			},
			{
                type: 'add',
                path: '{{cwd}}/index.tsx',
                templateFile: 'templates/index.hbs'
			},
			{
                type: 'add',
                path: '{{cwd}}/README.md',
                templateFile: 'templates/README.hbs'
			},
			{
                type: 'add',
                path: '{{cwd}}/.babelrc.js', // Note the prefix dot 
                templateFile: 'templates/babelrc.hbs'
			},
			{
                type: 'add',
                path: '{{cwd}}/rollup.config.js',
                templateFile: 'templates/rollup.config.hbs'
			},
			async () => {
				console.log('I am just going to run Yarn on your module for you')
				await execa(`yarn`);

				console.log('Just installing and running prettier 🎨')
				await execa(`yarn add prettier`);
			}
		]
	});


	
};