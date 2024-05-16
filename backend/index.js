const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const cookieParser = require('cookie-parser'); 
const { PORT, mongoDBUL } = require('./config'); 
const backofficeRoutes = require('./routes/backoffice');
const eventRoutes = require('./routes/events');
const placeRESTRoutes = require('./routes/places');  
const followRoutes = require('./routes/follow'); 
const authRoutes = require('./routes/auth'); 
const userRESTRoutes = require('./routes/userREST');
const ticketRoutes = require('./routes/tickets'); 

const app = express();

mongoose.connect(mongoDBUL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('App conectado ao banco de dados');
    app.listen(PORT, () => {
      console.log(`App está ouvindo na porta: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
  });

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.set('view engine', 'ejs');

// Rotas da API REST
app.use('/backoffice', backofficeRoutes);
app.use('/api/v1/events', eventRoutes);
app.use('/api/v1/places', placeRESTRoutes);  
app.use('/api/v1/follow', followRoutes); 
app.use('/auth', authRoutes); 
app.use('/api/v1/users', userRESTRoutes);
app.use('/api/v1/tickets', ticketRoutes); 

// Tratamento de erro para rota não encontrada
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Tratamento de erro
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.json({ error: err.message });
});

module.exports = app;
