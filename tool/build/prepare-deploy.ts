#!./node_modules/.bin/ts-node

import path from 'path';
import shelljs from 'shelljs';

shelljs.cp('package.json', path.join('dist', 'package.json'));
