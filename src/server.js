// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const express = require('express');
const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');
const CRON = require('./utils/common/cron.js');

const app = express();


//***************************** MIDDLEWARES *************************************/
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ******************************************************************************/



app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
    CRON();
});
