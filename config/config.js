const sessionSecret = "mysitesessionsecret";


const emailUser=process.env.EMAIL_USER
const emailPassword=process.env.EMAIL_PASS

module.exports={
    sessionSecret,
    emailUser,
    emailPassword,
}
