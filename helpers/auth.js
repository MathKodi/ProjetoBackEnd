const jwt = require('jsonwebtoken')

module.exports = {
    veriftoken(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        if(!token){
            return res.status(401).json({msg:'Acesso negado'})
        }
        try{
            const secret = process.env.SECRET
            jwt.verify(token, secret)
    
            next()
    
        } catch(error){
            res.status(400).json({msg: 'token invalido'})
        }
    },
    verifAdmin(req, res, next) {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]
        if(!token){
            return res.status(401).json({msg:'Acesso negado'})
        }
        try{
            const secret = process.env.SECRET
            const decoded = jwt.verify(token, secret)
            if(!decoded.admin){
                res.status(400).json({msg: 'Acesso negado -> Não é um Admin'})
            } else{
                next()
            }
        } catch(error){
            res.status(400).json({msg: 'token invalido'})
        }
    }
}