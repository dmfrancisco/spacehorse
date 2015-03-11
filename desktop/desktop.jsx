/*jshint esnext:true, browserify:true */
'use strict';

import React from 'react';
import {Router} from '../app.jsx';

let startUrl = "/boards/3551dbaf6a52a/";
React.render(<Router startUrl={startUrl} />, document.body);
