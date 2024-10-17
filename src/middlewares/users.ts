import { connect } from '../database'
import { RequestHandler } from "express"
import jwt from 'jsonwebtoken'
import { refresh, sign, verify } from "../services/jwt"

const getManyUsers: RequestHandler = async (req, res) => {
  const db = await connect()
  const users = await db.all('SELECT id, name, email FROM users')
  res.json(users)
}

const createUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { name, email, password } = req.body
  const result = await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, password])
  const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [result.lastID])
  res.json(user)
}


const updateUser: RequestHandler = async (req, res) => {

    const { name, email } = req.body
    const { id } = req.params
   
    //Verifica se o usuário está logado
    if (!req.headers.authorization)
        return res.status(401).json({ message: 'No token provided' })

    try {
        //Peguei o token enviado, e descriptografei com o methoto verify
        type MyToken = {
            id: string
            email: string
            iat: number
            exp: number
          }        

        const decodedToken = jwt.verify(req.headers.authorization, 'edineiaa') as MyToken;

        //Se o usuário for diferente retorna erro, senão segue a requisição
        if(decodedToken.id != id){
            return res.status(401).json({ message: 'Não autorizado' })
        }

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError)
        return res.status(401).json({ message: 'Token expired' })

        if (err instanceof jwt.NotBeforeError)
        return res.status(401).json({ message: 'Token not active yet' })

        if (err instanceof jwt.JsonWebTokenError)
        return res.status(401).json({ message: 'Invalid token' })

        res.status(401).send('Invalid token [n]')
    }


  const db = await connect()

  await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, id])
  const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
  res.json(user)
}

const deleteUser: RequestHandler = async (req, res) => {
  const db = await connect()
  const { id } = req.params

  //Caso não esteja logado, retorna erro
  if (!req.headers.authorization)
    return res.status(401).json({ message: 'No token provided' })

    try {
        //Peguei o token enviado, e descriptografei com o methoto verify
        type MyToken = {
            id: string
            email: string
            iat: number
            exp: number
        }        

        const decodedToken = jwt.verify(req.headers.authorization, 'edineiaa') as MyToken;

        //Se o usuário for diferente retorna erro, senão segue a requisição
        if(decodedToken.id != id){
            return res.status(401).json({ message: 'Não autorizado' })
        }

    } catch (err) {
        if (err instanceof jwt.TokenExpiredError)
        return res.status(401).json({ message: 'Token expired' })

        if (err instanceof jwt.NotBeforeError)
        return res.status(401).json({ message: 'Token not active yet' })

        if (err instanceof jwt.JsonWebTokenError)
        return res.status(401).json({ message: 'Invalid token' })

        res.status(401).send('Invalid token [n]')
    }

  await db.run('DELETE FROM users WHERE id = ?', [id])
  res.json({ message: 'User deleted' })
}

export default { 
  getManyUsers, 
  createUser, 
  updateUser, 
  deleteUser 
}