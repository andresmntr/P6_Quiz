const path = require('path');

// Load ORM
const Sequelize = require('sequelize');


// To use SQLite data base:
//    DATABASE_URL = sqlite:quiz.sqlite
// To use  Heroku Postgres data base:
//    DATABASE_URL = postgres://user:passwd@host:port/database

const url = process.env.DATABASE_URL || "sqlite:quiz.sqlite";

const sequelize = new Sequelize(url);

// Import the definition of the Quiz Table from quiz.js
sequelize.import(path.join(__dirname, 'quiz'));

// Import the definition of the Tips Table from tip.js
sequelize.import(path.join(__dirname,'tip'));

// Import the definition of the Users Table from user.js
sequelize.import(path.join(__dirname,'user'));

// Session
sequelize.import(path.join(__dirname,'session'));


// Relation between models

const {quiz, tip, user} = sequelize.models;

tip.belongsTo(quiz);
quiz.hasMany(tip);

// Relation 1-to-N between User and Quiz:
user.hasMany(quiz, {foreignKey: 'authorId'});
quiz.belongsTo(user, {as: 'author', foreignKey: 'authorId'});

user.hasMany(tip, {foreignKey: 'authorId'});
quiz.belongsTo(user, {as: 'author', foreignKey: 'authorId'});

sequelize.sync()
.then(() => sequelize.models.quiz.count())
.then(count => {
	if(!count) {
		return sequelize.models.quiz.bulkCreate([
			{id: 0 , question: "Capital de Italia", answer: "Roma" },
			{id: 1 , question: "Capital de Francia", answer: "Paris"},
            {id: 2 , question: "Capital de España", answer: "Madrid"},
            {id: 3 , question: "Capital de Portugal", answer: "Lisboa"},
            {id: 4 , question: "Donde es que estan las ladies", answer: "las babies"}
		]);
	}
})
.catch(error => {
	console.log(error);
});


// Create tables
sequelize.sync()
.then(() => console.log('Data Bases created successfully'))
.catch(error => {
    console.log("Error creating the data base tables:", error);
    process.exit(1);
});



module.exports = sequelize;
