const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');
// const User = require('./models/user');
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
const db = async () => {
    const uri =
        "mongodb+srv://saurabhkumar:rVKACHYbuzYy7VMs@cluster0.n4zogin.mongodb.net/Mylodgeapp?retryWrites=true&w=majority";
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect(uri);
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "connection error:"));
        db.once("open", () => {
            console.log("Connected to MongoDB...");
        });
    } catch (error) {
        console.log(error);
    }
}
db();

// const students = [
//     // { name: 'Nitish', mobile: '8809323306' },
//     // { name: 'Nitish', mobile: '9570873648' },
//     // { name: 'Gaurav', mobile: '8294089962' },
//     // { name: 'Pritesh', mobile: '8051379840' },
//     // { name: 'Naveen', mobile: '9123151644' },
//     // { name: 'Brajnandan', mobile: '6299882234' },
//     // { name: 'Rahir premi', mobile: '9263197204' },
//     // { name: 'Lokesh', mobile: '8292511978' },
//     // { name: 'Pintu', mobile: '8084521990' },
//     // { name: 'Amarjeet', mobile: '6202070957' },
//     { name: 'Saurabh', mobile: '6203661769' }
//   ];
  
//   async function seed() {
//     try {
//       for (const student of students) {
//         const password = Math.random().toString(36).slice(-5);
//         const hashedPassword = await bcrypt.hash(password, 10);
//         await User.create({
//           name: student.name,
//           mobile: student.mobile,
//           password: hashedPassword,
//         });
//         console.log(`User ${student.name} (${student.mobile}) created with password: ${password}`);
//       }
//       console.log('Seeding completed.');
//       process.exit();
//     } catch (error) {
//       console.error('Error seeding data:', error);
//       process.exit(1);
//     }
//   }
  
//   seed();

const authRoutes = require('./controllers/auth');
app.use('/auth', authRoutes);
const profileRoutes = require('./controllers/profile');
app.use('/profile', profileRoutes);


app.get("/", (req,res) => {
    res.send("server is working");
});

const port = 3000;
app.listen(port, () => {
    console.log(`app is running at port number ${port}`);
});
