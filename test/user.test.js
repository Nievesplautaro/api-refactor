const bcrypt = require('bcrypt')
const User = require('../models/User')
const { api, getUsers } = require('./helpers')
const moongose = require('mongoose')
const { server } = require('../server')

describe("A user", () => {
    //initialize values for test
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('rooterpass', 10)
        const user = new User({ username: 'rootUser', passwordHash })
        await user.save()
    })

    test('can be added succesfully', async () => {
        const usersAtStart = await getUsers()

        const newUser = {
            username: 'root_2',
            name: 'User 2',
            password: 'selenial'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await getUsers()

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test("can be listed as Json", async () => {
        await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test("can be deleted", async () => {
        const allUsers = await getUsers();
        const toDelete = allUsers[0];

        await api
            .delete(`/api/users/${toDelete.id}`)
            .expect(204)

        const actualUsers = await getUsers();

        expect(actualUsers).toHaveLength(allUsers.length - 1)
        expect(actualUsers).not.toContain(toDelete)
    })

    test("can be updated", async () => {
        const allUsers = await getUsers();
        const toUpdate = allUsers[0];

        const { id } = toUpdate;

        toUpdate.name = "UpdatedRoot";
        toUpdate.password = "Updatedpass";

        const response = await api
            .put(`/api/users/${toUpdate.id}`)
            .send(toUpdate)
            .expect(202)
            .expect('Content-Type', /application\/json/)

        //const actualUsers = await getUsers();
        //expect(actualUsers).toContain(toUpdate);
        // console.log(actualUsers)

        // console.log(typeof actualUsers)
        // console.log(typeof toUpdate)

        // expect(actualUsers).toContainEqual(toUpdate);
    })

    afterAll(() => {
        moongose.connection.close()
        server.close()
      })

})
