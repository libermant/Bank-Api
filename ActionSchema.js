const mongoose=require("mongoose")
const accountSchema=require("./AccountSchema")
const actionSchema=new mongoose.Schema({
    date:{
        type:Date,
        default:new Date()
    },
    actionType:{
        type:String,
        lowercase:true,
        validate:{
            //validator:value=>value.includes("deposit")||value.includes("withdraw"),
            validator:value=>["deposit","withdraw"].includes(value),
            message:props=>`${props.value}is not equal to "deposit" or "withdraw"`
        }
    } ,
   
        account:{
            type:String,
            required:true,
            /*validate:async function findUserAdvanced(value){
                const account=await ActionSchema.select("id")
                account.includes(value)
            },*/
            unique:true
        },
        amount:{
           type:Number,
           required:true,
           min:1
        }
    
})
module.exports=mongoose.model("actionSchema",actionSchema)