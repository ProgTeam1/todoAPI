const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
var serviceAccount = require("./fire-api-6ba02-firebase-adminsdk-fd7kl-8c80dda332.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fire-api-6ba02.firebaseio.com"
});
const db = admin.firestore();

app.get('/hello-world', (req, res) => {
    return res.status(200).send('Hello World!');
});

app.post('/api/create', (req, res) => {
    (async () => {
        try {
            await db.collection('todos').doc('/' + req.body.id + '/')
                .create({ todo: req.body.todo });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


app.get('/api/read/:todo_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('todos').doc(req.params.todo_id);
            let todo = await document.get();
            let response = todo.data();
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


app.get('/api/read', (req, res) => {
    (async () => {
        try {
            let query = db.collection('todos');
            let response = [];
            await query.get().then(querySnapshot => {
                let docs = querySnapshot.docs;
                // eslint-disable-next-line promise/always-return
                for (let doc of docs) {
                    const selectedtodo = {
                        id: doc.id,
                        todo: doc.data().todo
                    };
                    response.push(selectedtodo);
                }
            });
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


app.put('/api/update/:todo_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('todos').doc(req.params.todo_id);
            await document.update({
                todo: req.body.todo
            });
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});


app.delete('/api/delete/:todo_id', (req, res) => {
    (async () => {
        try {
            const document = db.collection('todos').doc(req.params.todo_id);
            await document.delete();
            return res.status(200).send();
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);
