const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageType = {
    local: multer.diskStorage({
        destination: (req, file, callback) =>{
            callback(null, path.resolve(__dirname, '..', 'tmp', 'uploads'))
        },
        filename: (req, file, callback)=>{
            crypto.randomBytes(16, (erro, hash) => {
                if(erro) callback(erro)
                file.key = `${hash.toString('hex')}-${file.originalname}`

                callback(null, file.key)
            })
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: 'gimoveis',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            crypto.randomBytes(16, (erro, hash) => {
                if(erro) callback(erro)
                const fileName = `${hash.toString('hex')}-${file.originalname}`

                callback(null, fileName)
            })
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', 'tmp', 'uploads'),
    storage: storageType[process.env.STORAGE_TYPE],
    fileFilter: (req, file, callback)=>{
        const allowedMimes =[
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif',
            'application/pdf'
        ]

        if(allowedMimes.includes(file.mimetype)){
            callback(null, true)
        }else{
            callback(new Error('Invalid file type.'))
        }
    }
}