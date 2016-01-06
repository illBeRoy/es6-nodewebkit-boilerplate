'use strict';

import { Router } from './viewmodel/router/router.js';
import { View } from './viewmodel/view.js';

var router = new Router();

setTimeout(() => router.moveTo(new View('.main-view')), 3000);
