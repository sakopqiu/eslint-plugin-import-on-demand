# eslint-plugin-import-on-demand

Detect any import or require that is not imported on demand.

### Bad cases
```
import { isNil } from 'lodash';
import { Input} from 'antd'; 
```

### Good cases
```
import isNil from 'lodash/isNil';
import Input from 'antd/es/input'; 
```

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-import-on-demand`:

```
$ npm install eslint-plugin-import-on-demand --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-import-on-demand` globally.

## Usage

Add `import-on-demand` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "import-on-demand"
    ]
}
```

Only ES6 is supported for the time being.

If you want all components from `lodash` and `antd` to be imported on demand,
you may specify.

```json
{
    "rules": {
        "import-on-demand/es6": [ 
          "error",
          {
            "targetLibraries":[
              {
                "name": "lodash",
                "suggestionPrefix": "lodash/"
              },
              {
                "name": "antd", 
                "suggestionPrefix": "antd/es/",
                "componentNameFormat":"kebabCase"
              }
            ]
          }
        ]   
    }
}
```

## Options
`name:`
The library to be tested against.

`suggestionPrefix:`
This option can be explained better by an exmaple, once eslint sees

```
import {pick} from 'lodash';
import {DatePicker as DP, Input} from 'antd';
```

the warning message in eslint would suggest

```
// suggestPrefix is 'lodash/'
import pick from 'lodash/pick'; 

// suggestionPrefix is 'antd/es/'
// componentNameFormat:kebabCase turns DatePicker into date-picker
import DatePicker as DP from 'antd/es/date-picker';

// suggestionPrefix is 'antd/es/'
// componentNameFormat:kebab turns Input into input
import Input from 'antd/es/input'; 
```

`componentNameFormat:`
The possible values can be `kebabCase, pascalCase, snakeCase, camelCase`,
if not passed, the componentName will be left as is.
```
//kebabCase examples
import {DatePicker} from 'antd' => import DatePicker from 'antd/es/date-picker';

// camelCase examples
import { SomeComp } from 'SomeLibrary' => import SomeComp from 'SomeLibrary/someComp'
```


