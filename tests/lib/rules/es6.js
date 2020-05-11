/**
 * @fileoverview ecmascript import statement
 * @author sakop
 */
"use strict";

var rule = require("../../../lib/rules/es6"),
    RuleTester = require("eslint").RuleTester;

RuleTester.setDefaultConfig({
    // use eslint espree parser if omitted
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module"
    }
});

var ruleTester = new RuleTester();
const antdOptions = [
    {
        targetLibraries:[
            {
                name: 'antd',
                suggestionPrefix: 'antd/es/',
                componentNameFormat: 'kebabCase'
            }
        ]
    },
];

ruleTester.run("import-on-demand", rule, {

    valid: [
        {
            code: "import Input from 'lodash';",
            options:antdOptions, // valid since the option only cares about antd,not lodash
        },
    ],
    invalid: [
        {
            code: "import 'antd';",
            options:antdOptions,
            errors: [{
                message: "The library antd is not used in an import-on-demand way",
            }]
        },
        {
            code: "import Input from 'antd';",
            options:antdOptions,
            errors: [{
                message: "The library antd is not used in an import-on-demand way",
            }]
        },
        {
            code: "import {Input,Select as MySelect,DatePicker as DTP} from 'antd';",
            options: antdOptions,
            errors: [{
                message: "Possibly should be replaced with\n" +
                    "import Input from 'antd/es/input';\n" +
                    "import Select as MySelect from 'antd/es/select';\n" +
                    "import DatePicker as DTP from 'antd/es/date-picker';",
            }]
        }
    ]
});
