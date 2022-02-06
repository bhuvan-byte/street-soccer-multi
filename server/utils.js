const { customAlphabet } = require('nanoid');
const alphabet = '0123456789abcdefghjkmnopqrstuvwxyz';
const nanoid = (length)=>customAlphabet(alphabet,length)();
const {UserModel,VisitModel} = require('./User.js');
async function logiphelper(req,res,uid){
    // fs.writeFile("./logs/log.txt",JSON.stringify(req.headers,null,2),{flag:'w+'},err=>{});
    try{
        let client_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress ;
        let useragent = req.headers['user-agent'] ?? "";
        if(/bot|crawl|slurp|spider|mediapartners/.test(useragent.toLowerCase())){
            uid = "BOTS";
        }
        let referer = req.headers["referer"];
        let user=null;
        if(uid){
            user = await UserModel.findOne({uid:uid}).exec();
            if(!user) user = UserModel({uid:uid});
        }else{
            user = await UserModel.findOne({uniqueIps:client_ip}).exec();
            if(user){
               uid = user.uid; 
            }else{
                uid = nanoid(6);   
                user = UserModel({uid:uid});
            }
            res.cookie(`uid`,`${uid}`,{secure: true,sameSite: 'lax',});
        }
        // console.log(`uid=${uid}`);
        req.uid = uid;
        user.recentIp = client_ip;
        if(user.uniqueIps.indexOf(client_ip) === -1) user.uniqueIps.push(client_ip);
        let dateIST = new Date(new Date().getTime() + (new Date().getTimezoneOffset() + 330)*60000);
        // dateIST = dateIST.toString();
        let visit = {ip:client_ip,route:req.originalUrl,referer:referer,dateTime:dateIST};
        // console.log("first",user.visits);
        user.visits[useragent] = user.visits[useragent] ?? [];
        user.visits[useragent].push(visit);
        // console.log("second",user.visits);
        // very important
        user.markModified('visits');
        await user.save();
    }catch(err){
        console.log("Error mongodb UID",err);
    }
}
async function logip(req,res){
    let uid = req.cookies["uid"];
    // await(logiphelper(req,res,uid));
    if(uid) {logiphelper(req,res,uid);}
    else {await logiphelper(req,res,uid);}
}
module.exports = {
    nanoid,
    logip
}
