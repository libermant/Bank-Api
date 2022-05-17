const express = require("express")
require("dotenv").config()
const app = express()
app.use(express.json())
const PORT = 5000
const mongoose = require("mongoose")
const AccountSchema = require("./AccountSchema")
const ActionSchema = require("./ActionSchema")
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.njlna.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
mongoose.connect(uri)




//מחזיר את כל המשתמשים****
async function findUsers() {
    const user = await AccountSchema.find()
    console.log(user);
    return user
}
//findUsers()
app.get('/accounts', async (req, res) => {
    res.send(await findUsers())
})
app.get('/test', (req, res) => {
    res.send('Hello test')
})

//יצירת משתמש חדש****
async function creatUser(id, credit, cash, isActive) {
    const user = new AccountSchema({
        id: id,
        credit: credit,
        cash: cash,
        isActive: isActive
    })
    await user.save()
    console.log(user)
}
//creatUser(77,50,53,true)
app.post('/accounts', (req, res) => {
    var account = req.body
    console.log(account.id);
    creatUser(account.id, account.credit, account.cash, account.isActive)
    res.send("succes")
}
)

//יצירת רישומי פעולות
async function creatUser(date, actionType, account, amount) {
    const user = new ActionSchema({
        date: date,
        actionType: actionType,
        account: account,
        amount: amount
    })
    await user.save()
    console.log(user)
}
//creatUser("","deposit",209327626,123456)
app.post('/accounts', (req, res) => {
    var account = req.body
    console.log(account.id);
    creatUser(account.date, account.actionType, account.account, account.amount)
    res.send("succes")
}
)

//מציאת משתמש לפי תז(id)****
async function findUserById(req) {
    const userById = await AccountSchema.find(req)
    console.log(userById)

}
//findUserById(75)
app.get('/accounts/:id', (req, res) => {
    res.send(findUserById(req.params))
})


//מחזיר את הפעולות שבוצעו בחשבון****
async function findActions() {
    const actions = await ActionSchema.find({}).select("actionType")
    console.log(actions);
}
//findActions()
app.get('/actions', (req, res) => {
    res.send(findActions())
})

//מעדכן מסגרת אשראי לפי תז(נעשה בטעות ע"י בקשת גט )
async function findAndUpdateCredit(req) {
    const y = await AccountSchema.find(req.params)
    console.log(y[0].credit);
    await AccountSchema.findOneAndUpdate({ credit: y[0].credit }, { credit: parseInt(req.query.credit) })
    console.log(req.query.credit);
}
//findAndUpdateCredit(req)
app.get('/accounts/:id/credit', (req, res, next) => {
    findAndUpdateCredit(req)
    next()
},
    (req, res) => {
        res.send("error")
    }
)
//פונקציה לעידכון שדות
async function findAndUpdate(req, schema, reqParams) {
    const y = await schema.find(req.params)    
    console.log(req.params);
    //console.log(y);
    const body = req.body
    await schema.findOneAndUpdate({ [reqParams]: y[0][reqParams] }, { [reqParams]: body[reqParams] })
}

//ניסיון לעשות את כל ארבעת הנתיבים האחרונים יחד
/*app.post('/accounts/:id/:raut', (req, res) => {
    const schema=req.params.raut=== "credit"||"isActive"? AccountSchema : "deposit"||"withdraw" ? ActionSchema : null
    const reqParam=req.params.raut==="credit"?"credit":"isActive"?"isActive":"deposit"||"withdraw"?"amount ":null
    findAndUpdate(req, schema,reqParam)
    res.send("succses")
})*/




//findAndUpdate(req)
//נתיב אחד שמאחד 2 ראוטים
app.post('/accounts/:id/:raut', (req, res) => {
    const reqParam=req.params.raut==="credit"?"credit":"isActive"?"isActive":null   
    console.log(reqParam)  
    res.send(findAndUpdate(req, AccountSchema, reqParam))
})


//    שתי הנתיבים האחרונים אל יש בעיה אם כותבים בנתיב אי די זה משתבש עם הנתיב הקודם ואם משנים פה את הנתיב הוא זורק שגיאה שכבר יש שימוש בפורט 50000
/*app.post('/accounts/:account/deposit', (req, res) => {
    findAndUpdate(req, ActionSchema, "amount")
    res.send("secces")
})

app.post('/accounts/:account/withdraw', (req, res) => {
    findAndUpdate(req, ActionSchema, "amount")
    res.send(req.params)
})

//ניסיון לעשות את 2 הנתיבים האחרונים יחד ללא הצלחה אין לסכמה הזאת אי די
/*app.post('/accounts/:id/:raut', (req, res) => {
    //const reqParam=req.params.raut==="deposit"||"withdraw" ? ActionSchema : null
    
    findAndUpdate(req, ActionSchema,"amount")
    res.send("secces")
})*/










console.log(mongoose.connection.readyState);
app.listen(process.env.PORT, () => console.log("succes"))


