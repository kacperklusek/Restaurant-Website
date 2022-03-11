const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser")
const [Dishes, Users] = require("./config");
const { auth } = require('firebase-admin');
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json())

async function authorize(jwt, role) {
    auth()
        .verifyIdToken(jwt)
        .then(async (decodedToken) => {
            const uid = decodedToken.uid;
            const roles = await Users.doc(id).get().roles;
            console.log(roles[role])
            return roles[role];
        })
        .catch((error) => {
            console.log("false")
            return false;
        });
}


app.get("/dishes", async (req, res) => {

    const snapshot = await Dishes.get();
    const list = snapshot.docs.map((doc) => {
        // console.log(doc.data());
        const temp = {id:doc.id, ...doc.data()}
        // console.log({id: temp.id, ...temp.data, rating:rating})
        return {id: temp.id, ...temp.data};
    });
    console.log("loaded Dish list");
    res.status(200).send(list);
})

app.post('/dishes', async (req, res) => {
    const data = req.body;
    await Dishes.add({ data });
    console.log("added Dish")
    res.status(200).send(data);
});

// update dish
app.post("/dishes/:id", async (req, res) => {

    const jwt = req.headers["x-jwt-key"];
    if(!!jwt) {
        const uid = await authorize(jwt, "Manager");
    } else {
        res.status(400).send("No x-jwt-key  Header present");
        return
    }

    const id = req.body.id;
    delete req.body.id;
    const data = {data: req.body};
    await Dishes.doc(id).set(data);
    console.log("updated reviews")
    res.status(200).send(req.body);
})

app.delete("/dishes/:id", async (req, res) => {
    // autentykacja
    const id = req.params.id;
    await Dishes.doc(id).delete();
    console.log("deleted dish  id:" + id);
    res.status(200).send(req.body);
});

/// USERS///////////////////////////////////////////////////

app.get("/users", async (req, res) => {
    const snapshot = await Users.get();
    const list = snapshot.docs.map(
        (doc) => {
            return {...doc.data()}
        });

    console.log("loaded Users list");
    res.status(200).send(list);
})

//add user
app.post('/users', async (req, res) => {
    const data = req.body;
    await Users.doc(data.id).set(data);
    console.log("added User")
    res.status(200).send(data);
});

//updating user
app.post("/users/:id", async (req, res) => {
    const id = req.body.id;
    const data = req.body
    await Users.doc(id).set(data, {merge: true});
    console.log("updated roles")
    res.status(200).send(req.body);
})

app.delete("/users/:id", async (req, res) => {
    const id = req.params.id;
    await Dishes.doc(id).delete();
    console.log("deleted user with id:" + id);
    res.status(200).send(req.body);
});

app.get("/users/:id", async (req, res) => {
    const id = req.params.id;

    const user = await Users.doc(id).get();

    const data = {
        roles: user.data().roles,
        boughtDishes: user.data().boughtDishes,
        banned: user.data().banned
    }

    console.log("loaded User data");
    res.status(200).send(data);

})

app.listen(8000, () => {
    console.log("server running on http://localhost:8000");
});