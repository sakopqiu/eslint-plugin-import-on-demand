/**
 * @fileoverview ecmascript import statement
 * @author sakop
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
const snakeCase = require('lodash/snakeCase');
const camelCase = require('lodash/camelCase');
const kebabCase = require('lodash/kebabCase');
const capitalize = require('lodash/capitalize');

module.exports = {
    meta: {
        docs: {
            description: "ecmascript import statement",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,  // or "code" or "whitespace"

    },

    create: function(context) {

        // variables should be defined here

        //----------------------------------------------------------------------
        // Helpers
        //----------------------------------------------------------------------

        // any helper functions should go here or else delete this section

        //----------------------------------------------------------------------
        // Public
        //----------------------------------------------------------------------

        // detects whether default import exists
        // e.g. **import antd from 'antd'**
        function hasDefaultImport(node){
            return node.specifiers
                .find(spec=> spec.type === 'ImportDefaultSpecifier');
        }

        // extracts all names in an import statement
        // e.g. ** import {a,c as d} from 'antd' returns [{from:'a',to:'a'}, {from:'c',to:'d'}]
        function extractImports(node){
            return node.specifiers.map(spec=> {
                return {
                    from: spec.imported.name,
                    to: spec.local.name,
                }
            });
        }

        function getComponentName(origComponentName, format){
            if(format === 'snakeCase'){
                return snakeCase(origComponentName);
            }else if(format === 'kebabCase'){
                return kebabCase(origComponentName);
            } else if(format === 'camelCase'){
                return camelCase(origComponentName);
            }else if(format === 'pascalCase'){
                return capitalize(camelCase(origComponentName));
            }
            return origComponentName;
        }

        const targetLibraries = context.options[0].targetLibraries;
        return {
            ImportDeclaration: function(node){
                for(const library of targetLibraries){
                    const importName = node.source.value;// e.g antd
                    if(library.name === importName){
                        // import 'antd';
                        if(node.specifiers.length === 0){
                            context.report(node,
                                `The library ${importName} is not used in an import-on-demand way`);
                            break;
                        }
                        // import A from 'antd';
                        else if(hasDefaultImport(node)){
                            context.report(node,
                                `The library ${importName} is not used in an import-on-demand way`);
                            break;
                        }
                        // import {A} from 'antd';
                        else{
                            const pairs = extractImports(node);
                            let suggestionPrefix = library.suggestionPrefix;
                            if(suggestionPrefix[suggestionPrefix.length - 1] !== '/'){
                                suggestionPrefix = suggestionPrefix + '/';
                            }
                            const suggestionStrs = pairs.map(pair=>{
                                const pairInfo = pair.from === pair.to ? pair.from : `${pair.from} as ${pair.to}`;
                                const componentName = getComponentName(pair.from, library.componentNameFormat);
                                return `import ${pairInfo} from '${suggestionPrefix}${componentName}';`;
                            });
                            const suggestionStr = suggestionStrs.join('\n');
                            const resultStr = 'Possibly should be replaced with\n'+ suggestionStr;
                            context.report(node, resultStr);
                            break;
                        }
                    }
                }
            }

        };
    }
};
