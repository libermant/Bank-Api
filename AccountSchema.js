const mongoose=require("mongoose")
const accountSchema=new mongoose.Schema({
    
    id:{
        type:String,
        required:true,
        validate:value=>value.trim()
    },
    credit:{
        type:Number,
        min:0,
        default:0
    },
    cash:{
        type:Number,
        validate(value){
            if(value<-this.credit)throw "cash can't"
        }
    },
    isActive:{
        type:Boolean,
        default:true
    }
})

module.exports=mongoose.model("accountSchema",accountSchema)

