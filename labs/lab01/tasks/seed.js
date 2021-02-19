const dbConnection = require('../config/mongoConnection');
const movies = require('../data/movies');

const main = async () => {
    const db = await dbConnection();
    await db.dropDatabase();

    for (let i = 0; i < 120; i++) {
        let temp_movie = await movies.create(`${i+1}`, [{firstName: "Eric", lastName: "Altenburg"}, {firstName: "Kyle", lastName: "Altenburg"}], {director: "Donna Altenburg", yearReleased: (2000+i)}, "hello there", 6.9);
        for (let j = 0; j < Math.floor((Math.random() * 10) + 1); j++) {
            await movies.createComment(temp_movie._id + "", "Richard Altenburg", "This movie was good");
        }
    }

    console.log("Done seeding database :)");
    await db.serverConfig.close();
};

main().catch(console.log);